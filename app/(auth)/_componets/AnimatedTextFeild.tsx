"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

type Props = {
  id: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  inputClassName?: string;
  showToggle?: boolean;
};

export default function AnimatedTextField({
  id,
  type = "text",
  placeholder,
  register,
  error,
  inputClassName = "",
  showToggle = false,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const controls = useAnimation();

  const isPassword = type === "password";
  const finalType =
    showToggle && isPassword ? (showPassword ? "text" : "password") : type;

  useEffect(() => {
    if (!error?.message) return;

    // ✅ reset first so animation always replays
    controls.set({ x: 0, y: 0, rotate: 0 });

    controls.start({
      x: [0, -18, 18, -16, 16, -14, 14, -10, 10, -6, 6, 0],
      y: [0, 2, -2, 2, -2, 1, -1, 1, -1, 0],
      rotate: [0, -2, 2, -2, 2, -1, 1, 0],
      transition: { duration: 0.55, ease: "easeInOut" },
    });
  }, [error?.message, controls]);

  return (
    <div className="w-full">
      <div className="relative w-full">
        <motion.input
          id={id}
          type={finalType}
          placeholder={placeholder}
          {...register}
          animate={controls}
          className={[
            "h-10 w-full rounded-md border px-3 text-sm outline-none transition",
            showToggle ? "pr-10" : "",
            error
              ? "border-red-500 bg-red-50"
              : "border-black/10 focus:border-black/40",
            inputClassName,
          ].join(" ")}
        />

        {showToggle && isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error?.message && (
        <p className="mt-1 text-xs text-red-600">{error.message}</p>
      )}
    </div>
  );
}
