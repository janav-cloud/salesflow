"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      alert("Invalid credentials");
    } else {
      router.push("/dashboard");
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
            src="./assets/SalesFlow-blue.svg"
            width={120}
            height={120}
            alt='SalesFlow'
            draggable='false'
            onContextMenu={(e) => e.preventDefault()}
          />
          <span className="text-lg font-semibold text-slate-700">Login to your account 🔐</span>
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-slate-800 w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-slate-800 w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-500 text-white p-3 rounded-lg font-semibold hover:bg-cyan-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2"
        >
          Sign In
        </button>
        <div className="mt-4 text-center">
          <a
            href="/forgot-password"
            className="text-sm text-cyan-500 hover:underline"
          >
            Forgot password?
          </a>
        </div>
        <div className="mt-6 text-center">
          <span className="text-sm text-slate-600">Don't have an account?</span>{" "}
          <a href="/signup" className="font-semibold text-sm text-cyan-600 hover:underline">
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
}