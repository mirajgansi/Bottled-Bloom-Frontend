"use client";

import Image from "next/image";
import CategoryCard from "@/app/user/dashboard/_components/Catregorycard";
import ProductSection from "@/app/user/dashboard/_components/ProductSection";
import ProductFilterBar from "@/app/user/dashboard/_components/ProductFillterBar";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="relative h-[42vh] sm:h-[50vh] md:h-[56vh] w-full">
        <Image
          src="/hero-store.jpg"
          fill
          className="object-cover"
          alt="Store"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              All Your Daily Needs, All in One Place!
            </h1>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-white/90 max-w-xl">
              Enjoy the convenience of shopping without having to leave your home.
            </p>
          </div>
        </div>
      </section>

      {/* FILTER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-7 sm:-mt-8 relative z-10">
        <div className=" p-3 sm:p-4">
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
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold">Categories</h3>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
              {[
                { title: "Meat & Fish", image: "/categories/meat.png", href: "/user/category/meat" },
                { title: "Cooking Oil & Ghee", image: "/categories/oil.png", href: "/user/category/oil" },
                { title: "Pulses", image: "/categories/pluse.png", href: "/user/category/pulses" },
                { title: "Bakery", image: "/categories/bakery.png", href: "/user/category/bakery" },
                { title: "Snacks", image: "/categories/snacks.png", href: "/user/category/snacks" },
                { title: "Beverages", image: "/categories/beverages.png", href: "/user/category/beverages" },
              ].map((c) => (
                <div key={c.href} className="flex-none w-[200px] sm:w-[230px]">
                  <CategoryCard title={c.title} image={c.image} href={c.href} />
                </div>
              ))}
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3 h-fit lg:sticky lg:top-20">
              <h3 className="text-lg font-semibold mb-1">Categories</h3>

              <CategoryCard title="Meat & Fish" image="/categories/meat.png" href="/user/category/meat" />
              <CategoryCard title="Cooking Oil & Ghee" image="/categories/oil.png" href="/user/category/oil" />
              <CategoryCard title="Pulses" image="/categories/pluse.png" href="/user/category/pulses" />
              <CategoryCard title="Bakery" image="/categories/bakery.png" href="/user/category/bakery" />
              <CategoryCard title="Snacks" image="/categories/snacks.png" href="/user/category/snacks" />
              <CategoryCard title="Beverages" image="/categories/beverages.png" href="/user/category/beverages" />
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <div className="space-y-10 ">
            <ProductSection title="Trending items" kind="trending" />
            <ProductSection title="Recently Added" kind="recent" />
            <ProductSection title="Best Seller" kind="bestSeller" />
            <ProductSection title="Top Viewed" kind="popular" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;