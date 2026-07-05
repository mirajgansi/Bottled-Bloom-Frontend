"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import { handleCreateProduct } from "@/lib/actions/product-action";
import { ProductData, ProductSchema } from "../schema";
import { Camera } from "lucide-react";
import { CategoryModal } from "./category_modal";
import CreateProductStep1Skeleton from "./skeleton_add_prdocut";

/** ---------------- helpers ---------------- */
type ActionResponse =
  | { success: true; message?: string; data?: any }
  | { success: false; message?: string; issues?: any };

function getErrorMessage(err: unknown, fallback = "Create product failed") {
  if (!err) return fallback;
  if (err instanceof Error) return err.message || fallback;
  if (typeof err === "string") return err;

  if (typeof err === "object") {
    const anyErr = err as any;
    if (typeof anyErr.message === "string" && anyErr.message.trim()) return anyErr.message;

    if (Array.isArray(anyErr.issues) && anyErr.issues.length) {
      const first = anyErr.issues[0];
      const path = Array.isArray(first.path) ? first.path.join(".") : "";
      const msg = first.message || "Invalid input";
      return path ? `${path}: ${msg}` : msg;
    }
  }

  return fallback;
}

function normalizeActionResponse(res: any): ActionResponse {
  if (!res) return { success: false, message: "No response from server" };
  if (typeof res.success === "boolean") return res as ActionResponse;
  return { success: false, message: "Unexpected server response" };
}

function toNotesArray(text: string): string[] {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** ---------------- main wizard ---------------- */
type WizardData = ProductData;

const stepFields: Record<number, (keyof WizardData)[]> = {
  1: ["name", "image", "description"],
  2: ["price", "inStock", "category"],
  3: ["brand", "concentration", "gender", "volumeMl"],
};

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

const inputClass =
  "h-10 w-full rounded-md px-3 text-sm outline-none transition-colors";
const inputStyle = {
  backgroundColor: "var(--bg-elevated)",
  color: "var(--text-primary)",
  border: "1px solid var(--border-strong)",
};
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = "var(--gold-bright)");
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = "var(--border-strong)");

