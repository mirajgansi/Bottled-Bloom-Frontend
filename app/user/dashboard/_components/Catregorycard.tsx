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
      className="
        group
        flex items-center gap-4
        px-4 py-2
        rounded-xl
        border border-gray-200
        bg-white
        hover:bg-gray-50
        transition
      "
    >
      {/* Icon */}
      <div className="relative w-6 h-6 shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain group-hover:scale-105 transition"
        />
      </div>

      {/* Title */}
      <span className="text-sm font-medium text-gray-800 group-hover:text-green-600 transition">
        {title}
      </span>
    </Link>
  );
}
