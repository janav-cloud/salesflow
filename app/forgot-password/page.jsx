"use client";

import { useState } from "react";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-sm w-96 border border-slate-200"
      >
        <div className="flex flex-col items-center gap-5 mb-6">
          <Image 
            src="./assets/SalesFlow-blue.svg"
            width={120}
            height={120}
            alt='SalesFlow'
            draggable='false'
            onContextMenu={(e) => e.preventDefault()}
          />
           <span className="text-lg font-semibold text-slate-700">Forgot Password 🤔</span>
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            required
          />
        </div>
        <button
          type="submit"
          className="font-semibold w-full bg-cyan-500 text-white p-3 rounded-lg hover:bg-cyan-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
        >
          Send Reset Link
        </button>
        {message && (
          <p className="mt-4 text-sm text-center text-slate-600">{message}</p>
        )}
        <div className="mt-6 text-center">
          <span className="text-sm text-slate-600">Remember your password?</span>{" "}
          <a href="/login" className="font-semibold text-sm text-cyan-500 hover:underline">
            Log in
          </a>
        </div>
      </form>
    </div>
  );
}