"use client";

import Image from "next/image";

export default function FullScreenLoader() {
  return (
<div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-linear-to-br from-black/40 via-black/30 to-black/40">
        
        <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64">
          <Image
            src="/loader.gif"
            alt="Loading"
            fill
            className="object-contain"
            unoptimized
            priority
          />
        </div>

        <p className="text-base sm:text-lg text-gray-800 font-medium animate-pulse">
          Loading your groceries...
        </p>
      </div>

  );
}
