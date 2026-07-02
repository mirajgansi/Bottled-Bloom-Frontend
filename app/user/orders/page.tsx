import { handleGetMyOrders } from "@/lib/actions/order-action";
import OrdersList from "./components/myOrder";

export default async function MyOrdersPage() {
  const res = await handleGetMyOrders();

  if (!res.success) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {res.message || "Failed to fetch orders"}
        </p>
      </div>
    );
  }

  // res.data should be your orders array (based on your action)
  const orders = Array.isArray(res.data) ? res.data : res.data?.orders ?? [];

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">My Orders</h1>
          <p className="text-sm text-gray-500">Track your orders and view details.</p>
        </div>
      </div>

      <OrdersList orders={orders} />
    </div>
  );
}
