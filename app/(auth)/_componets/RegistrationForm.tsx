"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RegisterData, registerSchema } from "../schema";
import { handleRegister } from "@/lib/actions/auth-actions";
import AnimatedTextField from "./AnimatedTextFeild";
export default function RegisterForm() {
  const router = useRouter();

const {
  register,
  handleSubmit,
  setError,
  formState: { errors, isSubmitting },
} = useForm<RegisterData>({
  resolver: zodResolver(registerSchema),
  mode: "onSubmit",
});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pending, startTransition] = useTransition();

const onSubmit = async (data: RegisterData) => {
  try {
    const result = await handleRegister(data);

    if (!result) {
      setError("root", {
        type: "manual",
        message: "No response from server. Please try again.",
      });
      return;
    }

    if (!result.success) {
      const msg = (result.message || "").toLowerCase();

      if (msg.includes("username")) {
        setError("username", { type: "manual", message: result.message });
        return;
      }

      if (msg.includes("email")) {
        setError("email", { type: "manual", message: result.message });
        return;
      }

      setError("root", { type: "manual", message: result.message || "Registration failed" });
      return;
    }

    router.push("/login");
  } catch (e: any) {
    setError("root", {
      type: "manual",
      message: e?.message || "Something went wrong",
    });
  }
};



  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full name */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="name">
          Full name
        </label>

       
      <AnimatedTextField
        id="username"
        type="text"
        placeholder="Jane Doe"
        register={register("username")}
        error={errors.username}
      />
    {errors.root?.message && (
  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
    {errors.root.message}
  </div>
)}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>

        <AnimatedTextField
          id="email"
          type="email"
          placeholder="you@example.com"
          register={register("email")}
          error={errors.email}
        />
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>

        <div className="relative">
         <AnimatedTextField
  id="password"
  type="password"
  placeholder="••••••"
  register={register("password")}
  error={errors.password}
  showToggle // 👈 enable eye
/>
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide Password" : "Show Password"}
          >
          </button>
        </div>
      </div>

      {/* Confirm Password */}
     <div className="space-y-1">
  <label className="text-sm font-medium" htmlFor="confirmPassword">
    Confirm password
  </label>

  <AnimatedTextField
    id="confirmPassword"
    type="password"
    placeholder="••••••"
    register={register("confirmPassword")}
    error={errors.confirmPassword}
    showToggle   
  />
</div>


      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-10 w-full rounded-md bg-[#4CAF50] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting || pending ? "Creating..." : "Create account"}
      </button>

      <div className="mt-1 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold hover:underline">
          Log in
        </Link>
      </div>
    </form>
  );
}
