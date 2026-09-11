import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Link from 'next/link';

export function WhatsAppBanner() {
  return (
    <div className="bg-emerald-600 px-4 py-2 text-center text-xs md:text-sm font-semibold text-white flex items-center justify-center gap-2 shadow-md">
      <span>Get instant live tips and VIP updates directly on WhatsApp!</span>
      <Link
        href="https://whatsapp.com/channel/0029VbBUJIG0lwgqvIFL1I3r"
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-bold hover:text-emerald-200 transition"
      >
        Join Channel →
      </Link>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Team GOLO golo - Winning Starts Here",
  description: "Premium sports prediction tips subscription platform.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-100 text-gray-900 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <footer className="bg-black text-white p-6 text-center mt-auto">
          <p className="text-yellow-500 font-bold mb-2">TEAM GOLO GOLO - Winning Starts Here!</p>
          <p className="text-sm text-gray-400 mb-4">© {new Date().getFullYear()} Team GOLO golo. All rights reserved.</p>
          <div className="flex justify-center items-center gap-4 mb-4 text-sm text-gray-400">
            <a href="https://wa.me/256774032355" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white font-bold transition-colors">
              <span className="text-yellow-500">📞</span> WhatsApp
            </a>
            <span className="text-gray-600">|</span>
            <a href="https://vt.tiktok.com/ZSVUB7aKa/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white font-bold transition-colors">
              <span className="text-yellow-500">🎵</span> TikTok
            </a>
            <span className="text-gray-600">|</span>
            <a href="https://t.me/omusajjawaodd256" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white font-bold transition-colors">
              <span className="text-yellow-500">✈️</span> Telegram
            </a>
          </div>
          <div className="flex justify-center gap-4 text-sm text-gray-400">
            <a href="/about" className="hover:text-yellow-500 transition-colors">About</a>
            <a href="/contact" className="hover:text-yellow-500 transition-colors">Contact Us</a>
            <a href="/terms" className="hover:text-yellow-500 transition-colors">Terms of Service</a>
            <a href="/privacy" className="hover:text-yellow-500 transition-colors">Privacy Policy</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
