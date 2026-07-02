import Image from "next/image";
import { handleGetProductById } from "@/lib/actions/product-action";
import { notFound } from "next/navigation";
import ProductDetailClient from "../components/ProdcutDetail";
import ProductSection from "../../dashboard/_components/ProductSection";

function buildImageUrl(image?: string) {
  if (!image) return "/cookie.jpg";
  if (image.startsWith("http")) return image;

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}/${image.replace(/^\/+/, "")}`;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await handleGetProductById(id);

  if (!res?.success) notFound();

  const product = res.product; 
  if (!product?._id) notFound();

const images = product.images?.length
  ? product.images.map(buildImageUrl)
  : [buildImageUrl(product.image)];
 return (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
    <ProductDetailClient product={product} images={images} />
    <div className="mt-10">
      <ProductSection title="Popular" kind="popular" />
    </div>
  </div>
);

}
