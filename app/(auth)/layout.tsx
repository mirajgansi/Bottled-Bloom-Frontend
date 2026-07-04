import Image from "next/image";
import { ToastContainer } from "react-toastify";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Left decorative panel — hidden on mobile */}
      <div className="flex-1 relative min-h-screen hidden md:block overflow-hidden">
        <Image
          src="/perfume.jpg"
          alt="Bottled Bloom"
          fill
          className="object-cover"
          priority
        />
        {/* dark gold gradient overlay so the image blends with the theme */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(15,11,8,0.75) 0%, rgba(15,11,8,0.35) 50%, rgba(15,11,8,0.75) 100%)",
          }}
        />
        <div className="absolute bottom-12 left-12 z-10">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-2"
            style={{ color: "var(--gold-primary)" }}
          >
            Bottled Bloom
          </p>
          <p
            className="text-2xl font-semibold max-w-xs"
            style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
          >
            Fragrances crafted to be remembered
          </p>
        </div>
      </div>

      {/* Form panel — now actually centers its content, both horizontally and vertically */}
      <div
        className="w-full md:max-w-lg min-h-screen flex flex-col items-center justify-center p-6 relative"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        {/* subtle glow behind the logo */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(201,161,93,0.12) 0%, rgba(201,161,93,0) 70%)",
          }}
        />

        <div className="w-full max-w-sm flex flex-col items-center relative z-10">
          <div
            className="rounded-full overflow-hidden mb-6"
            style={{
              border: "1px solid var(--border-strong)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <Image
              src="/cookie.jpg"
              width={80}
              height={80}
              alt="Logo"
              className="object-cover"
            />
          </div>

          {/* form content (login or signup) gets full width and stays centered */}
          <div className="w-full">{children}</div>
        </div>

        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      </div>
    </div>
  );
}