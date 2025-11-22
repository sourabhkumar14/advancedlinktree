

// work one time api


// import axios from "axios";
// import FormData from "form-data";

// export async function convertPdfToPpt(pdfBuffer: Buffer) {
//   try {
//     const form = new FormData();
//     form.append("File", pdfBuffer, "input.pdf");
//     form.append("StoreFile", "true"); // ensures URL is returned

//     const response = await axios.post(
//       "https://v2.convertapi.com/convert/pdf/to/pptx",
//       form,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.CONVERTAPI_KEY}`,
//           ...form.getHeaders(),
//         },
//         maxBodyLength: Infinity,
//         responseType: "json",
//       }
//     );

//     // Check if API returned the file URL
//     if (!response.data?.Files?.[0]?.Url) {
//       throw new Error("ConvertAPI did not return a download URL. Check your API key and PDF file.");
//     }

//     const downloadUrl = response.data.Files[0].Url;

//     // Download the converted PPTX
//     const pptFile = await axios.get(downloadUrl, { responseType: "arraybuffer" });
//     return Buffer.from(pptFile.data);

//   } catch (err) {
//     console.error("ConvertAPI conversion error:", err.response?.data || err.message);
//     throw new Error("Failed to convert PDF → PPTX");
//   }
// }


















import axios from "axios";
import FormData from "form-data";

export async function convertPdfToPpt(pdfBuffer: Buffer) {
  try {
    const form = new FormData();
    form.append("File", pdfBuffer, "input.pdf"); // must be binary buffer
    form.append("StoreFile", "true"); // ensures a URL is returned

    const response = await axios.post(
      "https://v2.convertapi.com/convert/pdf/to/pptx",
      form,
      {
        headers: {
          Authorization: `Bearer ${process.env.CONVERTAPI_KEY}`,
          ...form.getHeaders(),
        },
        maxBodyLength: Infinity,
        timeout: 60000, // 60s timeout
        responseType: "json",
      }
    );

    // DEBUG: log the full response
    console.log("ConvertAPI response:", response.data);

    if (!response.data?.Files?.[0]?.Url) {
      throw new Error(
        "ConvertAPI did not return a download URL. Check API key, PDF size, and file validity."
      );
    }

    const downloadUrl = response.data.Files[0].Url;

    const pptFile = await axios.get(downloadUrl, { responseType: "arraybuffer" });
    return Buffer.from(pptFile.data);
  } catch (err: any) {
    console.error(
      "ConvertAPI conversion error:",
      err.response?.data || err.message
    );
    throw new Error("Failed to convert PDF → PPTX");
  }
}
