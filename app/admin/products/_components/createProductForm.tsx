"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import { handleCreateProduct } from "@/lib/actions/product-action";
import {  ProductData, ProductSchema } from "../schema";
import {  CalendarIcon, Camera } from "lucide-react";
import { CategoryModal } from "./category_modal";
import CreateProductStep1Skeleton from "./skeleton_add_prdocut";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

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

/** ---------------- main wizard ---------------- */
type WizardData = ProductData
const stepFields: Record<number, (keyof WizardData)[]> = {
  1: ["name", "image", "description"],
  2: [ "price", "inStock", "category"],
  3: [
    "manufacturer",
    "manufactureDate",
    "expireDate",
    "nutritionalInfo",
  ],
};

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
  const maxCount = 3;

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
  console.log("SUBMIT CHECK:", {
    step,
    category: data.category,
    imageIsArray: Array.isArray(data.image),
    imageLen: data.image?.length,
  });

  if (step !== 3) return;

const ok = await trigger(undefined, { shouldFocus: true });
if (!ok) return;

console.log("schema.ts loaded (CreateProductWizard)");

  if (pending || isSubmitting) return;

  startTransition(async () => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      formData.append("manufacturer", data.manufacturer);

          if (data.manufactureDate) {
            formData.append(
              "manufactureDate",
              data.manufactureDate
            );
          }

          if (data.expireDate) {
            formData.append(
              "expireDate",
              data.expireDate
            );
          }
      formData.append("nutritionalInfo", data.nutritionalInfo);
      formData.append("category", data.category);
      formData.append("inStock", String(data.inStock ?? 0));

     data.image?.forEach((file) => formData.append("image", file));


      const raw = await handleCreateProduct(formData);
      const response = normalizeActionResponse(raw);

      if (!response.success) throw new Error(response.message || "Create product failed");
    toast.success(response.message || "Product created successfully ");

      reset({ inStock: 0, image: [] }); 
      if (fileInputRef.current) fileInputRef.current.value = "";
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
          // only allow going back to previous completed steps
          if (n < step) setStep(n);
        }}
        className="flex items-center gap-2 text-left"
      >
        <span
          className={[
            "grid h-6 w-6 place-items-center rounded-full text-xs font-bold",
            done ? "bg-green-600 text-white" : active ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700",
          ].join(" ")}
        >
          {done ? "✓" : n}
        </span>
        <span className={active ? "text-sm font-semibold text-green-600" : "text-sm text-gray-500"}>
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
        <StepBubble n={3} label="Product Variant Creation" />
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
              <label className="text-sm font-medium">Product Name</label>
              <input
                type="text"
                className="h-10 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/40"
                {...register("name")}
                placeholder="e.g. Wai Wai noodles"
              />
              {errors.name?.message && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Product Images</label>

             <Controller
  name="image"
  control={control}
  render={({ field: { value = [], onChange } }) => (
    <div
      className="rounded-xl border border-dashed border-gray-300 p-6"
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
                  alt={`preview-${idx}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = value.filter((_: any, i: number) => i !== idx);
                    onChange(next);
                  }}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md bg-green-600 px-3 py-2 text-xs font-semibold text-white"
          >
            Add more images
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full">
          <div className="grid place-items-center gap-2 py-6">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-100">
              <Camera className="h-6 w-6" />
            </div>
            <p className="text-sm text-gray-600">Browse or Drag & Drop</p>
            <p className="text-xs text-gray-400">Select up to 3 images</p>
            <p className="text-xs text-red-700">Use png  image if possible</p>
          </div>
        </button>
      )}
    </div>
  )}
/>

              {errors.image?.message && <p className="text-xs text-red-600">{String(errors.image.message)}</p>}
            </div>


            {/* Product Description */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Product Description</label>
              <textarea
                className="min-h-[110px] w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/40"
                {...register("description")}
                placeholder="A detailed description of the product helps customers to learn more about the product."
              />
              {errors.description?.message && (
                <p className="text-xs text-red-600">{errors.description.message}</p>
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
                <label className="text-sm font-medium">Product Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="h-10 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/40 disabled:bg-gray-100"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {errors.price?.message && <p className="text-xs text-red-600">{errors.price.message}</p>}
              </div>
         

            {/* In Stock */}
            <div className="space-y-1">
              <label className="text-sm font-medium">In Stock</label>
              <input
                type="number"
                className="h-10 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/40"
                {...register("inStock", { valueAsNumber: true })}
              />
              {errors.inStock?.message && <p className="text-xs text-red-600">{errors.inStock.message}</p>}
            </div>

            {/* Category modal picker */}
          <div className="space-y-2">
  <label className="text-sm font-medium">Category</label>

  <input type="hidden" {...register("category")} />

  <button
    type="button"
    onClick={() => setCategoryOpen(true)}
    className="h-10 w-full rounded-md border border-black/10 px-3 text-left text-sm outline-none hover:bg-black/5"
  >
    {selectedCategory ? selectedCategory : "Select category"}
  </button>

  {errors.category?.message && (
    <p className="text-xs text-red-600">{errors.category.message}</p>
  )}

  <CategoryModal
    open={categoryOpen}
    onClose={() => setCategoryOpen(false)}
    selected={selectedCategory}
    onSave={(value) => {
  console.log("CATEGORY SAVED:", value);
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
            {/* Manufacturer */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Manufacturer</label>
              <input
                type="text"
                className="h-10 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/40"
                {...register("manufacturer")}
              />
              {errors.manufacturer?.message && (
                <p className="text-xs text-red-600">{errors.manufacturer.message}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
  <label className="text-sm font-medium">Manufacture Date</label>

 <Controller
  control={control}
  name="manufactureDate"
  render={({ field }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-10 w-full justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {field.value ? format(new Date(field.value), "PPP") : <span className="text-muted-foreground">Pick a date</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={field.value ? new Date(field.value) : undefined}
          onSelect={(date) => field.onChange(date ? date.toISOString() : null)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )}
/>

  {errors.manufactureDate?.message && (
    <p className="text-xs text-red-600">
      {errors.manufactureDate.message}
    </p>
  )}
</div>

              <div className="space-y-1">
  <label className="text-sm font-medium">Expire Date</label>

<Controller
  control={control}
  name="expireDate"
  render={({ field }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-10 w-full justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {field.value ? format(new Date(field.value), "PPP") : <span className="text-muted-foreground">Pick a date</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={field.value ? new Date(field.value) : undefined}
          onSelect={(date) => field.onChange(date ? date.toISOString() : null)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )}
/>
  {errors.expireDate?.message && (
    <p className="text-xs text-red-600">
      {errors.expireDate.message}
    </p>
  )}
</div>

            </div>

            {/* Nutritional Info */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Nutritional Info</label>
              <input
                type="text"
                className="h-10 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/40"
                {...register("nutritionalInfo")}
              />
              {errors.nutritionalInfo?.message && (
                <p className="text-xs text-red-600">{errors.nutritionalInfo.message}</p>
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
              if (fileInputRef.current) fileInputRef.current.value = "";
              setCompleted({ 1: false, 2: false, 3: false });
              toast.info("Cleared");
              return;
            }
            goBack();
          }}
          className="h-10 rounded-md border border-gray-200 px-4 text-sm font-semibold hover:bg-black/5"
        >
          {step === 1 ? "Cancel" : "Back"}
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="h-10 rounded-md bg-green-600 px-6 text-sm font-semibold text-white hover:opacity-90"
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting || pending}
            className="h-10 rounded-md bg-green-600 px-6 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting || pending ? "Saving..." : "Create Product"}
          </button>
        )}
      </div>
    </form>
  );
}
