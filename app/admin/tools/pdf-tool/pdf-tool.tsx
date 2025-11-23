// "use client";

// import React, { useState, useRef, useCallback, useEffect } from "react";
// // Assuming these utility components are correctly imported from your Next.js setup
// import { Button } from "@/components/ui/button"; 
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// // Assuming these libraries are correctly installed via npm/yarn
// import PptxGenJS from "pptxgenjs";
// import * as pdfjsLib from "pdfjs-dist";

// // Configure PDF.js worker (This line should remain outside the component for global effect)
// if (pdfjsLib) {
//     pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
// }

// export default function PDFPPTTool() {
//   const [file, setFile] = useState<File | null>(null);
//   const [downloadUrl, setDownloadUrl] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [error, setError] = useState<string>("");
//   // Refers to the hidden canvas element used for PDF rendering
//   const canvasRef = useRef<HTMLCanvasElement>(null); 

//   const MAX_PAGES = 10;
//   const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setError("");
//     setDownloadUrl("");
    
//     if (e.target.files && e.target.files[0]) {
//       const selectedFile = e.target.files[0];
      
//       // Validate file type
//       if (selectedFile.type !== "application/pdf") {
//         setError("Please select a valid PDF file.");
//         return;
//       }
      
//       // Validate file size
//       if (selectedFile.size > MAX_FILE_SIZE) {
//         setError(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
//         return;
//       }
      
//       setFile(selectedFile);
//     }
//   };

//   const convertImageToDataURL = async (canvas: HTMLCanvasElement): Promise<string> => {
//     return new Promise((resolve) => {
//       // Use PNG for high fidelity image conversion
//       const dataUrl = canvas.toDataURL("image/png"); 
//       resolve(dataUrl);
//     });
//   };

//   const handleConvert = useCallback(async () => {
//     if (!file) {
//       setError("Please select a PDF file.");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setProgress(0);

//     const canvas = canvasRef.current;
//     if (!canvas) {
//         setError("Conversion initialization failed: Canvas reference missing.");
//         setLoading(false);
//         return;
//     }

//     try {
//       const arrayBuffer = await file.arrayBuffer();
//       const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
//       const totalPages = Math.min(pdf.numPages, MAX_PAGES);
      
//       if (totalPages === 0) {
//         throw new Error("PDF contains no pages.");
//       }

//       // 1. Create presentation
//       const pptx = new PptxGenJS();
//       // Use 16:9, which results in approximately 10 inches wide by 5.625 inches high
//       pptx.layout = "LAYOUT_16x9"; 
      
//       // Get the standard slide dimensions from the PPTX object
//       const slideWidth = pptx.presLayout.width; 
//       const slideHeight = pptx.presLayout.height; 
//       const slideRatio = slideWidth / slideHeight;
      
//       // 2. Process each page
//       for (let i = 1; i <= totalPages; i++) {
//         try {
//           const page = await pdf.getPage(i);
//           // Use a higher scale for better output image quality
//           const scale = 2.0; 
//           const viewport = page.getViewport({ scale });
          
//           const context = canvas.getContext("2d", { alpha: false });
//           if (!context) throw new Error("Could not get canvas context.");

//           // Set canvas dimensions
//           canvas.width = viewport.width;
//           canvas.height = viewport.height;

//           // Render PDF page to canvas
//           await page.render({
//             canvasContext: context,
//             viewport: viewport,
//             intent: "print"
//           }).promise;

//           // Convert to image data URL
//           const imgData = await convertImageToDataURL(canvas);

//           // 3. Calculate optimized image dimensions for the slide
//           const imgRatio = viewport.width / viewport.height;
//           let w, h, x, y;

//           if (imgRatio > slideRatio) {
//               // PDF image is wider (more landscape) than the slide ratio: fit width-wise
//               w = slideWidth;
//               h = slideWidth / imgRatio;
//               x = 0;
//               y = (slideHeight - h) / 2; // Center vertically
//           } else {
//               // PDF image is taller (more portrait) than the slide ratio: fit height-wise
//               h = slideHeight;
//               w = slideHeight * imgRatio;
//               x = (slideWidth - w) / 2; // Center horizontally
//               y = 0;
//           }

//           // 4. Add slide with image
//           const slide = pptx.addSlide();
//           slide.background = { color: "FFFFFF" }; // White background
          
//           slide.addImage({
//             data: imgData,
//             x: x,
//             y: y,
//             w: w,
//             h: h
//           });

//           // Add page number at the bottom right corner
//           slide.addText(`Page ${i}/${totalPages}`, {
//             x: slideWidth - 1.5, // 1.5 inches from the right edge
//             y: slideHeight - 0.4, // 0.4 inches from the bottom edge
//             w: 1.5,
//             h: 0.3,
//             fontSize: 8,
//             align: 'right',
//             color: "666666"
//           });

//           // Update progress
//           setProgress(Math.round((i / totalPages) * 100));
          
//         } catch (pageError) {
//           console.error(`Error processing page ${i}:`, pageError);
//           // If one page fails, throw an error to stop conversion
//           throw new Error(`Failed to process page ${i}. Conversion aborted.`); 
//         }
//       }

//       // 5. Generate and download
//       const blob = await pptx.write({ outputType: "blob" });
//       const url = URL.createObjectURL(blob);
//       setDownloadUrl(url);
//       setProgress(100);

