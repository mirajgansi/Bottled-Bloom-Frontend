import { notFound } from "next/navigation";
import { handleGetProductsByCategory } from "@/lib/actions/product-action";
import CategoryProductsClient from "../component/page";
import ProductsGrid from "../../_components/ProdcutGrid";

function formatSlug(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await handleGetProductsByCategory(slug);
  if (!res?.success) return notFound();

  const products = res.products ?? [];
  const formattedName = formatSlug(slug);

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {formattedName}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Browse our collection of {formattedName.toLowerCase()} products.
          </p>
        </div>

        {/* Products */}
        {products.length ? (
<ProductsGrid
  title="Category Products"
  mode="prefetched"
  initialProducts={products}
/>        ) : (
          <div className="mt-10 rounded-2xl border bg-white p-8 text-center">
            <p className="text-gray-500">
              No products available in {formattedName} at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
