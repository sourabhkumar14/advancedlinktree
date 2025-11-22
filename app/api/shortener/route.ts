// import { NextResponse } from "next/server";

// type URLData = {
//   code: string;
//   original: string;
// };

// const db: URLData[] = []; // in-memory temporary DB (you can later connect Prisma)

// export async function POST(req: Request) {
//   try {
//     const { url } = await req.json();

//     if (!url || !/^https?:\/\//.test(url)) {
//       return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
//     }

//     // generate a short unique code
//     const code = Math.random().toString(36).substring(2, 8);
//     db.push({ code, original: url });

//     const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/s/${code}`;

//     return NextResponse.json({ shortUrl });
//   } catch (error) {
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }

// // Redirect handler (for GET requests)
// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const code = searchParams.get("code");

//   if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

//   const found = db.find((entry) => entry.code === code);
//   if (!found) return NextResponse.json({ error: "URL not found" }, { status: 404 });

//   return NextResponse.redirect(found.original);
// }











///this working also 2nd code after original  ///







import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateCode() {
  return Math.random().toString(36).substring(2, 8);
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || !url.startsWith("http")) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    let code = generateCode();
    while (await prisma.shortUrl.findUnique({ where: { code } })) {
      code = generateCode();
    }

    const record = await prisma.shortUrl.create({
      data: { code, original: url },
    });

    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    return NextResponse.json({ shortUrl: `${base}/s/${record.code}` });
  } catch (err) {
    console.error("Shortener error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



















