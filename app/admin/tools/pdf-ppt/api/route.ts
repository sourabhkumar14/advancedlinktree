// it working api one time 




// import { NextResponse } from "next/server";
// import { convertPdfToPpt } from "../convert";

// export async function POST(req: Request) {
//   try {
//     const form = await req.formData();
//     const pdfFile = form.get("pdf") as File;

//     if (!pdfFile) return NextResponse.json({ error: "No PDF uploaded" }, { status: 400 });

//     const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
//     const pptBuffer = await convertPdfToPpt(pdfBuffer);

//     return new NextResponse(pptBuffer, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//         "Content-Disposition": "attachment; filename=converted.pptx",
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
//   }
// }










import { NextResponse } from "next/server";
import { convertPdfToPpt } from "../convert";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const pdfFile = form.get("pdf") as File;

    if (!pdfFile) {
      return NextResponse.json({ error: "No PDF uploaded" }, { status: 400 });
    }

    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    const pptBuffer = await convertPdfToPpt(pdfBuffer);

    return new NextResponse(pptBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": "attachment; filename=converted.pptx",
      },
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
  }
}
