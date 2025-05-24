"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or expired reset link.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return;

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setMessage(data.message || data.error);

    if (res.ok) {
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-sm w-96 border border-slate-200"
      >
        <div className="flex justify-center mb-6">
          <Image 
            src="./assets/SalesFlow-green.svg"
            width={120}
            height={120}
            alt='SalesFlow'
            draggable='false'
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-500"
            required
          />
        </div>
        <button
          type="submit"
          className="font-semibold w-full bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Reset Password
        </button>
        {message && (
          <p className="mt-4 text-sm text-center text-rose-400">{message}</p>
        )}
      </form>
    </div>
  );
}