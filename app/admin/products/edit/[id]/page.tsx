import { handleGetProductById } from "@/lib/actions/product-action";
import EditProductForm from "../components/EditProductForm";
import { Toast } from "radix-ui";
import ToastProvider from "@/app/_componets/ToastProvider";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>; 
}) {
  const { id } = await params;
  const res = await handleGetProductById(id);

  if (!res.success) {
    return <p className="text-red-600">{res.message || "Product not found"}</p>;
  }


  const product = res.product; 

  return (
    <div className="p-6">
      <ToastProvider />
      <EditProductForm product={product} />
    </div>
  );
}
