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
    "h-11 w-full rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 px-4 text-sm outline-none focus:border-black/30 dark:focus:border-white/30 disabled:opacity-70 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-3xl bg-white shadow-sm border border-black/5 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-black">
                Personal Information
              </h2>
              <p className="text-sm text-black/50 mt-1">
                Update your personal details and contact information.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="h-11 rounded-full border-2 border-[#35C759] px-4 text-sm font-semibold text-[#35C759] hover:bg-[#35C759]/10 flex items-center gap-2"
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
                            <div className="h-full w-full flex items-center justify-center text-black/40">
                                <User size={40} />
                            </div>
                            )}
                        </div>

                        {previewImage && (
                            <button
                            type="button"
                            onClick={() => clearImage(onChange)}
                            className="absolute -top-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
                            title="Remove uploaded image"
                            >
                            <X size={18} />
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white shadow-md hover:opacity-90"
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
                  <p className="text-xs text-red-600">{errors.image.message}</p>
                )}
              </div>

              <div />
            </div>

            {/* Grid like screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Username -> Like "First Name" */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-black/80">
                  Username
                </label>
                <input
                  {...register("username")}
                  disabled={!editing}
                  className={inputBase}
                  placeholder="Username"
                />
                {errors.username?.message && (
                  <p className="text-xs text-red-600">{errors.username.message}</p>
                )}
              </div>

              {/* Gender -> Like "Last Name" */}
             <div className="space-y-2">
            <label className="text-sm font-medium text-black/80">Gender</label>

            <FormSelect<UpdateUserData>
              control={control}
              name="gender"
              placeholder="Select gender"
              options={genderOptions}
              disabled={!editing}
              error={errors.gender?.message}
              className={inputBase + " h-11 rounded-xl"} // match your input style
            />
          </div>

              {/* Location -> Like "Shipping Address" (full width) */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-black/80">
                  Shipping Address
                </label>
                <input
                  {...register("location")}
                  disabled={!editing}
                  className={inputBase}
                  placeholder="Enter your address"
                />
                {errors.location?.message && (
                  <p className="text-xs text-red-600">{errors.location.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-black/80">
                  Email Address
                </label>
                <input
                  {...register("email")}
                  disabled={!editing}
                  className={inputBase}
                  placeholder="you@example.com"
                />
                {errors.email?.message && (
                  <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-black/80">
                  Phone Number
                </label>
                <input
                  {...register("phoneNumber")}
                  disabled={!editing}
                  className={inputBase}
                  placeholder="(xxx) xxx-xxxx"
                />
                {errors.phoneNumber?.message && (
                  <p className="text-xs text-red-600">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* DOB */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-black/80">
                  Date of Birth
                </label>
                <input
                  type="date"
                  {...register("DOB")}
                  disabled={!editing}
                  className={inputBase}
                />
                {errors.DOB?.message && (
                  <p className="text-xs text-red-600">{errors.DOB.message}</p>
                )}
              </div>
            </div>

            {/* Bottom row like screenshot (optional) */}
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
                  className="h-11 rounded-full px-5 text-sm font-semibold text-black/70 hover:bg-black/5"
                >
                  Cancel
                </button>
              )}
  <button
    type="button"
    onClick={() => setDeleteOpen(true)}
    className="rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700"
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
                className="h-11 rounded-full bg-[#35C759] px-6 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
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
