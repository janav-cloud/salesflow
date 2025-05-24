"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="bg-slate-100 p-5 flex flex-row justify-between items-center top-0 drop-shadow-md z-50 md:sticky">
        <Link href="/">
          <Image
            src="/assets/SalesFlow-green.svg"
            width={120}
            height={120}
            alt="SalesFlow"
          />
        </Link>

        <div className="hidden md:flex text-slate-800 font-semibold items-center gap-10 text-md z-40 relative">
          <Link href="/about" className="hover:text-slate-600 transition-colors">
            About Us
          </Link>
          <Link
            href="/features"
            className="hover:text-slate-600 transition-colors"
          >
            Features
          </Link>
          <Link
            href="/dashboard"
            className="bg-emerald-600 text-slate-100 px-4 py-1.5 rounded-3xl hover:bg-emerald-700 transition-colors"
          >
            Dashboard
          </Link>
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden text-slate-800 hover:text-slate-600 transition-colors"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden text-sm absolute top-25 right-5 w-[40%] bg-emerald-50 shadow-lg rounded-lg p-4 flex flex-col items-center gap-5 z-50 transition-all duration-300">
          <Link
            href="/about"
            className="text-slate-800 font-semibold hover:text-slate-600 transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/features"
            className="text-slate-800 font-semibold hover:text-slate-600 transition-colors"
          >
            Features
          </Link>
          <Link
            href="/dashboard"
            className="bg-emerald-600 text-slate-100 px-4 py-1.5 rounded-3xl hover:bg-emerald-700 transition-colors text-center"
          >
            Dashboard
          </Link>
        </div>
      )}
    </>
  );
}

export default Navbar;