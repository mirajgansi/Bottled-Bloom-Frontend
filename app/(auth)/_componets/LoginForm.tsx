"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";
import { Eye, EyeOff } from "lucide-react";
import { handleLogin } from "@/lib/actions/auth-actions";
import { toast } from "react-toastify";
import AnimatedTextField from "./AnimatedTextFeild";

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (values: LoginData) => {
    startTransition(async () => {
      try {
        const response = await handleLogin(values);

        if (!response || response.success !== true) {
          const field = response?.field as keyof LoginData | undefined;
          const message = response?.message || "Invalid email or password";

          if (field) {
            setError(field, { type: "manual", message });
          } else {
            const msg = message.toLowerCase();
            if (msg.includes("email")) {
              setError("email", { type: "manual", message });
            } else if (msg.includes("password")) {
              setError("password", { type: "manual", message });
            } else {
              setError("password", { type: "manual", message });
            }
          }

          return;
        }

        toast.success("Login successful");

        if (response.data?.role === "admin") router.replace("/admin");
        else if (response.data?.role === "user") router.replace("/user/dashboard");
        else if (response.data?.role === "driver") router.replace("/driver");
      } catch (err: any) {
        const msg = err?.message || "Something went wrong";
        setError("root", { type: "manual", message: msg });
        toast.error(msg);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {/* Email */}
      <div className="space-y-1">
        <label
          className="text-sm font-medium"
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

      <div className="space-y-1">
        <label
          className="text-sm font-medium"
          htmlFor="password"
          style={{ color: "var(--text-primary)" }}
        >
          Password
        </label>

        <div className="relative">
          <AnimatedTextField
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••"
            register={register("password")}
            error={errors.password}
            showToggle
          />

          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute inset-y-0 right-3 flex items-center transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
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
        {isSubmitting || pending ? "Logging in..." : "Log in"}
      </button>

      <div className="text-right text-sm">
        <Link
          href="/request-reset-password"
          className="font-medium hover:underline transition-colors"
          style={{ color: "var(--gold-primary)" }}
        >
          Forgot password?
        </Link>
      </div>

      <div
        className="text-center text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold hover:underline transition-colors"
          style={{ color: "var(--gold-primary)" }}
        >
          Sign up
        </Link>
      </div>
    </form>
  );
}