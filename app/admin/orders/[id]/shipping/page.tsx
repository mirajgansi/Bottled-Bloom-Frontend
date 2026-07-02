import OrderDetailShell from "../componenets/OrderDetailShell";
import { handleGetOrderById } from "@/lib/actions/order-action";
import ShippingStatusSection from "./components/ShipmentLayout";
import ToastProvider from "@/app/_componets/ToastProvider";

export default async function ShippingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; 

  const res = await handleGetOrderById(id);

  if (!res?.success || !res?.data) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load order: {res?.message || "Unknown error"}
      </div>
    );
  }

  const order = res.data;

  return (
    <OrderDetailShell
      order={order}
      backHref={`/admin/orders/${order._id}`}
      shippingHref={`/admin/orders/${order._id}/shipping`}
      showProgress={false} 
    >
      <ShippingStatusSection order={order} />
      <ToastProvider />
    </OrderDetailShell>
  );
}