//     } catch (err) {
//       console.error("Conversion error:", err);
//       setError(err instanceof Error ? err.message : "An unknown error occurred during conversion.");
//     } finally {
//       setLoading(false);
//     }
//   }, [file]);

//   const resetConverter = () => {
//     setFile(null);
//     setDownloadUrl("");
//     setError("");
//     setProgress(0);
//     // Reset file input element
//     const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
//     if (fileInput) fileInput.value = "";
//   };

//   return (
//     <div className="flex justify-center items-center min-h-[80vh] p-4">
//       <Card className="w-full max-w-lg shadow-xl border border-gray-200 dark:border-gray-700">
//         <CardHeader className="text-center">
//           <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
//             📄 PDF → PPT Converter
//           </CardTitle>
//           <p className="text-sm text-gray-500 mt-1">
//             Converts PDF pages to PPT slides (max {MAX_PAGES} pages, {MAX_FILE_SIZE / 1024 / 1024}MB max)
//           </p>
//         </CardHeader>
        
//         <CardContent className="space-y-4">
//           {/* Hidden canvas for rendering (must be present for the ref to work) */}
//           <canvas ref={canvasRef} className="hidden" />
          
//           {/* File Input */}
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//               Select PDF File
//             </label>
//             <input
//               type="file"
//               accept=".pdf,application/pdf"
//               onChange={handleFileChange}
//               // Tailwind classes for styling the input file element
//               className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//             />
//           </div>

//           {/* File Info */}
//           {file && (
//             <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
//               <p className="text-sm text-indigo-700 dark:text-indigo-300">
//                 <strong>Selected:</strong> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
//               </p>
//             </div>
//           )}

//           {/* Progress Bar */}
//           {loading && (
//             <div className="space-y-2">
//               <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
//                 <div 
//                   className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
//                   style={{ width: `${progress}%` }}
//                 ></div>
//               </div>
//               <p className="text-sm text-center text-gray-600 dark:text-gray-400">
//                 Converting... {progress}%
//               </p>
//             </div>
//           )}

//           {/* Error Message */}
//           {error && (
//             <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
//               <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex gap-2">
//             <Button
//               onClick={handleConvert}
//               disabled={!file || loading}
//               className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
//             >
//               {loading ? (
//                 <span className="flex items-center gap-2">
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   Converting...
//                 </span>
//               ) : (
//                 "Convert to PPT"
//               )}
//             </Button>
            
//             {(file || downloadUrl) && !loading && (
//               <Button
//                 onClick={resetConverter}
//                 // Assuming 'outline' variant is available from your ui/button
//                 variant="outline"
//                 className="flex-1 border-gray-300 hover:bg-gray-100"
//               >
//                 Reset
//               </Button>
//             )}
//           </div>

//           {/* Download Link */}
//           {downloadUrl && (
//             <div className="mt-4 p-4 border border-green-200 dark:border-green-800 rounded-md bg-green-50 dark:bg-green-900/20 text-center">
//               <p className="text-sm text-green-700 dark:text-green-300 mb-2">
//                 ✅ Conversion successful!
//               </p>
//               <a
//                 href={downloadUrl}
//                 download="converted-presentation.pptx"
//                 className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
//                 // Clean up the object URL after download
//                 onClick={() => URL.revokeObjectURL(downloadUrl)}
//               >
//                 Download PPT Presentation
//               </a>
//             </div>
//           )}

//           {/* Instructions */}
//           <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
//             <h4 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Conversion Details:</h4>
//             <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
//               <li>• Each PDF page is converted to a PNG image, fitted and centered on a new 16:9 slide.</li>
//               <li>• Limited to processing the first {MAX_PAGES} pages to maintain browser stability.</li>
//               <li>• Max file size is {(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB.</li>
//             </ul>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }













"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PptxGenJS from "pptxgenjs";
import pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.entry";

export default function PDFPPTTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDownloadUrl("");
    }
  };

  const handleConvert = async () => {
    if (!file) return alert("Please select a PDF file first");
    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const pptx = new PptxGenJS();

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;
        const imgData = canvas.toDataURL("image/png");
        const slide = pptx.addSlide();
        slide.addImage({ data: imgData, x: 0, y: 0, w: 10, h: 5.63 });
      }

      // replace line 376 with:
const blob = await pptx.write({ type: "blob" } as any);
// Tell TypeScript: this is a Blob
const url = URL.createObjectURL(blob as Blob);
setDownloadUrl(url);


    } catch (err) {
      console.error(err);
      alert("Error converting PDF to PPT: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4">
      <Card className="w-full max-w-lg shadow-xl border border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">📄 PDF → PPT Converter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full border p-2 rounded-md"
          />
          <Button
            onClick={handleConvert}
            disabled={!file || loading}
            className="w-full"
          >
            {loading ? "Converting..." : "Convert PDF to PPT"}
          </Button>

          {downloadUrl && (
            <div className="mt-4 p-3 border rounded bg-gray-50 dark:bg-gray-900 text-center">
              <a
                href={downloadUrl}
                download={file?.name.replace(".pdf", ".pptx") || "converted.pptx"}
                className="text-blue-600 hover:underline font-medium"
              >
                Download PPTX
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
