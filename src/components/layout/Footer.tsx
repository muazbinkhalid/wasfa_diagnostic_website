import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-pink-100 bg-gradient-to-b from-pink-50 to-white">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pink-200/40 blob" />
      <div className="section-padding relative mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <Image src="/logo.png" alt="WASFA" width={48} height={48} />
              <div>
                <p className="font-bold text-pink-800">{siteConfig.shortName}</p>
                <p className="text-sm text-pink-500">{siteConfig.tagline}</p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-pink-700/80">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-pink-600">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-pink-700">
              <li><Link href="/services" className="hover:text-pink-500">Services</Link></li>
              <li><Link href="/about" className="hover:text-pink-500">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-pink-500">Contact</Link></li>
              <li><Link href="/portal" className="hover:text-pink-500">Patient Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-pink-600">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-pink-700">
              <li>{siteConfig.location}</li>
              <li>
                <a href={`tel:${siteConfig.phone}`} className="hover:text-pink-500">
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`tel:${siteConfig.mobile}`} className="hover:text-pink-500">
                  {siteConfig.mobile}
                </a>
              </li>
              <li className="text-pink-500">{siteConfig.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-pink-100 pt-8 text-sm text-pink-500 md:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>Trusted diagnostics in Jhelum since day one.</p>
        </div>
      </div>
    </footer>
  );
}
