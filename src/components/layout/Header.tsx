"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { navLinks } from "@/lib/site-config";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      gsap.from(headerRef.current, {
        y: -80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    },
    { scope: headerRef },
  );

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-lg shadow-pink-200/30" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="WASFA Diagnostic Center"
            width={44}
            height={44}
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-bold tracking-wide text-pink-800">WASFA</p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-pink-500">
              Diagnostic Center
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  active
                    ? "bg-pink-500 text-white shadow-md shadow-pink-300/50"
                    : "text-pink-700 hover:bg-pink-100 hover:text-pink-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/portal"
          className="hidden rounded-full bg-gradient-to-r from-pink-500 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-300/40 transition-all hover:shadow-pink-400/50 lg:inline-flex"
        >
          View Reports
        </Link>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-pink-200 bg-white/80 lg:hidden"
        >
          <span className="flex flex-col gap-1.5">
            <span className={`block h-0.5 w-5 bg-pink-600 transition-all ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-pink-600 transition-all ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-pink-600 transition-all ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 lg:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="glass mx-5 mb-4 flex flex-col gap-1 rounded-2xl p-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-4 py-3 text-sm font-medium text-pink-800 hover:bg-pink-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
