//full working code
// "use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RedirectPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    // Ensure code is a string
    const code = Array.isArray(params.code) ? params.code[0] : params.code;

    // Read from localStorage
    const store: Record<string, string> = JSON.parse(localStorage.getItem("shortLinks") || "{}");
    const original = store[code];

    if (original) {
      window.location.href = original;
    } else {
      alert("Short URL not found!");
      router.push("/");
    }
  }, [params.code, router]);

  return <p>Redirecting...</p>;
}





