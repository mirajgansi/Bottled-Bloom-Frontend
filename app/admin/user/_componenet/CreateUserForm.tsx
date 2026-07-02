"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { handleCreateUser } from "@/lib/actions/admin/user-action";
import { UserData, UserSchema } from "../schema";
import { Camera, User, X } from "lucide-react";
import { FormSelect } from "@/app/_componets/dropdown";

export default function CreateUserForm() {
const [pending, startTransition] = useTransition();

const {
  register,
  handleSubmit,
  control,
  reset,
  formState: { errors, isSubmitting },
} = useForm<UserData>({
  resolver: zodResolver(UserSchema),
  mode: "onSubmit",
});

const [error, setError] = useState<string | null>(null);
const [previewImage, setPreviewImage] = useState<string | null>(null);
const fileInputRef = useRef<HTMLInputElement>(null);

const handleImageChange = (
  file: File | undefined,
  onChange: (file: File | undefined) => void
) => {
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
  } else {
    setPreviewImage(null);
  }
  onChange(file);
};

const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
  setPreviewImage(null);
  onChange?.(undefined);
  if (fileInputRef.current) fileInputRef.current.value = "";
};

const onSubmit = async (data: UserData) => {
  setError(null);

  startTransition(async () => {
    try {
      const formData = new FormData();

      formData.append("email", data.email);
      formData.append("username", data.username);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      formData.append("role", data.role);

      formData.append("phoneNumber", data.phoneNumber ?? "");
      formData.append("location", data.location ?? "");
      formData.append("DOB", data.DOB ?? "");
      formData.append("gender", data.gender ?? "");

      if (data.image) formData.append("image", data.image);

      const response = await handleCreateUser(formData);

      if (!response.success) throw new Error(response.message || "Create profile failed");

      reset();
      handleDismissImage();
      toast.success("Profile Created successfully");
    } catch (err: any) {
      toast.error(err.message || "Create profile failed");
      setError(err.message || "Create profile failed");
    }
  });
};

const disabled = isSubmitting || pending;

return (
<div className="min-h-screen w-full ">

      <form id="create-user-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="relative mx-auto w-full max-w-7xl">
                
      <div className="rounded-xl border bg-white p-10 shadow-md">
            <h2 className="mb-5 text-sm font-semibold text-gray-900">
              Personal information
            </h2>

            {/* Image input row */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Profile Image</label>

              <Controller
                name="image"
                control={control}
                render={({ field: { onChange } }) => (
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="relative h-28 w-28">
                  <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100 shadow">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400 text-4xl">
                        <User/>
                      </div>
                    )}
                  </div>

                  {previewImage && (
                    <button
                      type="button"
                      onClick={() => handleDismissImage(onChange)}
                      className="absolute -top-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
                      title="Remove image"
                    >
                      <X size={20} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-white shadow-md hover:bg-slate-800"
                    title="Change photo"
                  >
                    <Camera size={20} />
                  </button>
                </div>

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                      className="hidden"
                    />
                  </div>
                )}
              />


                {errors.image && (
                  <p className="text-xs text-red-600">{errors.image.message}</p>
                )}
              </div>

              <div />
            </div>

            {/* Form grid like screenshot */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Email */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600" htmlFor="email">
                  EMAIL
                </label>
                <input
                  id="email"
                  type="email"
className="h-14 w-full rounded-lg border border-gray-300 px-4 text-base focus:border-gray-500"
                  {...register("email")}
                  placeholder="you@example.com"
                />
                {errors.email?.message && (
                  <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600" htmlFor="username">
                  USERNAME
                </label>
                <input
                  id="username"
                  type="text"
className="h-14 w-full rounded-lg border border-gray-300 px-4 text-base focus:border-gray-500"
                  {...register("username")}
                  placeholder="Jane Doe"
                />
                {errors.username?.message && (
                  <p className="text-xs text-red-600">{errors.username.message}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600" htmlFor="location">
                  LOCATION
                </label>
                <input
                  id="location"
                  type="text"
className="h-14 w-full rounded-lg border border-gray-300 px-4 text-base focus:border-gray-500"
                  {...register("location")}
                  placeholder="eg: Dillibazar, Kathmandu"
                />
                {errors.location?.message && (
                  <p className="text-xs text-red-600">{errors.location.message}</p>
                )}
              </div>

              {/* DOB */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600" htmlFor="DOB">
                  DATE OF BIRTH
                </label>
                <input
                  id="DOB"
                  type="date"
className="h-14 w-full rounded-lg border border-gray-300 px-4 text-base focus:border-gray-500"
                  {...register("DOB")}
                />
                {errors.DOB?.message && (
                  <p className="text-xs text-red-600">{errors.DOB.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600" htmlFor="phoneNumber">
                  PHONE NUMBER
                </label>
                <input
                  id="phoneNumber"
                  type="text"
className="h-14 w-full rounded-lg border border-gray-300 px-4 text-base focus:border-gray-500"
                  {...register("phoneNumber")}
                  placeholder="98XXXXXXX"
                />
                {errors.phoneNumber?.message && (
                  <p className="text-xs text-red-600">{errors.phoneNumber.message}</p>
                )}
              </div>

              {/* Gender */}
            <FormSelect
              control={control}
              name="gender"
              label="Gender"
              placeholder="Select gender"
              options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
              ]}
              className="h-20 rounded-lg border-gray-300 text-base"
              error={errors.gender?.message as string | undefined}
              />
            </div>

            {/* Organization role section like screenshot */}
            <div className="mt-8">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Organization role</h3>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {[
                  {
                    value: "user",
                    title: "Standard",
                    desc: "Can edit their profile and basic settings.",
                  },
                  {
                    value: "admin",
                    title: "Admin",
                    desc: "Unlimited access to administration features.",
                  },
                  {
                    value: "driver",
                    title: "Driver",
                    desc: "Access to delivery and driver tools.",
                  },
                ].map((role) => (
                  <label
                    key={role.value}
                    className="group flex cursor-pointer gap-3 rounded-lg border border-gray-200 p-4 hover:border-gray-300"
                  >
                    <input
                      type="radio"
                      value={role.value}
                      {...register("role")}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{role.title}</div>
                      <div className="text-xs text-gray-600">{role.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              {errors.role?.message && (
                <p className="mt-2 text-xs text-red-600">{errors.role.message}</p>
              )}
            </div>

            {/* Passwords */}
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600" htmlFor="password">
                  CREATE PASSWORD
                </label>
                <input
                  id="password"
                  type="password"
className="h-14 w-full rounded-lg border border-gray-300 px-4 text-base focus:border-gray-500"
                  {...register("password")}
                  placeholder="••••••"
                />
                {errors.password?.message && (
                  <p className="text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  className="text-[11px] font-semibold text-gray-600"
                  htmlFor="confirmPassword"
                >
                  CONFIRM PASSWORD
                </label>
                <input
                  id="confirmPassword"
                  type="password"
className="h-14 w-full rounded-lg border border-gray-300 px-4 text-base focus:border-gray-500"
                  {...register("confirmPassword")}
                  placeholder="••••••"
                />
                {errors.confirmPassword?.message && (
                  <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Bottom actions (optional) */}
            <div className="mt-8 flex items-center justify-end gap-3">
              {/* <Link
                href="/admin/users"
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Link> */}
              <button
                type="submit"
                disabled={disabled}
                className="rounded-md bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {disabled ? "Creating..." : "Create User"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
);
}
