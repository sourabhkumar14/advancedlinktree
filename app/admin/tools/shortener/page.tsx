// "use client";

// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// export default function URLShortener() {
//   const [url, setUrl] = useState("");
//   const [shortUrl, setShortUrl] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleShorten = async () => {
//     if (!url.trim()) return alert("Please enter a valid URL");

//     setLoading(true);
//     try {
//       const res = await fetch("/api/shortener", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ url }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setShortUrl(data.shortUrl);
//       } else {
//         alert(data.error || "Failed to shorten URL");
//       }
//     } catch (err) {
//       alert("Something went wrong!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCopy = async () => {
//     if (shortUrl) {
//       await navigator.clipboard.writeText(shortUrl);
//       alert("Copied to clipboard!");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-[80vh]">
//       <Card className="w-full max-w-md shadow-md">
//         <CardHeader>
//           <CardTitle className="text-center text-xl font-semibold">
//             🔗 Real URL Shortener
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <Input
//             type="url"
//             placeholder="Enter your URL (https://example.com)"
//             value={url}
//             onChange={(e) => setUrl(e.target.value)}
//           />
//           <Button onClick={handleShorten} disabled={loading} className="w-full">
//             {loading ? "Shortening..." : "Shorten URL"}
//           </Button>

//           {shortUrl && (
//             <div className="mt-4 p-3 border rounded bg-gray-50 dark:bg-gray-900">
//               <p className="text-sm text-center mb-2">Your short link:</p>
//               <div className="flex justify-between items-center">
//                 <a
//                   href={shortUrl}
//                   target="_blank"
//                   className="text-blue-600 hover:underline truncate"
//                 >
//                   {shortUrl}
//                 </a>
//                 <Button size="sm" onClick={handleCopy}>
//                   Copy
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }







































//ye wala url real me kar raha hai//


"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function URLShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generateCode = () => Math.random().toString(36).substring(2, 8);

  const handleShorten = () => {
    if (!url.trim() || !url.startsWith("http")) return alert("Please enter a valid URL");

    setLoading(true);
    const code = generateCode();

    // Save to localStorage
    const store = JSON.parse(localStorage.getItem("shortLinks") || "{}");
    store[code] = url;
    localStorage.setItem("shortLinks", JSON.stringify(store));

    const base = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    setShortUrl(`${base.replace(/\/$/, "")}/s/${code}`);
    setLoading(false);
  };

  const handleCopy = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl);
      alert("Copied to clipboard!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-4">
      <Card className="w-full max-w-lg shadow-2xl rounded-2xl border border-gray-200 overflow-hidden">
        <CardHeader className="bg-indigo-100 p-6">
          <CardTitle className="text-center text-2xl font-bold text-indigo-700">
            🔗 URL Shortener
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <p className="text-center text-gray-600">
            Enter any URL and get a short link instantly.
          </p>

          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-400"
          />

          <Button
            onClick={handleShorten}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-2 shadow-lg transition-colors duration-200"
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </Button>

          {shortUrl && (
            <div className="mt-4 p-4 rounded-lg border border-gray-300 bg-indigo-50 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 md:space-x-4">
              <a
                href={shortUrl}
                target="_blank"
                className="text-indigo-800 font-medium truncate hover:underline"
              >
                {shortUrl}
              </a>
              <Button
                onClick={handleCopy}
                size="sm"
                className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-1"
              >
                Copy
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
