"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MoreVertical, Search } from "lucide-react";
import { toast } from "react-toastify";

import DeleteModal from "@/app/_componets/DeleteModal";
import { handleDeleteProduct, handleRestockProduct } from "@/lib/actions/product-action";
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
  image?: string;
  images?: string[];
  totalRevenue?: number;
  totalSold?: number;
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
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

function getStatus(p: Product) {
  const stock = Number(p.inStock ?? 0);

  if (stock <= 0) {
    return {
      label: "Out of Stock",
      style: { backgroundColor: "rgba(225, 83, 83, 0.12)", color: "#E57373", boxShadow: "inset 0 0 0 1px rgba(225, 83, 83, 0.3)" },
    };
  }
  if (p.available === false) {
    return {
      label: "Pre-Order",
      style: { backgroundColor: "rgba(232, 194, 122, 0.15)", color: "var(--gold-bright)", boxShadow: "inset 0 0 0 1px rgba(232, 194, 122, 0.3)" },
    };
  }
  return {
    label: "Active",
    style: { backgroundColor: "rgba(201, 161, 93, 0.15)", color: "var(--gold-primary)", boxShadow: "inset 0 0 0 1px rgba(201, 161, 93, 0.3)" },
  };
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
  const [restockLoading, setRestockLoading] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    (products || []).forEach((p) => p.category && set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [products]);

  const go = (next: Partial<{ page: number; size: number; search: string; category: string }>) => {
    const sp = new URLSearchParams(searchParams.toString());

    sp.set("page", String(next.page ?? pagination?.page ?? 1));
    sp.set("size", String(next.size ?? pagination?.size ?? 10));

    const s = (next.search ?? searchTerm ?? "").trim();
    if (s) sp.set("search", s);
    else sp.delete("search");

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

  useEffect(() => {
    setValue("category", currentCategory ?? "All", { shouldDirty: false });
    setValue("size", String(pagination?.size ?? 10), { shouldDirty: false });
  }, [currentCategory, pagination?.size, setValue]);

  const cat = watch("category");
  const size = watch("size");

  useEffect(() => {
    const nextSize = Number(size || 10);

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

      const matchCategory = cat === "All" || (p.category ?? "") === cat;

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
    <div
      className="rounded-3xl"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {/* Toolbar */}
      <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: "var(--text-secondary)" }}
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="h-10 w-full rounded-2xl pl-9 pr-3 text-sm outline-none transition-colors"
              style={{
                backgroundColor: "var(--bg-elevated)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-strong)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-bright)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
            />
          </div>

          <button
            onClick={() => go({ page: 1, search: searchTerm })}
            className="h-10 rounded-2xl px-4 text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={{
              backgroundColor: "var(--gold-primary)",
              color: "var(--text-on-gold)",
              boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
            }}
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
            className="h-10 rounded-2xl px-3 text-sm cursor-pointer"
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
            className="h-10 rounded-2xl px-3 text-sm outline-none cursor-pointer"
          />

          <Link
            href="/admin/products/createProduct"
            className="h-10 inline-flex items-center rounded-2xl px-4 text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: "var(--gold-primary)",
              color: "var(--text-on-gold)",
              boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
            }}
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px]" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <thead className="text-left text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
            <tr className="[&>th]:px-4 [&>th]:py-3">
              <th>Product ID</th>
              <th>Name Product</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Total Revenue</th>
              <th>Total Sold</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {filteredProducts?.map((p, idx) => {
              const status = getStatus(p);
              const img = buildImageUrl(p.image || p.images?.[0]);

              return (
                <tr
                  key={p._id}
                  className="transition-colors"
                  style={{ borderTop: idx === 0 ? "none" : "1px solid var(--border-subtle)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                    <span className="font-semibold">#{p._id.slice(-6).toUpperCase()}</span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 overflow-hidden rounded-lg"
                        style={{ border: "1px solid var(--border-subtle)", backgroundColor: "var(--bg-elevated)" }}
                      >
                        <Image
                          src={img}
                          alt={p.name}
                          width={36}
                          height={36}
                          className="h-9 w-9 object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold" style={{ color: "var(--text-primary)" }}>
                          {p.name}
                        </p>
                        <p className="text-xs" style={{ color: "var(--gold-primary)" }}>
                          {money(p.price)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                    {p.category ?? "-"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
                    >
                      {Number(p.inStock ?? 0)}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-semibold" style={{ color: "var(--text-primary)" }}>
                    {money(p.totalRevenue ?? p.price)}
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{ color: "var(--text-primary)" }}>
                    {p.totalSold ?? 0}
                  </td>

                  <td className="py-3">
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                      style={status.style}
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
                <td colSpan={7} className="px-4 py-10 text-center" style={{ color: "var(--text-secondary)" }}>
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer pagination */}
      <div
        className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Page <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{pagination.page}</span> of{" "}
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{pagination.totalPages}</span>
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={pagination.page <= 1}
            onClick={() => go({ page: pagination.page - 1 })}
            className="rounded-2xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50"
            style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            Prev
          </button>

          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => go({ page: pagination.page + 1 })}
            className="rounded-2xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50"
            style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
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