export default function CreateProductWizard() {
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [completed, setCompleted] = useState<{ 1: boolean; 2: boolean; 3: boolean }>({
    1: false,
    2: false,
    3: false,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);

  // fragrance notes as comma-separated text, parsed into arrays on submit
  const [topNotes, setTopNotes] = useState("");
  const [heartNotes, setHeartNotes] = useState("");
  const [baseNotes, setBaseNotes] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WizardData>({
    resolver: zodResolver(ProductSchema),
    shouldUnregister: false,
    mode: "onSubmit",
    defaultValues: {
      inStock: 0,
      image: [],
    },
  });
  const [pageLoading, setPageLoading] = useState(true);

  const selectedCategory = watch("category");

  const clearImage = (onChange?: (file: File | undefined) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImagesChange = (
    newFiles: File[],
    onChange: (files: File[]) => void,
    current: File[] = [],
  ) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;
    const maxCount = 5;

    const valid = newFiles.filter((f) => allowed.includes(f.type) && f.size <= maxSize);

    if (valid.length !== newFiles.length) toast.error("Only JPG/PNG/WEBP under 5MB allowed");

    const merged = [...current, ...valid].slice(0, maxCount);

    if (current.length + valid.length > maxCount) toast.error(`Max ${maxCount} images allowed`);

    onChange(merged);
  };

  const goNext = async () => {
    const fields = stepFields[step];
    const ok = await trigger(fields as any, { shouldFocus: true });

    if (!ok) return;

    setCompleted((p) => ({ ...p, [step]: true }));
    setStep((s) => (s === 1 ? 2 : 3));
  };

  const goBack = () => setStep((s) => (s === 3 ? 2 : 1));

  const onSubmit: SubmitHandler<WizardData> = async (data) => {
    if (step !== 3) return;

    const ok = await trigger(undefined, { shouldFocus: true });
    if (!ok) return;

    if (pending || isSubmitting) return;

    startTransition(async () => {
      try {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", String(data.price));
        formData.append("brand", data.brand);
        formData.append("concentration", data.concentration);
        formData.append("gender", data.gender);
        formData.append("volumeMl", String(data.volumeMl));
        formData.append("category", data.category);
        formData.append("inStock", String(data.inStock ?? 0));

        const fragranceNotes = {
          top: toNotesArray(topNotes),
          heart: toNotesArray(heartNotes),
          base: toNotesArray(baseNotes),
        };
        if (fragranceNotes.top.length || fragranceNotes.heart.length || fragranceNotes.base.length) {
          formData.append("fragranceNotes", JSON.stringify(fragranceNotes));
        }

        data.image?.forEach((file) => formData.append("image", file));

        const raw = await handleCreateProduct(formData);
        const response = normalizeActionResponse(raw);

        if (!response.success) throw new Error(response.message || "Create product failed");
        toast.success(response.message || "Product created successfully");

        reset({ inStock: 0, image: [] });
        if (fileInputRef.current) fileInputRef.current.value = "";
        setTopNotes("");
        setHeartNotes("");
        setBaseNotes("");
        setCompleted({ 1: false, 2: false, 3: false });
        setStep(1);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    });
  };

  const StepBubble = ({ n, label }: { n: 1 | 2 | 3; label: string }) => {
    const active = step === n;
    const done = completed[n];

    return (
      <button
        type="button"
        onClick={() => {
          if (n < step) setStep(n);
        }}
        className="flex items-center gap-2 text-left"
      >
        <span
          className="grid h-6 w-6 place-items-center rounded-full text-xs font-bold"
          style={
            done || active
              ? { backgroundColor: "var(--gold-primary)", color: "var(--text-on-gold)" }
              : { backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }
          }
        >
          {done ? "✓" : n}
        </span>
        <span
          className="text-sm"
          style={{
            color: active ? "var(--gold-primary)" : "var(--text-secondary)",
            fontWeight: active ? 600 : 400,
          }}
        >
          {label}
        </span>
      </button>
    );
  };

  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  if (pageLoading) return <CreateProductStep1Skeleton />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Stepper top (only 1..3) */}
      <div className="flex flex-wrap items-center gap-6">
        <StepBubble n={1} label="Product Information" />
        <StepBubble n={2} label="Product Detail Information" />
        <StepBubble n={3} label="Fragrance & Variant Details" />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Product Name
              </label>
              <input
                type="text"
                className={inputClass}
                style={inputStyle}
                onFocus={onFocus}
            
                {...register("name")}
                placeholder="e.g. Midnight Oud"
              />
              {errors.name?.message && (
                <p className="text-xs" style={{ color: "#E57373" }}>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Product Images
              </label>

              <Controller
                name="image"
                control={control}
                render={({ field: { value = [], onChange } }) => (
                  <div
                    className="rounded-xl border-dashed p-6"
                    style={{ border: "1px dashed var(--border-strong)" }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = Array.from(e.dataTransfer.files || []);
                      handleImagesChange(files, onChange, value);
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        handleImagesChange(files, onChange, value);
                      }}
                    />

                    {value.length ? (
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-3">
                          {value.map((file: File, idx: number) => (
                            <div key={idx} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                className="h-24 w-24 rounded-lg object-cover"
                                style={{ border: "1px solid var(--border-subtle)" }}
                                alt={`preview-${idx}`}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const next = value.filter((_: any, i: number) => i !== idx);
                                  onChange(next);
                                }}
                                className="absolute -right-2 -top-2 rounded-full px-2 py-1 text-xs text-white"
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
                          className="rounded-md px-3 py-2 text-xs font-semibold transition-transform hover:scale-[1.02]"
                          style={{ backgroundColor: "var(--gold-primary)", color: "var(--text-on-gold)" }}
                        >
                          Add more images
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
                            Select up to 5 images
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

            {/* Product Description */}
            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Product Description
              </label>
              <textarea
                className="min-h-[110px] w-full rounded-md px-3 py-2 text-sm outline-none transition-colors"
                style={inputStyle}
                onFocus={onFocus}
         
                {...register("description")}
                placeholder="A detailed description of the fragrance helps customers learn more about it."
              />
              {errors.description?.message && (
                <p className="text-xs" style={{ color: "#E57373" }}>
                  {errors.description.message}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Product Price
              </label>
              <input
                type="number"
                step="0.01"
                className={inputClass}
                style={inputStyle}
                onFocus={onFocus}
          
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.price?.message && (
                <p className="text-xs" style={{ color: "#E57373" }}>
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* In Stock */}
            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                In Stock
              </label>
              <input
                type="number"
                className={inputClass}
                style={inputStyle}
                onFocus={onFocus}
          
                {...register("inStock", { valueAsNumber: true })}
              />
              {errors.inStock?.message && (
                <p className="text-xs" style={{ color: "#E57373" }}>
                  {errors.inStock.message}
                </p>
              )}
            </div>

            {/* Category modal picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Category
              </label>

              <input type="hidden" {...register("category")} />

              <button
                type="button"
                onClick={() => setCategoryOpen(true)}
                className="h-10 w-full rounded-md px-3 text-left text-sm outline-none transition-colors"
                style={inputStyle}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-secondary)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
              >
                {selectedCategory ? selectedCategory : "Select category"}
              </button>

              {errors.category?.message && (
                <p className="text-xs" style={{ color: "#E57373" }}>
                  {errors.category.message}
                </p>
              )}

              <CategoryModal
                open={categoryOpen}
                onClose={() => setCategoryOpen(false)}
                selected={selectedCategory}
                onSave={(value) => {
                  setValue("category", value as any, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                }}
              />
            </div>
          </motion.div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Brand */}
            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Brand
              </label>
              <input
                type="text"
                className={inputClass}
                style={inputStyle}
                onFocus={onFocus}
    
                {...register("brand")}
                placeholder="e.g. Bottled Bloom"
              />
              {errors.brand?.message && (
                <p className="text-xs" style={{ color: "#E57373" }}>
                  {errors.brand.message}
                </p>
              )}
            </div>

            {/* Concentration + Gender */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  Concentration
                </label>
                <select
                  className={inputClass}
                  style={inputStyle}
                  onFocus={onFocus}
          
                  {...register("concentration")}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select concentration
                  </option>
                  {CONCENTRATION_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                {errors.concentration?.message && (
                  <p className="text-xs" style={{ color: "#E57373" }}>
                    {errors.concentration.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  Gender
                </label>
                <select
                  className={inputClass}
                  style={inputStyle}
                  onFocus={onFocus}
           
                  {...register("gender")}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
                {errors.gender?.message && (
                  <p className="text-xs" style={{ color: "#E57373" }}>
                    {errors.gender.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Volume */}
            <div className="space-y-1">
              <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Volume (ml)
              </label>
              <input
                type="number"
                className={inputClass}
                style={inputStyle}
                onFocus={onFocus}
                {...register("volumeMl", { valueAsNumber: true })}
                placeholder="e.g. 100"
              />
              {errors.volumeMl?.message && (
                <p className="text-xs" style={{ color: "#E57373" }}>
                  {errors.volumeMl.message as string}
                </p>
              )}
            </div>

        
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            if (step === 1) {
              reset();
              setPreviewImage(null);
              setTopNotes("");
              setHeartNotes("");
              setBaseNotes("");
              if (fileInputRef.current) fileInputRef.current.value = "";
              setCompleted({ 1: false, 2: false, 3: false });
              toast.info("Cleared");
              return;
            }
            goBack();
          }}
          className="h-10 rounded-md px-4 text-sm font-semibold transition-colors"
          style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          {step === 1 ? "Cancel" : "Back"}
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="h-10 rounded-md px-6 text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: "var(--gold-primary)",
              color: "var(--text-on-gold)",
              boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
            }}
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting || pending}
            className="h-10 rounded-md px-6 text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
            style={{
              backgroundColor: "var(--gold-primary)",
              color: "var(--text-on-gold)",
              boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
            }}
          >
            {isSubmitting || pending ? "Saving..." : "Create Product"}
          </button>
        )}
      </div>
    </form>
  );
}