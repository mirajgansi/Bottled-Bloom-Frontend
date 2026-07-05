"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Camera } from "lucide-react";
import Image from "next/image";
import { ProductEditSchema, type ProductEditData } from "@/app/admin/products/schema";
import { handleUpdateProduct } from "@/lib/actions/product-action";
import { CategoryModal } from "../../_components/category_modal";

const CONCENTRATION_OPTIONS = [
  { value: "parfum", label: "Parfum" },
  { value: "eau-de-parfum", label: "Eau de Parfum" },
  { value: "eau-de-toilette", label: "Eau de Toilette" },
  { value: "eau-de-cologne", label: "Eau de Cologne" },
  { value: "attar", label: "Attar" },
];

const GENDER_OPTIONS = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "unisex", label: "Unisex" },
];

function toNotesArray(text: string): string[] {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function notesToText(notes?: string[]) {
  return (notes ?? []).join(", ");
}

const inputClass = "h-11 w-full rounded-xl px-3 text-sm outline-none transition-colors";
const inputStyle = {
  backgroundColor: "var(--bg-elevated)",
  color: "var(--text-primary)",
  border: "1px solid var(--border-strong)",
};
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = "var(--gold-bright)");
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = "var(--border-strong)");

export default function EditProductForm({ product }: { product?: any }) {
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!product) return null;

  const [existingImages, setExistingImages] = useState<string[]>(
    Array.isArray(product?.images)
      ? product.images
      : product?.image
        ? [product.image]
        : [],
  );

  const [topNotes, setTopNotes] = useState(notesToText(product?.fragranceNotes?.top));
  const [heartNotes, setHeartNotes] = useState(notesToText(product?.fragranceNotes?.heart));
  const [baseNotes, setBaseNotes] = useState(notesToText(product?.fragranceNotes?.base));

  function buildImageUrl(img?: string) {
    if (!img) return "/cookie.jpg";
    if (img.startsWith("http")) return img;
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    return `${base}${img.startsWith("/") ? "" : "/"}${img}`;
  }

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductEditData>({
    resolver: zodResolver(ProductEditSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      inStock: product?.inStock ?? 0,
      category: product?.category ?? "",
      brand: product?.brand ?? "",
      concentration: product?.concentration ?? "",
      gender: product?.gender ?? "",
      volumeMl: product?.volumeMl ?? undefined,
      image: [],
    },
  });

  // when product changes (route loads), sync the form
  useEffect(() => {
    if (!product) return;

    reset({
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      inStock: product?.inStock ?? 0,
      category: product?.category ?? "",
      brand: product?.brand ?? "",
      concentration: product?.concentration ?? "",
      gender: product?.gender ?? "",
      volumeMl: product?.volumeMl ?? undefined,
      image: [],
    });

    setTopNotes(notesToText(product?.fragranceNotes?.top));
    setHeartNotes(notesToText(product?.fragranceNotes?.heart));
    setBaseNotes(notesToText(product?.fragranceNotes?.base));

    // also sync images if product changes
    setExistingImages(
      Array.isArray(product?.images)
        ? product.images
        : product?.image
          ? [product.image]
          : [],
    );
  }, [product, reset]);

  const selectedCategory = watch("category");
  const [categoryOpen, setCategoryOpen] = useState(false);

  const handleImagesChange = (
    files: File[],
    onChange: (v: File[]) => void,
    current: File[] = [],
  ) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;
    const maxCount = 5;

    const valid = files.filter((f) => allowed.includes(f.type) && f.size <= maxSize);
    if (valid.length !== files.length) toast.error("Only JPG/PNG/WEBP under 5MB");

    const merged = [...current, ...valid].slice(0, maxCount);
    if (current.length + valid.length > maxCount) toast.error(`Max ${maxCount} images allowed`);

    onChange(merged);
  };

  const onSubmit = (data: ProductEditData) => {
    startTransition(async () => {
      try {
        const fd = new FormData();

        // text fields
        fd.append("name", data.name ?? "");
        fd.append("description", data.description ?? "");
        fd.append("price", String(data.price ?? 0));
        fd.append("inStock", String(data.inStock ?? 0));
        fd.append("category", data.category ?? "");
        fd.append("brand", data.brand ?? "");
        fd.append("concentration", data.concentration ?? "");
        fd.append("gender", data.gender ?? "");
        fd.append("volumeMl", String(data.volumeMl ?? 0));

        const fragranceNotes = {
          top: toNotesArray(topNotes),
          heart: toNotesArray(heartNotes),
          base: toNotesArray(baseNotes),
        };
        if (fragranceNotes.top.length || fragranceNotes.heart.length || fragranceNotes.base.length) {
          fd.append("fragranceNotes", JSON.stringify(fragranceNotes));
        }

        // keep existing images list
        fd.append("existingImages", JSON.stringify(existingImages));

        // new image uploads
        (data.image ?? []).forEach((f: File) => fd.append("image", f));

        const response = await handleUpdateProduct(product._id, fd);

        if (!response?.success) throw new Error(response?.message || "Update failed");

        toast.success(response.message || "Product updated");
      } catch (e: any) {
        toast.error(e.message);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (formErrors) => {
        const firstError =
          (Object.values(formErrors)[0] as any)?.message ||
          "Please fix the highlighted fields";
        toast.error(String(firstError));
      })}
      className="space-y-6 rounded-3xl p-6"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {/* Name */}
      <div className="space-y-1">
        <label className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Name
        </label>
        <input
          {...register("name")}
          className={inputClass}
          style={inputStyle}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {errors.name?.message && (
          <p className="text-xs" style={{ color: "#E57373" }}>
            {String(errors.name.message)}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Description
        </label>
        <textarea
          {...register("description")}
          className="min-h-[110px] w-full rounded-xl px-3 py-2 text-sm outline-none transition-colors"
          style={inputStyle}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {errors.description?.message && (
          <p className="text-xs" style={{ color: "#E57373" }}>
            {String(errors.description.message)}
          </p>
        )}
      </div>

      {/* Brand */}
      <div className="space-y-1">
        <label className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Brand
        </label>
        <input
          {...register("brand")}
          className={inputClass}
          style={inputStyle}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="e.g. Bottled Bloom"
        />
        {errors.brand?.message && (
          <p className="text-xs" style={{ color: "#E57373" }}>
            {String(errors.brand.message)}
          </p>
        )}
      </div>

      {/* Price + Stock */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Price
          </label>
          <input
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            className={inputClass}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {errors.price?.message && (
            <p className="text-xs" style={{ color: "#E57373" }}>
              {String(errors.price.message)}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Stock
          </label>
          <input
            type="number"
            {...register("inStock", { valueAsNumber: true })}
            className={inputClass}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {errors.inStock?.message && (
            <p className="text-xs" style={{ color: "#E57373" }}>
              {String(errors.inStock.message)}
            </p>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Category
        </label>

        <input type="hidden" {...register("category")} />

        <button
          type="button"
          onClick={() => setCategoryOpen(true)}
          className="h-11 w-full rounded-xl px-3 text-left text-sm outline-none transition-colors"
          style={inputStyle}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
        >
          {selectedCategory || "Select category"}
        </button>

        {errors.category?.message && (
          <p className="text-xs" style={{ color: "#E57373" }}>
            {String(errors.category.message)}
          </p>
        )}

        <CategoryModal
          open={categoryOpen}
          onClose={() => setCategoryOpen(false)}
          selected={selectedCategory}
          onSave={(value) => setValue("category", value, { shouldValidate: true })}
        />
      </div>

      {/* Concentration + Gender + Volume */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-1">
          <label className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Concentration
          </label>
          <select
            {...register("concentration")}
            className={inputClass}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            <option value="">Select</option>
            {CONCENTRATION_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {errors.concentration?.message && (
            <p className="text-xs" style={{ color: "#E57373" }}>
              {String(errors.concentration.message)}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Gender
          </label>
          <select
            {...register("gender")}
            className={inputClass}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            <option value="">Select</option>
            {GENDER_OPTIONS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
          {errors.gender?.message && (
            <p className="text-xs" style={{ color: "#E57373" }}>
              {String(errors.gender.message)}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Volume (ml)
          </label>
          <input
            type="number"
            {...register("volumeMl", { valueAsNumber: true })}
            className={inputClass}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {errors.volumeMl?.message && (
            <p className="text-xs" style={{ color: "#E57373" }}>
              {String(errors.volumeMl.message)}
            </p>
          )}
        </div>
      </div>

      {/* Fragrance Notes */}
      

      {/* Existing images */}
      <div className="space-y-2">
        <label className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Current Images
        </label>

        {existingImages.length ? (
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img, idx) => (
              <div key={`${img}-${idx}`} className="relative">
                <div
                  className="relative h-24 w-24 overflow-hidden rounded-xl"
                  style={{ border: "1px solid var(--border-subtle)" }}
                >
                  <Image src={buildImageUrl(img)} alt="existing" fill className="object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => setExistingImages((p) => p.filter((_, i) => i !== idx))}
                  className="absolute -right-2 -top-2 rounded-full px-2 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: "#D14343" }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            No existing images
          </p>
        )}
      </div>

      {/* Upload new images */}
      <div className="space-y-2">
        <label className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Upload New Images
        </label>

        <Controller
          name="image"
          control={control}
          render={({ field: { value = [], onChange } }) => (
            <div className="rounded-2xl p-5" style={{ border: "1px dashed var(--border-strong)" }}>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  handleImagesChange(files, onChange, value as File[]);

                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              />

              {value.length ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-3">
                    {(value as File[]).map((file, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          className="h-24 w-24 rounded-xl object-cover"
                          style={{ border: "1px solid var(--border-subtle)" }}
                          alt="preview"
                        />
                        <button
                          type="button"
                          onClick={() => onChange((value as File[]).filter((_, i) => i !== idx))}
                          className="absolute -right-2 -top-2 rounded-full px-2 py-1 text-xs font-semibold text-white"
                          style={{ backgroundColor: "#D14343" }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl px-4 py-2 text-xs font-semibold transition-transform hover:scale-[1.02]"
                    style={{ backgroundColor: "var(--gold-primary)", color: "var(--text-on-gold)" }}
                  >
                    Add more
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full">
                  <div className="grid place-items-center gap-2 py-6">
                    <div
                      className="grid h-10 w-10 place-items-center rounded-full"
                      style={{ backgroundColor: "var(--bg-elevated)" }}
                    >
                      <Camera className="h-6 w-6" style={{ color: "var(--gold-primary)" }} />
                    </div>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      Browse or Drag & Drop
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Up to 5 images
                    </p>
                    <p className="text-xs" style={{ color: "#E57373" }}>
                      Use PNG image if possible
                    </p>
                  </div>
                </button>
              )}
            </div>
          )}
        />

        {errors.image?.message && (
          <p className="text-xs" style={{ color: "#E57373" }}>
            {String(errors.image.message)}
          </p>
        )}
      </div>

      {/* Save */}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center rounded-2xl text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:hover:scale-100"
        style={{
          backgroundColor: "var(--gold-primary)",
          color: "var(--text-on-gold)",
          boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
        }}
      >
        {pending ? "Updating..." : "Update Product"}
      </button>
    </form>
  );
}