"use client";

import Image from "next/image";
import CategoryCard from "@/app/user/dashboard/_components/Catregorycard";
import ProductSection from "@/app/user/dashboard/_components/ProductSection";
import ProductFilterBar from "@/app/user/dashboard/_components/ProductFillterBar";
import { useRouter } from "next/navigation";

const categories = [
  { title: "Eau de Parfum", image: "/categories/edp.jpg", href: "/user/category/eau-de-parfum" },
  { title: "Eau de Toilette", image: "/categories/edt.jpg", href: "/user/category/eau-de-toilette" },
  { title: "Attar & Oud", image: "/categories/attar-oud.jpg", href: "/user/category/attar-oud" },
  { title: "Women's Fragrance", image: "/categories/womens.jpg", href: "/user/category/womens" },
  { title: "Men's Fragrance", image: "/categories/mens.jpg", href: "/user/category/mens" },
  { title: "Body Mist", image: "/categories/body-mist.jpg", href: "/user/category/body-mist" },
  { title: "Gift Sets", image: "/categories/gift-sets.jpg", href: "/user/category/gift-sets" },
];

const HomePage = () => {
  const router = useRouter();

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* HERO */}
      <section className="relative h-[42vh] sm:h-[50vh] md:h-[56vh] w-full">
        <Image
          src="/hero-store.png"
          fill
          className="object-cover object-center"
          alt="Bottled Bloom"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(15,11,8,0.9) 0%, rgba(15,11,8,0.55) 45%, rgba(15,11,8,0.25) 100%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center">
          <div className="max-w-2xl">
            <p
              className="text-xs tracking-[0.3em] uppercase mb-3"
              style={{ color: "var(--gold-primary)" }}
            >
              Bottled Bloom
            </p>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight"
              style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
            >
              Fragrances Crafted to Be Remembered
            </h1>
            <p
              className="mt-3 text-sm sm:text-base md:text-lg max-w-xl"
              style={{ color: "var(--text-secondary)" }}
            >
              Discover signature scents, rare attars, and timeless classics — delivered to your door.
            </p>
          </div>
        </div>
      </section>

      {/* FILTER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-7 sm:-mt-8 relative z-10">
        <div
          className="p-3 sm:p-4 rounded-2xl"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-deep)",
          }}
        >
          <ProductFilterBar
            onSubmit={({ search, category }) => {
              const sp = new URLSearchParams();
              if (search.trim()) sp.set("search", search.trim());
              if (category && category !== "all") sp.set("category", category);
              router.push(`/user/products?${sp.toString()}`);
            }}
          />
        </div>
      </section>

      {/* CATEGORY + PRODUCTS */}
      <section className="max-w-6xl mx-auto px-1 sm:px-1 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* MOBILE: horizontal categories row */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between mb-3 px-4">
              <h3
                className="text-base font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Categories
              </h3>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
              {categories.map((c) => (
                <div key={c.href} className="flex-none w-[200px] sm:w-[230px]">
                  <CategoryCard title={c.title} image={c.image} href={c.href} />
                </div>
              ))}
            </div>
          </div>

          <aside className="hidden lg:block">
            <div
              className="rounded-2xl p-4 space-y-3 h-fit lg:sticky lg:top-20"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
              >
                Categories
              </h3>

              {categories.map((c) => (
                <CategoryCard key={c.href} title={c.title} image={c.image} href={c.href} />
              ))}
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <div className="space-y-10">
            <ProductSection title="Trending Fragrances" kind="trending" />
            <ProductSection title="New Arrivals" kind="recent" />
            <ProductSection title="Best Sellers" kind="bestSeller" />
            <ProductSection title="Most Viewed" kind="popular" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;