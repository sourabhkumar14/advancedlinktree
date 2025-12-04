// app/api/og-data/route.ts
import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

interface OGData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
  type?: string;
  favicon?: string;
}

export const runtime = "nodejs";       // important: enables Node.js features
export const dynamic = "force-dynamic"; // prevents static caching

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // 1. Validate the URL
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    // 2. Fetch the target page
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkPreview/1.0)",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const ogData: OGData = {};

    // 3. Extract OpenGraph meta tags
    $('meta[property^="og:"]').each((_, tag) => {
      const property = $(tag).attr("property");
      const content = $(tag).attr("content");

      if (!property || !content) return;

      if (property === "og:title") ogData.title = content;
      if (property === "og:description") ogData.description = content;
      if (property === "og:image") ogData.image = content;
      if (property === "og:url") ogData.url = content;
      if (property === "og:site_name") ogData.siteName = content;
      if (property === "og:type") ogData.type = content;
    });

    // 4. Twitter fallbacks
    ogData.title ??= $('meta[name="twitter:title"]').attr("content");
    ogData.description ??= $('meta[name="twitter:description"]').attr("content");
    ogData.image ??= $('meta[name="twitter:image"]').attr("content");

    // 5. HTML fallbacks
    ogData.title ??= $("title").text();
    ogData.description ??= $('meta[name="description"]').attr("content");

    // 6. Favicon
    const faviconHref =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href");

    if (faviconHref) {
      ogData.favicon = faviconHref.startsWith("http")
        ? faviconHref
        : new URL(faviconHref, url).href;
    }

    // 7. Convert relative OG image URL to absolute
    if (ogData.image && !ogData.image.startsWith("http")) {
      ogData.image = new URL(ogData.image, url).href;
    }

    return NextResponse.json(ogData);
  } catch (error) {
    console.error("Error fetching OG data:", error);
    return NextResponse.json(
      { error: "Failed to fetch Open Graph data" },
      { status: 500 }
    );
  }
}
