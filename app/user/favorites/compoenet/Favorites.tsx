import ProductsGrid from "../../_components/ProdcutGrid";

export default function FavoritesPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            My Favorites
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Browse your saved favorite products.
          </p>
        </div>

        {/* Products */}
        <ProductsGrid title="" mode="favorites" />
      </div>
    </div>
  );
}