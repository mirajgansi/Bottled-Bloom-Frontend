"use client";

import { resetPassword } from "@/lib/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AnimatedTextField from "./AnimatedTextFeild"; // adjust path
import { watch } from "fs/promises";

const resetSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    code: z.string().regex(/^\d{6}$/, "Valid 6-digit code is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

type ResetData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
     watch,
    formState: { errors },
  } = useForm<ResetData>({
    resolver: zodResolver(resetSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      code: "",
      newPassword: "",
      confirm: "",
    },
  });

  useEffect(() => {
    const e = searchParams.get("email") || "";
    const c = searchParams.get("code") || "";
    setValue("email", e);
    setValue("code", c);
  }, [searchParams, setValue]);

  const submit = (values: ResetData) => {
    startTransition(async () => {
      try {
        const res = await resetPassword(values.email.trim(), values.code.trim(), values.newPassword);

        toast.success(res?.message || "Password reset successful");
        router.push("/login");
      } catch (err: any) {
        setError("code", {
          type: "manual",
          message: err?.message || "Reset password failed",
        });

        toast.error(err?.message || "Reset password failed");
      }
    });
  };

  const onInvalid = () => {
    toast.error("Please fix the validation errors");
  };
const emailValue = watch("email");
  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow p-6">
        <h1 className="text-2xl font-semibold">Set new password</h1>

        <form onSubmit={handleSubmit(submit, onInvalid)} className="mt-6 space-y-4">
          {/* Email (hidden or readonly if you want) */}
          <div className="space-y-1">
           <p className="mt-1 text-sm text-gray-600">
            Set new password for{" "}
            <span className="font-semibold text-gray-900">{emailValue || "—"}</span>
          </p>
          </div>

         

          {/* New password */}
          <div className="space-y-1">
            <label className="text-sm font-medium">New password</label>
            <AnimatedTextField
              id="newPassword"
              type="password"
              placeholder="••••••••"
              register={register("newPassword")}
              error={errors.newPassword}
              showToggle
            />
          </div>

          {/* Confirm */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Confirm password</label>
            <AnimatedTextField
              id="confirm"
              type="password"
              placeholder="••••••••"
              register={register("confirm")}
              error={errors.confirm}
              showToggle
            />
          </div>

          <button
            className="w-full rounded-xl bg-[#4CAF50] text-white py-2.5 font-medium disabled:opacity-60"
            type="submit"
          >
          Reset password
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          Want to re-enter code?{" "}
          <a
            className="underline"
            href={`/reset-code-password?email=${encodeURIComponent(searchParams.get("email") || "")}`}
          >
            Back
          </a>
        </div>
      </div>
    </div>
  );
}
