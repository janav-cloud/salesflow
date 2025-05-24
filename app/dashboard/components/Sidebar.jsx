"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LayoutDashboard, Users, Mail, User, LogOut, LayoutIcon, CircleDollarSign, CalendarCheck } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`md:hidden fixed top-25 left-5 bg-emerald-800 text-slate-100 p-2 rounded-full z-50 ${isOpen? 'hidden':'-hidden'} transition-all`}
      >
        <LayoutIcon className={`w-8 h-8`} />
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-emerald-800 text-slate-100 p-5 transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } md:translate-x-0 md:relative md:flex md:flex-col`}
      >
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <button onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="space-y-4">
                  <a
            href="/dashboard"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              pathname === "/dashboard"
                ? "bg-emerald-700"
                : "hover:bg-emerald-700"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" /> Overview
          </a>

          <a
            href="/dashboard/leads"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              pathname === "/dashboard/leads"
                ? "bg-emerald-700"
                : "hover:bg-emerald-700"
            }`}
          >
            <Users className="w-5 h-5" /> Leads
          </a>

          <a
            href="/dashboard/emails"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              pathname === "/dashboard/emails"
                ? "bg-emerald-700"
                : "hover:bg-emerald-700"
            }`}
          >
            <Mail className="w-5 h-5" /> Emails
          </a>

          <a
            href="/dashboard/sales-optimization"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              pathname === "/dashboard/emails"
                ? "bg-emerald-700"
                : "hover:bg-emerald-700"
            }`}
          >
            <CircleDollarSign className="w-5 h-5" /> Sales
          </a>
        </nav>

        <div className="absolute bottom-5 md:bottom-25 right-5 left-5 flex flex-col justify-end">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-700">
            <User className="w-6 h-6" />
            <div>
              <p className="text-sm font-semibold">{user?.email || "Guest"}</p>
              <p className="text-xs text-gray-300">{user?.company || "No Company"}</p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-rose-700 hover:bg-rose-600 transition duration-300 w-full"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
