"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordReset } from "@/lib/api/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const RequestPasswordResetSchema = z.object({
  email: z.string().email("Invalid email"),
});

export type RequestPasswordResetDTO = z.infer<typeof RequestPasswordResetSchema>;

export default function RequestResetPassword() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestPasswordResetDTO>({
    resolver: zodResolver(RequestPasswordResetSchema),
  });

  const onSubmit = async (data: RequestPasswordResetDTO) => {
    try {
      const response = await requestPasswordReset(data.email);

      if (response.success) {
        toast.success("Password reset code sent to your email.");
        router.push(`/reset-code-password?email=${encodeURIComponent(data.email)}`);
      } else {
        toast.error(response.message || "Failed to request password reset.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to request password reset.");
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center px-4"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-deep)",
        }}
      >
        <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
        >
          Request password reset
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Enter your email to receive a 6-digit reset code.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label
              className="text-sm font-medium"
              htmlFor="email"
              style={{ color: "var(--text-primary)" }}
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className="mt-1 w-full rounded-xl px-3 py-2 outline-none transition-colors"
              style={{
                backgroundColor: "var(--bg-elevated)",
                color: "var(--text-primary)",
                border: `1px solid ${errors.email ? "#D14343" : "var(--border-strong)"}`,
              }}
              placeholder="you@example.com"
              autoComplete="email"
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-bright)")}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = errors.email
                  ? "#D14343"
                  : "var(--border-strong)")
              }
            />
            {errors.email && (
              <p className="text-sm mt-1" style={{ color: "#E57373" }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full py-2.5 font-semibold tracking-wide transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            style={{
              backgroundColor: "var(--gold-primary)",
              color: "var(--text-on-gold)",
              boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
            }}
          >
            {isSubmitting ? "Sending..." : "Send reset code"}
          </button>
        </form>

        <div
          className="mt-4 flex items-center justify-between text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          <Link
            className="underline transition-colors"
            style={{ color: "var(--gold-primary)" }}
            href="/login"
          >
            Back to login
          </Link>

          <Link
            className="underline transition-colors"
            style={{ color: "var(--gold-primary)" }}
            href="/reset-code-password"
          >
            I already have a code
          </Link>
        </div>
      </div>
    </div>
  );
}