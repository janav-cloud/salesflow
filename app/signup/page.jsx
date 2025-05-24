"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignupPage() {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ company, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/login");
    } else {
      alert("Error signing up! Try again after sometime or use a different Email ID.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-sm w-96 border border-slate-200"
      >
        <div className="flex flex-col items-center gap-5 mb-4">
          <Image 
            src="./assets/SalesFlow-green.svg"
            width={120}
            height={120}
            alt='SalesFlow'
            draggable='false'
            onContextMenu={(e) => e.preventDefault()}
          />
          <span className="text-lg font-semibold text-slate-700">Join Us!</span>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="text-slate-800 w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-500"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-slate-800 w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-500"
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-slate-800 w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-500"
            required
          />
        </div>
        <button
          type="submit"
          className="font-semibold w-full bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Register
        </button>
        <div className="mt-6 text-center">
          <span className="text-sm text-slate-600">Already have an account?</span>{" "}
          <a href="/login" className="font-semibold text-sm text-emerald-600 hover:underline">
            Log in
          </a>
        </div>
      </form>
    </div>
  );
}