'use client';

import Image from 'next/image';
import Link from 'next/link';

type CategoryCardProps = {
  title: string;
  image: string;
  href: string;
};

export default function CategoryCard({
  title,
  image,
  href,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 px-4 py-2 rounded-xl transition-colors"
      style={{ border: "1px solid var(--border-subtle)" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      {/* Icon */}
      <div className="relative w-6 h-6 shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain group-hover:scale-105 transition-transform"
        />
      </div>

      {/* Title */}
      <span
        className="text-sm font-medium transition-colors"
        style={{ color: "var(--text-primary)" }}
      >
        <span className="group-hover:text-[var(--gold-primary)]">{title}</span>
      </span>
    </Link>
  );
}