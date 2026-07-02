import Image from "next/image";
import { ToastContainer } from "react-toastify";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
            <div className="flex-1 relative min-h-screen hidden md:block">
        <Image
          src="/grocery_image.png"
          alt="grocery"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end px-20 pb-20">
          <div className="text-white max-w-lg flex flex-col items-center text-center drop-shadow-2xl">
  <h1 className="text-4xl font-bold mb-4">
    Welcome to Click Shop
  </h1>
  <p className="text-2xl leading-relaxed text-white/90 ">
    Find all your daily needs here at low prices and more
    complete, hassle-free, and faster delivery.
  </p>
</div>
        </div>
      </div>

      {/* Left side: Auth form */}
      <div
        className="
          w-full
          max-w-lg
          min-h-screen
          p-6
          bg-gradient-to-br
          from-[#fdfefe] via-[#ffeef4] to-[#eafbf1]
        "
      >
        <div className="flex justify-center mb-6">
          <Image
            src="/cookie.jpg"
            width={80}
            height={80}
            alt="Logo"
            className="rounded-full"
          />
        </div>

        {children}
              <ToastContainer position="top-right" autoClose={3000} />

      </div>
    </div>
  );
}
