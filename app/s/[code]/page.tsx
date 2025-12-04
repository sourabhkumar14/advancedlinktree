"use client";

export default function Page({ params }: { params: { code: string } }) {
  const { code } = params;

  // Read from localStorage
  const store: Record<string, string> =
    JSON.parse(localStorage.getItem("shortLinks") || "{}");

  const original = store[code];

  if (original) {
    window.location.href = original;
  }

  return <div>Redirecting...</div>;
}
