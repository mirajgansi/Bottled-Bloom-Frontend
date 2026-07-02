"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MoreVertical, Search } from "lucide-react";
import { toast } from "react-toastify";

import DeleteModal from "@/app/_componets/DeleteModal";
import { handleDeleteProduct ,handleRestockProduct } from "@/lib/actions/product-action";
import RestockModal from "./RestockModal";
import ActionMenu from "./ActionMenu";
import { FormSelect } from "@/app/_componets/dropdown";
import { useForm } from "react-hook-form";

type Product = {
  _id: string;
  name: string;
  price: number;
  category?: string;
  inStock?: number;
  available?: boolean;
  image?: string;      // main image path from backend: "/uploads/xxx.jpg"
  images?: string[];   // optional gallery
  totalRevenue?: number;
  totalSold?:number;
};

type Pagination = {
  page: number;
  size: number;
  total: number;
  totalPages: number;
};
type FilterForm = {
  category: string;
  size: string; 
};
function buildImageUrl(img?: string) {
  if (!img) return "/cookie.jpg";
  if (img.startsWith("http")) return img;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}${img.startsWith("/") ? "" : "/"}${img}`;
}

function money(n: number) {
  // change currency if you want
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

function getStatus(p: Product) {
  const stock = Number(p.inStock ?? 0);

  // match the reference style: Out of Stock / Pre-Order / Active
  if (stock <= 0) {
    return { label: "Out of Stock", cls: "bg-red-50 text-red-700 ring-red-200" };
  }
  if (p.available === false) {
    return { label: "Pre-Order", cls: "bg-amber-50 text-amber-800 ring-amber-200" };
  }
  return { label: "Active", cls: "bg-green-50 text-green-700 ring-green-200" };
}

export default function ProductTable({
  products,
  pagination,
  search,
}: {
  products: Product[];
  pagination: Pagination;
  search?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

const currentCategory = searchParams.get("category") ?? "All";

  const [searchTerm, setSearchTerm] = useState(search ?? "");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const stockFilter = searchParams.get("stock") ?? "all";

const [restockId, setRestockId] = useState<string | null>(null);
//restock
const [restockLoading, setRestockLoading] = useState(false);
  // filters via URL (so refresh keeps state)
  const categories = useMemo(() => {
    const set = new Set<string>();
    (products || []).forEach((p) => p.category && set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [products]);

const go = (next: Partial<{ page: number; size: number; search: string; category: string }>) => {
  const sp = new URLSearchParams(searchParams.toString());

  // page/size
  sp.set("page", String(next.page ?? pagination?.page ?? 1));
  sp.set("size", String(next.size ?? pagination?.size ?? 10));

  // search
  const s = (next.search ?? searchTerm ?? "").trim();
  if (s) sp.set("search", s);
  else sp.delete("search");

  // category
  const cat = (next.category ?? currentCategory ?? "All").trim();
  if (cat && cat !== "All") sp.set("category", cat);
  else sp.delete("category");

  router.push(`/admin/products?${sp.toString()}`);
};

const { control, watch, setValue } = useForm<FilterForm>({
  defaultValues: {
    category: currentCategory ?? "All",
    size: String(pagination?.size ?? 10),
  },
});

// keep RHF synced if URL/pagination changes from outside
useEffect(() => {
  setValue("category", currentCategory ?? "All", { shouldDirty: false });
  setValue("size", String(pagination?.size ?? 10), { shouldDirty: false });
}, [currentCategory, pagination?.size, setValue]);

const cat = watch("category");
const size = watch("size");

// when category OR size changes -> update URL
useEffect(() => {
  const nextSize = Number(size || 10);

  // prevent useless push loop
  if (cat === (currentCategory ?? "All") && nextSize === (pagination?.size ?? 10)) return;

  go({ page: 1, category: cat, size: nextSize });
}, [cat, size, currentCategory, pagination?.size]);
const filteredProducts = useMemo(() => {
  const q = searchTerm.trim().toLowerCase();
  const cat = currentCategory;

  return (products ?? []).filter((p) => {
    const matchSearch =
      !q ||
      p.name?.toLowerCase().includes(q) ||
      (p.category ?? "").toLowerCase().includes(q);

    const matchCategory =
      cat === "All" || (p.category ?? "") === cat;

    return matchSearch && matchCategory;
  });
}, [products, searchTerm, currentCategory]);


  const onDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await handleDeleteProduct(deleteId);
      if (!res?.success) throw new Error(res?.message || "Failed to delete product");
      toast.success("Product deleted successfully");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete product");
    } finally {
      setDeleteId(null);
    }
  };


  

  return (
    <div className="rounded-3xl bg-white ring-1 ring-gray-100 shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="h-10 w-full rounded-2xl border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-gray-400"
            />
          </div>

          <button
            onClick={() => go({ page: 1, search: searchTerm })}
            className="h-10 rounded-2xl bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700 cursor-pointer"
          >
            Search
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category filter */}
        <FormSelect
  control={control}
  name="category"
  placeholder="All categories"
  options={categories.map((c) => ({ value: c, label: c }))}
  className="h-10 rounded-2xl border border-gray-200 bg-white px-3 text-sm cursor-pointer"
/>

          {/* Page size */}
     
<FormSelect<FilterForm>
  control={control}
  name="size"
  placeholder="Show"
  options={[10, 12, 20, 50].map((n) => ({
    value: String(n),
    label: `Show ${n}`,
  }))}
  className="h-10 rounded-2xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-gray-400 cursor-pointer"
/>
          <Link
              href="/admin/products/createProduct"
               className="h-10 inline-flex items-center rounded-2xl bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-t border-gray-100">
          <thead className="text-left text-xs font-semibold text-gray-500">
            <tr className="[&>th]:px-4 [&>th]:py-3">
              <th>Product ID</th>
              <th>Name Product</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Total Revenue</th>
           <th>Total Sold</th>
              <th>Status</th>
              <th >Action</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {filteredProducts?.map((p) => {
              const status = getStatus(p);
              const img = buildImageUrl(p.image || p.images?.[0]);

              return (
                <tr
                  key={p._id}
                  className="border-t border-gray-100 hover:bg-gray-50/60"
                >
                  <td className="px-4 py-3 text-gray-700">
                    <span className="font-semibold">#{p._id.slice(-6).toUpperCase()}</span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white">
                        <Image
                          src={img}
                          alt={p.name}
                          width={36}
                          height={36}
                          className="h-9 w-9 object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">{money(p.price)}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-gray-700">{p.category ?? "-"}</td>

                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                      {Number(p.inStock ?? 0)}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {money(p.totalRevenue ?? p.price)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {p.totalSold ?? 0}
                  </td>

                  <td className=" py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${status.cls}`}
                    >
                      {status.label}
                    </span>
                  </td>

                 <td className="px-4 py-3">
              <ActionMenu
                id={p._id}
                editHref={`/admin/products/edit/${p._id}`}
                onRestock={(id) => setRestockId(id)}
                onDelete={(id) => setDeleteId(id)}
              />
            </td>
                </tr>
              );
            })}

            {!filteredProducts?.length && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer pagination */}
      <div className="flex flex-col gap-3 border-t border-gray-100 p-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-gray-500">
          Page <span className="font-semibold text-gray-900">{pagination.page}</span> of{" "}
          <span className="font-semibold text-gray-900">{pagination.totalPages}</span> {" "}
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={pagination.page <= 1}
            onClick={() => go({ page: pagination.page - 1 })}
            className="rounded-2xl px-4 py-2 text-sm font-semibold ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-50"
          >
            Prev
          </button>

          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => go({ page: pagination.page + 1 })}
            className="rounded-2xl px-4 py-2 text-sm font-semibold ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete modal */}
      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={onDelete}
        title="Delete Confirmation"
        description="Are you sure you want to delete this product? This action cannot be undone."
      />


  <RestockModal
  isOpen={!!restockId}
  loading={restockLoading}
  onClose={() => setRestockId(null)}
  onConfirm={async ({ quantity, mode }) => {
    if (!restockId) return;

    const res = await handleRestockProduct(restockId, {
      quantity,
      mode,
    });

    if (!res?.success) {
      toast.error(res?.message || "Restock failed");
      return;
    }

    toast.success("Stock updated successfully");
    router.refresh();
    setRestockId(null);
  }}
/>
    </div>
    
  );
  
}
