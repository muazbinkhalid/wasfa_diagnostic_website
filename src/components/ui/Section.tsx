import Link from "next/link";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function PageHero({ title, subtitle, badge }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-glow to-pink-100/50" />
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-pink-300/30 blob" />
      <div className="absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-pink-400/20 blob" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        {badge && (
          <span className="mb-4 inline-block rounded-full border border-pink-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-pink-600">
            {badge}
          </span>
        )}
        <h1 className="font-display text-4xl font-bold tracking-tight text-pink-900 md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg text-pink-700/80">{subtitle}</p>
        )}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-14 ${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-pink-500">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-bold text-pink-900 md:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-pink-700/75">{description}</p>
      )}
    </div>
  );
}

export function PrimaryLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-pink-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-300/40 transition-all hover:scale-[1.02] hover:shadow-pink-400/50 ${className}`}
    >
      {children}
    </Link>
  );
}
