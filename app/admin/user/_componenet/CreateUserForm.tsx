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

  const inputClass =
    "h-14 w-full rounded-lg px-4 text-base outline-none transition-colors";
  const inputStyle = {
    backgroundColor: "var(--bg-elevated)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-strong)",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderColor = "var(--gold-bright)");
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderColor = "var(--border-strong)");

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "var(--bg-primary)" }}>
      <form id="create-user-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative mx-auto w-full max-w-7xl p-4 sm:p-6">
          <div
            className="rounded-xl p-10"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-deep)",
            }}
          >
            <h2
              className="mb-5 text-sm font-semibold"
              style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
            >
              Personal information
            </h2>

            {/* Image input row */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  Profile Image
                </label>

                <Controller
                  name="image"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <div className="flex items-center gap-6">
                      {/* Avatar */}
                      <div className="relative h-28 w-28">
                        <div
                          className="h-28 w-28 overflow-hidden rounded-full"
                          style={{
                            border: "2px solid var(--border-strong)",
                            backgroundColor: "var(--bg-elevated)",
                          }}
                        >
                          {previewImage ? (
                            <img
                              src={previewImage}
                              alt="Profile preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div
                              className="flex h-full w-full items-center justify-center text-4xl"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              <User />
                            </div>
                          )}
                        </div>

                        {previewImage && (
                          <button
                            type="button"
                            onClick={() => handleDismissImage(onChange)}
                            className="absolute -top-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-colors"
                            style={{ backgroundColor: "#D14343", color: "#fff" }}
                            title="Remove image"
                          >
                            <X size={20} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-transform hover:scale-105"
                          style={{ backgroundColor: "var(--gold-primary)", color: "var(--text-on-gold)" }}
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
                  <p className="text-xs" style={{ color: "#E57373" }}>
                    {errors.image.message}
                  </p>
                )}
              </div>

              <div />
            </div>

            {/* Form grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Email */}
              <div className="space-y-1">
                <label
                  className="text-[11px] font-semibold tracking-wide"
                  htmlFor="email"
                  style={{ color: "var(--text-secondary)" }}
                >
                  EMAIL
                </label>
                <input
                  id="email"
                  type="email"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={onFocus}
                
                  {...register("email")}
                  placeholder="you@example.com"
                />
                {errors.email?.message && (
                  <p className="text-xs" style={{ color: "#E57373" }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-1">
                <label
                  className="text-[11px] font-semibold tracking-wide"
                  htmlFor="username"
                  style={{ color: "var(--text-secondary)" }}
                >
                  USERNAME
                </label>
                <input
                  id="username"
                  type="text"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={onFocus}
                  
                  {...register("username")}
                  placeholder="Jane Doe"
                />
                {errors.username?.message && (
                  <p className="text-xs" style={{ color: "#E57373" }}>
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label
                  className="text-[11px] font-semibold tracking-wide"
                  htmlFor="location"
                  style={{ color: "var(--text-secondary)" }}
                >
                  LOCATION
                </label>
                <input
                  id="location"
                  type="text"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={onFocus}
              
                  {...register("location")}
                  placeholder="eg: Dillibazar, Kathmandu"
                />
                {errors.location?.message && (
                  <p className="text-xs" style={{ color: "#E57373" }}>
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* DOB */}
              <div className="space-y-1">
                <label
                  className="text-[11px] font-semibold tracking-wide"
                  htmlFor="DOB"
                  style={{ color: "var(--text-secondary)" }}
                >
                  DATE OF BIRTH
                </label>
                <input
                  id="DOB"
                  type="date"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={onFocus}
         
                  {...register("DOB")}
                />
                {errors.DOB?.message && (
                  <p className="text-xs" style={{ color: "#E57373" }}>
                    {errors.DOB.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label
                  className="text-[11px] font-semibold tracking-wide"
                  htmlFor="phoneNumber"
                  style={{ color: "var(--text-secondary)" }}
                >
                  PHONE NUMBER
                </label>
                <input
                  id="phoneNumber"
                  type="text"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={onFocus}

                  {...register("phoneNumber")}
                  placeholder="98XXXXXXX"
                />
                {errors.phoneNumber?.message && (
                  <p className="text-xs" style={{ color: "#E57373" }}>
                    {errors.phoneNumber.message}
                  </p>
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
                className="h-20 rounded-lg text-base"
                error={errors.gender?.message as string | undefined}
              />
            </div>

            {/* Organization role section */}
            <div className="mt-8">
              <h3
                className="mb-3 text-sm font-semibold"
                style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
              >
                Organization role
              </h3>

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
                    className="group flex cursor-pointer gap-3 rounded-lg p-4 transition-colors"
                    style={{ border: "1px solid var(--border-subtle)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold-primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
                  >
                    <input
                      type="radio"
                      value={role.value}
                      {...register("role")}
                      className="mt-1 accent-[#C9A15D]"
                    />
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {role.title}
                      </div>
                      <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        {role.desc}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {errors.role?.message && (
                <p className="mt-2 text-xs" style={{ color: "#E57373" }}>
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Passwords */}
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label
                  className="text-[11px] font-semibold tracking-wide"
                  htmlFor="password"
                  style={{ color: "var(--text-secondary)" }}
                >
                  CREATE PASSWORD
                </label>
                <input
                  id="password"
                  type="password"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={onFocus}
                  {...register("password")}
                  placeholder="••••••"
                />
                {errors.password?.message && (
                  <p className="text-xs" style={{ color: "#E57373" }}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  className="text-[11px] font-semibold tracking-wide"
                  htmlFor="confirmPassword"
                  style={{ color: "var(--text-secondary)" }}
                >
                  CONFIRM PASSWORD
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={onFocus}
                
                  {...register("confirmPassword")}
                  placeholder="••••••"
                />
                {errors.confirmPassword?.message && (
                  <p className="text-xs" style={{ color: "#E57373" }}>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom actions */}
            <div className="mt-8 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={disabled}
                className="rounded-md px-4 py-2 text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
                style={{
                  backgroundColor: "var(--gold-primary)",
                  color: "var(--text-on-gold)",
                  boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
                }}
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