import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateCode() {
  return Math.random().toString(36).substring(2, 8);
}

export async function POST(req: Request) {
  try {
    const { url, title, userId } = await req.json(); // add title & userId for Link

    if (!url || !url.startsWith("http")) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // generate a unique code
    let code = generateCode();
    while (await prisma.link.findUnique({ where: { code } })) {
      code = generateCode();
    }

    // create the link
    const record = await prisma.link.create({
      data: {
        title,
        url,
        userId,
        code,
      },
    });

    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    return NextResponse.json({ shortUrl: `${base}/s/${record.code}` });
  } catch (err) {
    console.error("Shortener error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
