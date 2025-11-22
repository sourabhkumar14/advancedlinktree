//full working code
// 
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RedirectPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    // Read from localStorage
    const store = JSON.parse(localStorage.getItem("shortLinks") || "{}");
    const original = store[params.code];

    if (original) {
      window.location.href = original;
    } else {
      alert("Short URL not found!");
      router.push("/");
    }
  }, [params.code, router]);

  return <p>Redirecting...</p>;
}





