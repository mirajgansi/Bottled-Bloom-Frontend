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
    <div className="flex  justify-center  px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow p-6">
        <h1 className="text-2xl font-semibold">Request password reset</h1>
        <p className="text-sm text-gray-600 mt-1">
          Enter your email to receive a 6-digit reset code.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="email">
              Email address
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#4CAF50] text-white py-2.5 font-medium disabled:opacity-60"
          >
         Send reset code
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <Link className="underline" href="/login">
            Back to login
          </Link>

          <Link className="underline" href="/reset-code-password">
            I already have a code
          </Link>
        </div>
      </div>
    </div>
  );
}
