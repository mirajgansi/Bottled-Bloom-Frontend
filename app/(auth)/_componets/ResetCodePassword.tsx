"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import OtpInput from "../_componets/OPTIput";
import { handleVerifyResetCode } from "@/lib/actions/auth-actions";

export default function ResetCodePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const e = searchParams.get("email");
    if (e) setEmail(e);
  }, [searchParams]);

  async function onNext(e: React.FormEvent) {
    e.preventDefault();

    const em = email.trim();
    const cd = code.trim();

    if (!em) return toast.error("Email is required");
    if (!/^\d{6}$/.test(cd)) return toast.error("Code must be 6 digits");

    setPending(true);
    try {
      const res = await handleVerifyResetCode(em, cd);

      if (!res.success) {
        toast.error(res.message || "Invalid reset code");
        return;
      }

      router.push(
        `/reset-password?email=${encodeURIComponent(em)}&code=${encodeURIComponent(cd)}`
      );
    } finally {
      setPending(false);
    }
  }

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
          Verify code
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Enter the 6-digit code sent to{" "}
          <span style={{ color: "var(--gold-primary)" }}>{email}</span>
        </p>

        <form onSubmit={onNext} className="mt-6 space-y-4">
          <div>
            <label
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Reset code
            </label>
            <div className="mt-2 flex justify-center">
              <OtpInput value={code} onChange={setCode} length={6} />
            </div>
            <p
              className="text-xs mt-2 text-center"
              style={{ color: "var(--text-secondary)" }}
            >
              Code expires in 10 minutes.
            </p>
          </div>

          <button
            className="w-full rounded-full py-2.5 font-semibold tracking-wide transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            style={{
              backgroundColor: "var(--gold-primary)",
              color: "var(--text-on-gold)",
              boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
            }}
            type="submit"
            disabled={pending}
          >
            {pending ? "Verifying..." : "Next"}
          </button>
        </form>

        <div className="mt-4 text-sm" style={{ color: "var(--text-secondary)" }}>
          Didn't get a code?{" "}
          <a
            className="underline transition-colors"
            style={{ color: "var(--gold-primary)" }}
            href="/request-reset-password"
          >
            Resend code
          </a>
        </div>
      </div>
    </div>
  );
}