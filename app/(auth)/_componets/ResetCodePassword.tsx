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

  const res = await handleVerifyResetCode(em, cd);

  if (!res.success) {
    return toast.error(res.message || "Invalid reset code");
  }

  router.push(
    `/reset-password?email=${encodeURIComponent(em)}&code=${encodeURIComponent(cd)}`
  );
}

  return (
    <div className=" flex justify-center ">
      <div className="w-full max-w-md rounded-2xl bg-white shadow p-6">
        <h1 className="text-2xl font-semibold">Verify code</h1>
        <p className="text-sm text-gray-600 mt-1">
          Enter the 6-digit code email            {email}
        
        </p>
        <form onSubmit={onNext} className="mt-6 space-y-4">
        
          <div>
            <label className="text-sm font-medium">Reset code</label>
            <div className="mt-2 flex justify-center">
              <OtpInput value={code} onChange={setCode} length={6} />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Code expires in 10 minutes.
            </p>
          </div>

          <button
            className="w-full rounded-xl bg-[#4CAF50] text-white py-2.5 font-medium"
            type="submit"
          >
            Next
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          Didn’t get a code?{" "}
          <a className="underline" href="/request-reset-password">
            Resend code
          </a>
        </div>
      </div>
    </div>
  );
}
