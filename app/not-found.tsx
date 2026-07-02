import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6 text-center">

      <div className="relative w-40 h-40 sm:w-100 sm:h-100 md:w-200 md:h-100">
        <Image
          src="/404.png" 
          alt="Page not found"
          fill
          className="object-contain"
          priority
        />
      </div>

      <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-gray-900">
        404 - Page Not Found
      </h1>

      <p className="mt-4 max-w-md text-gray-600 text-sm sm:text-base">
        Oops! The page you're looking for doesn’t exist or may have been moved.
      </p>

     

    </div>
  );
}
