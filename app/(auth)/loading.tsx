import Image from "next/image";

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-grey-600">
      <div className="flex flex-col items-center gap-4">
        
        <Image
          src="/loader.gif"
          alt="Loading"
          width={100}
          height={100}
          unoptimized
        />

        <p className="text-sm text-gray-600 animate-pulse">
          Loading your groceries...
        </p>
      </div>
    </div>
  );
}
