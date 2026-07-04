import ProductsGrid from "../../_components/ProdcutGrid";

export default function FavoritesPage() {
  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-xl sm:text-2xl font-semibold"
            style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
          >
            My Favorites
          </h1>

          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Browse your saved favorite fragrances.
          </p>
        </div>

        {/* Products */}
        <ProductsGrid title="" mode="favorites" />
      </div>
    </div>
  );
}