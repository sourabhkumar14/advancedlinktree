//working one time api



"use client";

import { useState } from "react";

export default function PdfToPptForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const convert = async () => {
    if (!file) return alert("Please upload a PDF!");
    setLoading(true);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch("/admin/tools/pdf-ppt/api", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        alert("Conversion failed!");
        setLoading(false);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pptx";
      a.click();

    } catch (err) {
      console.error(err);
      alert("Conversion failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-5 rounded-xl shadow-md">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mb-4"
      />
      <button
        onClick={convert}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Converting..." : "Convert to PPT"}
      </button>
    </div>
  );
}















//working for multple api 



// "use client";

// import { useState } from "react";

// export default function PdfToPptForm() {
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);

//   const convert = async () => {
//     if (!file) return alert("Please upload a PDF!");
//     setLoading(true);

//     const formData = new FormData();
//     formData.append("pdf", file);

//     try {
//       const res = await fetch("/admin/tools/pdf-ppt/api", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         alert("Conversion failed!");
//         setLoading(false);
//         return;
//       }

//       const blob = await res.blob();
//       const url = URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "converted.pptx";
//       a.click();

//       // Cleanup URL object to free memory
//       URL.revokeObjectURL(url);

//     } catch (err) {
//       console.error(err);
//       alert("Conversion failed!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="border p-5 rounded-xl shadow-md">
//       <input
//         type="file"
//         accept="application/pdf"
//         onChange={(e) => setFile(e.target.files?.[0] ?? null)}
//         className="mb-4"
//       />
//       <button
//         onClick={convert}
//         disabled={loading}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         {loading ? "Converting..." : "Convert to PPT"}
//       </button>
//     </div>
//   );
// }
