"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
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
      // Rate limiting (Fix 4) — status 429, don't attribute to a specific field
      if ("status" in result && result.status === 429) {
        setError("root", {
          type: "manual",
          message: "Too many attempts. Please wait a few minutes and try again.",
        });
        return;
      }

      // Field-specific conflict (email/username already in use) — driven by
      // the backend's `field` key, not by guessing from message text
      if (result.field === "username" || result.field === "email") {
        setError(result.field, { type: "manual", message: result.message });
        return;
      }

      // Fallback: validation errors or anything else the backend didn't tag
      setError("root", {
        type: "manual",
        message: result.message || "Registration failed",
      });
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
        <label
          className="text-sm font-medium"
          htmlFor="username"
          style={{ color: "var(--text-primary)" }}
        >
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
          <div
            className="rounded-md px-3 py-2 text-sm"
            style={{
              border: "1px solid rgba(225, 83, 83, 0.4)",
              backgroundColor: "rgba(225, 83, 83, 0.08)",
              color: "#E57373",
            }}
          >
            {errors.root.message}
          </div>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label
          className="text-sm font-medium"
          htmlFor="email"
          style={{ color: "var(--text-primary)" }}
        >
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
        <label
          className="text-sm font-medium"
          htmlFor="password"
          style={{ color: "var(--text-primary)" }}
        >
          Password
        </label>

        <AnimatedTextField
          id="password"
          type="password"
          placeholder="••••••"
          register={register("password")}
          error={errors.password}
          showToggle
        />
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <label
          className="text-sm font-medium"
          htmlFor="confirmPassword"
          style={{ color: "var(--text-primary)" }}
        >
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
        className="h-11 w-full rounded-full font-semibold tracking-wide transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
        style={{
          backgroundColor: "var(--gold-primary)",
          color: "var(--text-on-gold)",
          boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
        }}
      >
        {isSubmitting || pending ? "Creating..." : "Create account"}
      </button>

      <div
        className="mt-1 text-center text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold hover:underline transition-colors"
          style={{ color: "var(--gold-primary)" }}
        >
          Log in
        </Link>
      </div>
    </form>
  );
}