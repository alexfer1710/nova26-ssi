"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Hide the navigation bar on Issuer Portal and Web Wallet pages
  if (pathname?.startsWith("/portal-issuer") || pathname?.startsWith("/wallet-holder")) {
    return null;
  }

  return (
    <nav className="fixed w-full border-b border-slate-200/50 transition-all duration-300" style={{ top: 0, zIndex: 50, background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-primary p-2 rounded-xl group-hover:bg-[#312e81] transition-all duration-300 shadow-[0_0_15px_rgba(67,56,202,0.15)]">
            <Image src="/file.svg" alt="Nova 26" width={24} height={24} className="filter drop-shadow-sm invert" />
          </div>
          <Link href="/">
            <span className="text-2xl font-black tracking-tighter text-slate-900 bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">Nova 26</span>
          </Link>
        </div>

        {/* Main Menu */}
        <div className="hidden lg:flex items-center space-x-8 text-sm tracking-widest font-bold text-slate-600 uppercase">
          <Link href="/holder-guide" className="hover:text-primary transition-colors duration-300 relative group">
            Guide
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/privacy-security" className="hover:text-primary transition-colors duration-300 relative group">
            Privacy
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/verify" className="hover:text-primary transition-colors duration-300 relative group">
            Verifier Portal
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/download">
            <button className="hidden md:flex items-center justify-center rounded-2xl h-12 px-6 bg-primary text-white font-black text-sm tracking-widest uppercase hover:bg-[#312e81] hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(67,56,202,0.4)] relative overflow-hidden group">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
              <span className="relative z-10 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">download</span>
                App
              </span>
            </button>
          </Link>
          <button className="lg:hidden text-slate-900 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>

      </div>
    </nav>
  );
}
