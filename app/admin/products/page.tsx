// import CreateProductForm from "./_components/createProductForm";

import { handleGetAllProducts } from "@/lib/actions/product-action";
import ProductTable from "./_components/productTable";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams; 

  const page = params.page ? parseInt(String(params.page), 10) : 1;
  const size = params.size ? parseInt(String(params.size), 10) : 10;
  const search = typeof params.search === "string" ? params.search : undefined;

  const result = await handleGetAllProducts({ page, size, search });

  if (!result.success) {
    throw new Error(result.message || "Error fetching products");
  }

  return (
    <div className="p-4">
    
      <ProductTable
        products={result.products ?? []}
        pagination={result.pagination}
        search={search}
      />
    </div>
  );
}