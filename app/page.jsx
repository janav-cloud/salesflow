"use client";

import Link from "next/link";
import Image from "next/image";
import { Typewriter } from "react-simple-typewriter";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-6 text-center">
      <div className="max-w-3xl">
        <Image
          src="/assets/SF-green.svg"
          alt="SalesFlow Logo"
          width={120}
          height={120}
          className="mx-auto mb-6"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
        Salesflow helps you
          <span className="text-emerald-500">
            <Typewriter
              words={[
                ' Automate Your Sales Journey',
                ' Score Leads with AI',
                ' Send Smart Emails',
                ' Forecast Like a Pro'
              ]}
              loop={true}
              cursor
              cursorStyle="/."
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          </span>
        </h1>
        <p className="text-slate-600 text-md md:text-lg mb-6">
          SalesFlow streamlines lead generation, scoring, email automation, CRM integration, and more — all powered by AI.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/signup">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-3xl transition-all">
              Get Started
            </button>
          </Link>
          <Link href="/features">
            <button className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-2 rounded-3xl transition-all">
              Explore Features
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}