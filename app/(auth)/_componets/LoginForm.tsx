"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";
import { Eye, EyeOff } from "lucide-react";
import { handleLogin, handleVerifyLoginOtp } from "@/lib/actions/auth-actions";
import { toast } from "react-toastify";
import AnimatedTextField from "./AnimatedTextFeild";
import OtpInput from "./OPTIput";

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

  // OTP step state
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [verifying, startVerifying] = useTransition();

 const submit = async (values: LoginData) => {
  startTransition(async () => {
    try {
      const response = await handleLogin(values);

      if (!response || response.success !== true) {
        const rawField = "field" in response ? response.field : undefined;
        const message = response?.message || "Invalid email or password";

        const validFields = ["email", "password"] as const;
        const field = validFields.includes(rawField as any)
          ? (rawField as "email" | "password")
          : undefined;

        if (field) {
          setError(field, { type: "manual", message });
        } else {
          setError("password", { type: "manual", message });
        }
        return;
      }

      if (response.requiresOtp === true) {
        setTempToken(response.tempToken);
        setStep("otp");
        toast.success("Verification code sent to your email");
        return;
      }

      // TS now knows response is the { requiresOtp?: false; data: any } variant
      toast.success("Login successful");
      redirectByRole(response.data?.role);
    } catch (err: any) {
      const msg = err?.message || "Something went wrong";
      setError("root", { type: "manual", message: msg });
      toast.error(msg);
    }
  });
};
  const redirectByRole = (role?: string) => {
    if (role === "admin") router.replace("/admin");
    else if (role === "driver") router.replace("/driver");
    else router.replace("/user/dashboard");
  };

  const onVerifyOtp = () => {
    if (otp.length !== 6 || !tempToken) {
      setOtpError("Enter the 6-digit code");
      return;
    }

    setOtpError(null);

    startVerifying(async () => {
      try {
        const res = await handleVerifyLoginOtp(tempToken, otp);

        if (!res?.success) {
          setOtpError(res?.message || "Invalid or expired code");
          return;
        }

        toast.success("Login successful");
        redirectByRole(res.data?.role);
      } catch (err: any) {
        setOtpError(err?.message || "Verification failed");
      }
    });
  };

  if (step === "otp") {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Enter verification code
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            We sent a 6-digit code to your email. It expires in 10 minutes.
          </p>
        </div>

        <OtpInput value={otp} onChange={setOtp} length={6} />

        {otpError && (
          <p className="text-sm" style={{ color: "#E57373" }}>
            {otpError}
          </p>
        )}

        <button
          type="button"
          onClick={onVerifyOtp}
          disabled={verifying || otp.length !== 6}
          className="h-11 w-full rounded-full font-semibold tracking-wide transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
          style={{
            backgroundColor: "var(--gold-primary)",
            color: "var(--text-on-gold)",
            boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
          }}
        >
          {verifying ? "Verifying..." : "Verify & Log in"}
        </button>

        <button
          type="button"
          onClick={() => {
            setStep("credentials");
            setTempToken(null);
            setOtp("");
            setOtpError(null);
          }}
          className="w-full text-center text-sm underline"
          style={{ color: "var(--text-secondary)" }}
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
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
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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

      <div className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
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