"use client";
import { useRouter } from "next/navigation";
import ProductsGrid from "../../_components/ProdcutGrid";
import ProductFilterBar from "../../dashboard/_components/ProductFillterBar";

export default function AllProductsPage() {
  const router = useRouter();

  return (
   <div className="w-full">
      {/* Top container */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        {/* FILTER BAR */}
        <div className="sticky top-0 z-20  ">
          <ProductFilterBar
          onSubmit={({ search, category }) => {
            const sp = new URLSearchParams();

            if (search?.trim()) sp.set("search", search.trim());
            if (category && category !== "all") sp.set("category", category);

            router.push(`/user/products?${sp.toString()}`);
          }}
        />
      </div>
  <div className="mt-6">
          <ProductsGrid title="" pageSize={20} refreshMs={10000} />
        </div>
      </div>
</div>

  );
}