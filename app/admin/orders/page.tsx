import { handleGetAllOrders } from "@/lib/actions/order-action";
import OrdersPaginationClient from "./componets/OdersPaginationClient";
import { OrdersTable } from "./componets/OdersTable";
import { OrdersToolbar } from "./componets/OrdersToolBar";

type SearchParams = {
  page?: string;
  size?: string;
  search?: string;
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const result = await handleGetAllOrders({
    page: sp.page ? Number(sp.page) : 1,
    size: sp.size ? Number(sp.size) : 10,
    search: sp.search,
  });

  const orders = result.orders;
  const pagination = result.pagination;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex items-center justify-between">
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
          >
            Orders
          </h1>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard title="Total Orders" value={String(pagination.total ?? orders.length)} />
          <StatCard title="Paid Orders" value={String(orders.filter((o: any) => o.paymentStatus === "paid").length)} />
          <StatCard title="Pending" value={String(orders.filter((o: any) => o.status === "pending").length)} />
          <StatCard title="Delivered" value={String(orders.filter((o: any) => o.status === "delivered").length)} />
        </div>

        <div className="mt-6">
          <OrdersToolbar />
          <OrdersTable orders={orders} />
          <OrdersPaginationClient page={pagination.page} totalPages={pagination.totalPages} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div
      className="rounded-3xl p-5"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        {title}
      </p>
      <p className="mt-2 text-3xl font-bold" style={{ color: "var(--gold-primary)" }}>
        {value}
      </p>
      <div className="mt-3 h-1 w-24 rounded-full" style={{ backgroundColor: "var(--bg-elevated)" }} />
    </div>
  );
}