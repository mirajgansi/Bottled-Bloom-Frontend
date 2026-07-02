"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { CalendarIcon, Camera } from "lucide-react";
import Image from "next/image";
import { ProductEditSchema, type ProductEditData } from "@/app/admin/products/schema";
import { handleUpdateProduct } from "@/lib/actions/product-action";
import { CategoryModal } from "../../_components/category_modal";

import { format, isValid, parse, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

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
      manufacturer: product?.manufacturer ?? "",
      manufactureDate: product?.manufactureDate ?? "",
      expireDate: product?.expireDate ?? "",
      nutritionalInfo: product?.nutritionalInfo ?? "",
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
      manufacturer: product?.manufacturer ?? "",
      manufactureDate: product?.manufactureDate ?? "",
      expireDate: product?.expireDate ?? "",
      nutritionalInfo: product?.nutritionalInfo ?? "",
      image: [],
    });

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
        fd.append("manufactureDate", data.manufactureDate ?? "");
        fd.append("expireDate", data.expireDate ?? "");
        // optional fields
        fd.append("manufacturer", data.manufacturer ?? "");
     

        fd.append("nutritionalInfo", data.nutritionalInfo ?? "");

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

function toDate(value?: string | null) {
  if (!value) return undefined;

  // ISO: 2020-01-02 or 2020-01-02T...
  const iso = parseISO(value);
  if (isValid(iso)) return iso;

  // US: M/d/yyyy or MM/dd/yyyy
  const mdY = parse(value, "M/d/yyyy", new Date());
  if (isValid(mdY)) return mdY;

  return undefined;
}

// choose ONE display format:
const DISPLAY_FMT = "MM/dd/yyyy"; // -> 01/02/2020
// or: const DISPLAY_FMT = "PPP";  // -> Jan 2, 2020
  return (
    <form
      onSubmit={handleSubmit(onSubmit, (formErrors) => {
        const firstError =
          (Object.values(formErrors)[0] as any)?.message ||
          "Please fix the highlighted fields";
        toast.error(String(firstError));
      })}
      className="space-y-6 rounded-3xl bg-white p-6 ring-1 ring-gray-200"
    >
      {/* Name */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-800">Name</label>
        <input
          {...register("name")}
          className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
        />
        {errors.name?.message && <p className="text-xs text-red-600">{String(errors.name.message)}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-800">Description</label>
        <textarea
          {...register("description")}
          className="min-h-[110px] w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
        />
        {errors.description?.message && (
          <p className="text-xs text-red-600">{String(errors.description.message)}</p>
        )}
      </div>

      {/* Nutrition */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-800">Nutrition</label>
        <textarea
          {...register("nutritionalInfo")}
          placeholder="e.g. Calories, Protein, Carbs, Fat..."
          className="min-h-[90px] w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
        />
        {errors.nutritionalInfo?.message && (
          <p className="text-xs text-red-600">{String(errors.nutritionalInfo.message)}</p>
        )}
      </div>

      {/* Price + Stock */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-800">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
          />
          {errors.price?.message && <p className="text-xs text-red-600">{String(errors.price.message)}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-800">Stock</label>
          <input
            type="number"
            {...register("inStock", { valueAsNumber: true })}
            className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
          />
          {errors.inStock?.message && <p className="text-xs text-red-600">{String(errors.inStock.message)}</p>}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-800">Category</label>

        <input type="hidden" {...register("category")} />

        <button
          type="button"
          onClick={() => setCategoryOpen(true)}
          className="h-11 w-full rounded-xl border border-gray-200 px-3 text-left text-sm outline-none hover:bg-gray-50"
        >
          {selectedCategory || "Select category"}
        </button>

        {errors.category?.message && <p className="text-xs text-red-600">{String(errors.category.message)}</p>}

        <CategoryModal
          open={categoryOpen}
          onClose={() => setCategoryOpen(false)}
          selected={selectedCategory}
          onSave={(value) => setValue("category", value, { shouldValidate: true })}
        />
      </div>
        {/* Manufacturer + Dates */}
<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
  {/* Manufacturer */}
  <div className="space-y-1">
    <label className="text-sm font-semibold text-gray-800">Manufacturer</label>
    <input
      {...register("manufacturer")}
      className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
    />
    {errors.manufacturer?.message && (
      <p className="text-xs text-red-600">{String(errors.manufacturer.message)}</p>
    )}
  </div>

  {/* Manufacture Date */}
  <div className="space-y-1">
    <label className="text-sm font-semibold text-gray-800">Manufacture Date</label>
<Controller
  control={control}
  name="manufactureDate"
  render={({ field }) => {
    const selectedDate = toDate(field.value);

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-11 w-full justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, DISPLAY_FMT)
            ) : (
              <span className="text-muted-foreground">Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => field.onChange(d ? format(d, "yyyy-MM-dd") : "")} // store ISO (recommended)
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  }}
/>
    {errors.manufactureDate?.message && (
      <p className="text-xs text-red-600">{String(errors.manufactureDate.message)}</p>
    )}
  </div>

  {/* Expire Date */}
  <div className="space-y-1">
    <label className="text-sm font-semibold text-gray-800">Expire Date</label>
<Controller
  control={control}
  name="manufactureDate"
  render={({ field }) => {
    const selectedDate = toDate(field.value);

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-11 w-full justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, DISPLAY_FMT)
            ) : (
              <span className="text-muted-foreground">Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => field.onChange(d ? format(d, "yyyy-MM-dd") : "")} // store ISO (recommended)
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  }}
/>
    {errors.expireDate?.message && (
      <p className="text-xs text-red-600">{String(errors.expireDate.message)}</p>
    )}
  </div>
</div>

      {/* Existing images */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-800">Current Images</label>

        {existingImages.length ? (
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img, idx) => (
              <div key={`${img}-${idx}`} className="relative">
                <div className="relative h-24 w-24 overflow-hidden rounded-xl ring-1 ring-gray-200">
                  <Image src={buildImageUrl(img)} alt="existing" fill className="object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => setExistingImages((p) => p.filter((_, i) => i !== idx))}
                  className="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No existing images</p>
        )}
      </div>

      {/* Upload new images */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-800">Upload New Images</label>

        <Controller
          name="image"
          control={control}
          render={({ field: { value = [], onChange } }) => (
            <div className="rounded-2xl border border-dashed border-gray-300 p-5">
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
                          className="h-24 w-24 rounded-xl object-cover ring-1 ring-gray-200"
                          alt="preview"
                        />
                        <button
                          type="button"
                          onClick={() => onChange((value as File[]).filter((_, i) => i !== idx))}
                          className="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Add more
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full">
                  <div className="grid place-items-center gap-2 py-6">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-100">
                      <Camera className="h-6 w-6 text-gray-700" />
                    </div>
                    <p className="text-sm text-gray-600">Browse or Drag & Drop</p>
                    <p className="text-xs text-gray-400">Up to 4 images</p>
          <p className="text-xs text-red-400">use Png image is possible</p>

                  </div>
                </button>
              )}
            </div>
          )}
        />

        {errors.image?.message && <p className="text-xs text-red-600">{String(errors.image.message)}</p>}
      </div>

      {/* Save */}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-green-700 text-sm font-semibold text-white hover:bg-green-800 cursor-pointer disabled:opacity-60"
      >
        {pending ? "Updating..." : "Update Product"}
      </button>
    </form>
  );
}
