"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { z } from "zod";
import { handleDeleteMe, handleUpdateProfile } from "@/lib/actions/auth-actions";
import { Camera, Pencil, User, X } from "lucide-react";
import DeleteAccountModal from "@/app/_componets/DeleteAccountModal";
import { useAuth } from "@/context/AuthContext";
import { FormSelect } from "@/app/_componets/dropdown";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const updateUserSchema = z.object({
  email: z.string().email("Email is invalid"),
  username: z.string().min(3, { message: "Minimum 3 characters" }),
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "Max file size is 5MB",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, .png and .webp formats are supported",
    }),
  phoneNumber: z.string().max(10, "Max 10 digits").optional(),
  location: z.string().optional(),
  DOB: z.string().optional(),
  gender: z.string().optional(),
});
const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];
export type UpdateUserData = z.infer<typeof updateUserSchema>;

export default function UpdateUserForm({ user }: { user: any }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: user?.email || "",
      username: user?.username || "",
      phoneNumber: user?.phoneNumber || "",
      location: user?.location || "",
      DOB: user?.DOB || "",
      gender: user?.gender || "",
    },
    mode: "onSubmit",
  });

  const [editing, setEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // When user changes (or on first mount), sync form
    reset({
      email: user?.email || "",
      username: user?.username || "",
      phoneNumber: user?.phoneNumber || "",
      location: user?.location || "",
      DOB: user?.DOB || "",
      gender: user?.gender || "",
    });
  }, [user, reset]);

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

  const clearImage = (onChange?: (file: File | undefined) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: UpdateUserData) => {
    try {
      const formData = new FormData();

      // required
      formData.append("email", data.email);
      formData.append("username", data.username);

      // optional (only append if not empty)
      if (data.phoneNumber?.trim()) formData.append("phoneNumber", data.phoneNumber.trim());
      if (data.location?.trim()) formData.append("location", data.location.trim());
      if (data.DOB) formData.append("DOB", data.DOB);
      if (data.gender?.trim()) formData.append("gender", data.gender.trim());

      if (data.image) formData.append("image", data.image);

      const response = await handleUpdateProfile(formData);

      if (!response?.success) {
        toast.error(response?.message || "Update profile failed");
        return;
      }

      toast.success("Profile updated successfully");
      setEditing(false);
      clearImage();

      reset(
        {
          email: data.email,
          username: data.username,
          phoneNumber: data.phoneNumber || "",
          location: data.location || "",
          DOB: data.DOB || "",
          gender: data.gender || "",
        },
        { keepDirty: false }
      );
    } catch (err: any) {
      toast.error(err?.message || "Profile update failed");
    }
  };

  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { logout, loading } = useAuth();

  const onDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Please enter your password");
      return;
    }

    setDeleting(true);

    const res = await handleDeleteMe(deletePassword);
    if (!res.success) {
      setDeleting(false);
      toast.error(res.message);
      return;
    }

    await logout();

    setDeleting(false);
    toast.success("Account deleted");

    window.location.href = "/login";
  };

  const inputBase =
    "h-11 w-full rounded-xl px-4 text-sm outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const inputStyle = {
    backgroundColor: "var(--bg-elevated)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-strong)",
  };
  const onInputFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderColor = "var(--gold-bright)");
  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderColor = "var(--border-strong)");

  return (
    <div className="min-h-screen px-4 py-10" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="mx-auto w-full max-w-4xl">
        <div
          className="rounded-3xl p-6 md:p-8"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-deep)",
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                className="text-xl md:text-2xl font-semibold"
                style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
              >
                Personal Information
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                Update your personal details and contact information.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="h-11 rounded-full px-4 text-sm font-semibold flex items-center gap-2 transition-colors"
                style={{
                  border: "2px solid var(--gold-primary)",
                  color: "var(--gold-primary)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(201, 161, 93, 0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <Pencil size={16} />
                Edit Information
              </button>
            </div>
          </div>

          {/* Body */}
          <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="mt-8">
            {/* Avatar + Upload (optional) */}
            <div className="flex items-center gap-5 mb-8">
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
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={previewImage}
                              alt="Profile preview"
                              className="h-full w-full object-cover"
                            />
                          ) : user?.image ? (
                            <Image
                              src={process.env.NEXT_PUBLIC_API_BASE_URL + user.image}
                              alt="Profile"
                              width={112}
                              height={112}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div
                              className="h-full w-full flex items-center justify-center"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              <User size={40} />
                            </div>
                          )}
                        </div>

                        {previewImage && (
                          <button
                            type="button"
                            onClick={() => clearImage(onChange)}
                            className="absolute -top-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-colors"
                            style={{ backgroundColor: "#D14343", color: "#fff" }}
                            title="Remove uploaded image"
                          >
                            <X size={18} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-transform hover:scale-105"
                          style={{ backgroundColor: "var(--gold-primary)", color: "var(--text-on-gold)" }}
                          title="Change photo"
                        >
                          <Camera size={18} />
                        </button>
                      </div>

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

            {/* Grid like screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  Username
                </label>
                <input
                  {...register("username")}
                  disabled={!editing}
                  className={inputBase}
                  style={inputStyle}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                  placeholder="Username"
                />
                {errors.username?.message && (
                  <p className="text-xs" style={{ color: "#E57373" }}>
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  Gender
                </label>

                <FormSelect<UpdateUserData>
                  control={control}
                  name="gender"
                  placeholder="Select gender"
                  options={genderOptions}
                  disabled={!editing}
                  error={errors.gender?.message}
                  className={inputBase + " h-11 rounded-xl"}
                />
              </div>

              {/* Location */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  Shipping Address
                </label>
                <input
                  {...register("location")}
                  disabled={!editing}
                  className={inputBase}
                  style={inputStyle}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                  placeholder="Enter your address"
                />
                {errors.location?.message && (
                  <p className="text-xs" style={{ color: "#E57373" }}>
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  Email Address
                </label>
                <input
                  {...register("email")}
                  disabled={!editing}
                  className={inputBase}
                  style={inputStyle}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                  placeholder="you@example.com"
                />
                {errors.email?.message && (
                  <p className="text-xs" style={{ color: "#E57373" }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  Phone Number
                </label>
                <input
                  {...register("phoneNumber")}
                  disabled={!editing}
                  className={inputBase}
                  style={inputStyle}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                  placeholder="(xxx) xxx-xxxx"
                />
                {errors.phoneNumber?.message && (
                  <p className="text-xs" style={{ color: "#E57373" }}>
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* DOB */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  {...register("DOB")}
                  disabled={!editing}
                  className={inputBase}
                  style={inputStyle}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                />
                {errors.DOB?.message && (
                  <p className="text-xs" style={{ color: "#E57373" }}>
                    {errors.DOB.message}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom row */}
            <div className="mt-8 flex items-center justify-end gap-3">
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setPreviewImage(null);
                    reset(undefined, { keepDirty: false });
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="h-11 rounded-full px-5 text-sm font-semibold transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="rounded-full px-6 py-2 text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: "#D14343" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#B93838")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#D14343")}
              >
                Delete Account
              </button>
              <DeleteAccountModal
                open={deleteOpen}
                password={deletePassword}
                setPassword={setDeletePassword}
                deleting={deleting}
                onClose={() => {
                  setDeleteOpen(false);
                  setDeletePassword("");
                }}
                onConfirm={onDeleteAccount}
              />

              <button
                type="submit"
                disabled={!editing || isSubmitting || (!isDirty && !previewImage)}
                className="h-11 rounded-full px-6 text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  backgroundColor: "var(--gold-primary)",
                  color: "var(--text-on-gold)",
                  boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
                }}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}