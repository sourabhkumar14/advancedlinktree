// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { PDFDocument } from "pdf-lib";

// export default function PDFTool() {
//   const [file, setFile] = useState<File | null>(null);
//   const [downloadUrl, setDownloadUrl] = useState<string>("");
//   const [originalSize, setOriginalSize] = useState<number>(0);
//   const [compressedSize, setCompressedSize] = useState<number>(0);
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0]);
//       setDownloadUrl("");
//       setOriginalSize(e.target.files[0].size);
//       setCompressedSize(0);
//     }
//   };

//   const handleCompress = async () => {
//     if (!file) return alert("Please select a PDF first");

//     try {
//       setLoading(true);
//       const arrayBuffer = await file.arrayBuffer();
//       const pdfDoc = await PDFDocument.load(arrayBuffer);

//       // PDF-lib cannot compress images directly but can optimize objects
//       const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
//       setCompressedSize(pdfBytes.byteLength);

//       const blob = new Blob([pdfBytes], { type: "application/pdf" });
//       const url = URL.createObjectURL(blob);
//       setDownloadUrl(url);
//     } catch (err) {
//       console.error(err);
//       alert("Error processing PDF");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatBytes = (bytes: number) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   return (
//     <div className="flex justify-center items-center min-h-[80vh]">
//       <Card className="w-full max-w-md shadow-md">
//         <CardHeader>
//           <CardTitle className="text-center text-xl font-semibold">
//             📄 PDF Compressor
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <input
//             type="file"
//             accept="application/pdf"
//             onChange={handleFileChange}
//             className="w-full border p-2 rounded"
//           />
//           <Button
//             onClick={handleCompress}
//             className="w-full"
//             disabled={!file || loading}
//           >
//             {loading ? "Processing..." : "Compress PDF"}
//           </Button>

//           {file && (
//             <div className="mt-2 text-sm">
//               Original Size: {formatBytes(originalSize)}
//             </div>
//           )}
//           {compressedSize > 0 && (
//             <div className="mt-1 text-sm">
//               Compressed Size: {formatBytes(compressedSize)}
//             </div>
//           )}

//           {downloadUrl && (
//             <div className="mt-4 text-center">
//               <a
//                 href={downloadUrl}
//                 download={file?.name.replace(".pdf", "-compressed.pdf")}
//                 className="text-blue-600 hover:underline"
//               >
//                 Click here to download compressed PDF
//               </a>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }














"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PDFDocument } from "pdf-lib";

export default function PDFToolPage() {
  const [file, setFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setDownloadUrl("");
      setOriginalSize(selectedFile.size / (1024 * 1024)); // in MB
      setCompressedSize(0);
    }
  };

  const handleCompress = async () => {
  if (!file) return alert("Please select a PDF");

  setLoading(true);

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // Minimal compression (rebuild PDF)
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });

    // FIX: use pdfBytes.buffer for Blob
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    setDownloadUrl(url);
    setCompressedSize(blob.size / (1024 * 1024)); // in MB
  } catch (err) {
    console.error(err);
    alert("Error processing PDF");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4">
      <Card className="w-full max-w-lg shadow-xl border border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">📄 PDF Compressor</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Upload your PDF to compress it
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full border p-2 rounded-md"
          />

          {file && (
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p>
                <strong>File Name:</strong> {file.name}
              </p>
              <p>
                <strong>Original Size:</strong> {originalSize.toFixed(2)} MB
              </p>
            </div>
          )}

          <Button
            onClick={handleCompress}
            disabled={!file || loading}
            className="w-full"
          >
            {loading ? "Compressing..." : "Compress PDF"}
          </Button>

          {downloadUrl && (
            <div className="mt-4 p-3 border rounded bg-gray-50 dark:bg-gray-900 text-center">
              <p className="text-sm mb-2">
                Compressed Size: {compressedSize.toFixed(2)} MB
              </p>
              <a
                href={downloadUrl}
                download={file?.name || "compressed.pdf"}
                className="text-blue-600 hover:underline font-medium"
              >
                Click here to download
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
