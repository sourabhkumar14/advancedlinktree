"use client";

export default function Page({ params }: any) {
  const code = params.code;

  const store: Record<string, string> =
    JSON.parse(localStorage.getItem("shortLinks") || "{}");

  const original = store[code];

  if (original) {
    window.location.href = original;
  }

  return <div>Redirecting...</div>;
}
