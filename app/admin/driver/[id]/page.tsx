import NextLink from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserAvatar from "@/app/_componets/userAvatar";
import { handleOneDriver } from "@/lib/actions/admin/driver-action";
import { OrderStatusPill } from "../../../_componets/OrderStatusPill";

export default async function DriverDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ page?: string }> | { page?: string };
}) {
  const { id } = await params;
  const sp = await Promise.resolve(searchParams);

  const res = await handleOneDriver({ driverId: id, page: 1, size: 10 });

  if (!res?.success) {
    return (
      <p className="p-4 text-sm" style={{ color: "#E57373" }}>
        {res?.message || "Failed to load driver"}
      </p>
    );
  }

  const { driver, stats, orders, pagination } = res.data;

  const cardStyle = {
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-subtle)",
  };

  return (
    <div className="p-4 space-y-4" style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1
            className="text-xl font-semibold"
            style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
          >
            Driver Detail
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Driver ID: {driver?._id}
          </p>
        </div>

        <NextLink
          href="/admin/driver"
          className="inline-flex h-9 items-center rounded-lg px-3 text-sm transition-colors"
          style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
        >
          Back
        </NextLink>
      </div>

      <div className="space-y-6">
        {/* TOP: Profile + Stats */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Profile */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl" style={cardStyle}>
              <CardHeader>
                <CardTitle className="text-base" style={{ color: "var(--text-primary)" }}>
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <UserAvatar username={driver?.username} avatar={driver?.avatar} />
                  <div className="min-w-0">
                    <div className="font-medium truncate" style={{ color: "var(--text-primary)" }}>
                      {driver?.username ?? "-"}
                    </div>
                    <div className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                      {driver?.email ?? "-"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <Row label="Phone" value={driver?.phoneNumber ?? "-"} />
                  <Row label="Location" value={driver?.location ?? "-"} />
                  <Row label="Gender" value={driver?.gender ?? "-"} />
                  <Row label="Date of birth" value={driver?.DOB ?? "-"} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="lg:col-span-1">
            <Card className="rounded-2xl" style={cardStyle}>
              <CardHeader>
                <CardTitle className="text-base" style={{ color: "var(--text-primary)" }}>
                  Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4">
                <StatBox label="Assigned Orders" value={stats?.totalAssigned ?? 0} tone="muted" />
                <StatBox label="Delivered Orders" value={stats?.deliveredCount ?? 0} tone="gold" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* BOTTOM: Orders */}
        <Card className="rounded-2xl" style={cardStyle}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base" style={{ color: "var(--text-primary)" }}>
              Orders
            </CardTitle>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Page {pagination.page} of {pagination.totalPages}
            </div>
          </CardHeader>

          <CardContent>
            {orders?.length ? (
              <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--border-subtle)" }}>
                <table className="min-w-[900px] w-full text-sm">
                  <thead style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                    <tr className="text-left">
                      <th className="px-4 py-3 font-medium">Order ID</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Total</th>
                      <th className="px-4 py-3 font-medium">Customer</th>
                      <th className="px-4 py-3 font-medium">Created</th>
                      <th className="px-4 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((o: any, idx: number) => (
                      <tr
                        key={o._id}
                        className="transition-colors"
                        style={{ borderTop: idx === 0 ? "none" : "1px solid var(--border-subtle)" }}
                      >
                        <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                          {o._id}
                        </td>
                        <td className="px-4 py-3">
                          <OrderStatusPill type="order" value={o.status} />
                        </td>
                        <td className="px-4 py-3 font-semibold" style={{ color: "var(--gold-primary)" }}>
                          Rs {o.total ?? "-"}
                        </td>
                        <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                          {o.shippingAddress?.userName ?? "-"}
                        </td>
                        <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                          {o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <NextLink
                            href={`/admin/orders/${o._id}`}
                            className="inline-flex h-8 items-center rounded-md px-3 text-xs transition-colors"
                            style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
                          >
                            View
                          </NextLink>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                No orders found for this driver.
              </p>
            )}

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-end gap-2">
              <NextLink
                href={`/admin/driver/${id}?page=${Math.max(1, pagination.page - 1)}`}
                className={`h-8 rounded-md px-3 text-xs flex items-center transition-colors ${
                  pagination.page <= 1 ? "pointer-events-none opacity-50" : ""
                }`}
                style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
              >
                Prev
              </NextLink>

              <NextLink
                href={`/admin/driver/${id}?page=${Math.min(
                  pagination.totalPages,
                  pagination.page + 1,
                )}`}
                className={`h-8 rounded-md px-3 text-xs flex items-center transition-colors ${
                  pagination.page >= pagination.totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
                style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
              >
                Next
              </NextLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div
      className="flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors"
      style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
     
     
    >
      <span className="whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
        {label}:
      </span>
      <span className="font-medium truncate" style={{ color: "var(--text-primary)" }}>
        {String(value)}
      </span>
    </div>
  );
}

function StatBox({
  label,
  value,
  tone = "muted",
}: {
  label: string;
  value: number;
  tone?: "gold" | "muted";
}) {
  const styles =
    tone === "gold"
      ? { backgroundColor: "rgba(201, 161, 93, 0.12)", color: "var(--gold-primary)", border: "1px solid rgba(201, 161, 93, 0.3)" }
      : { backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" };

  return (
    <div className="rounded-xl p-2" style={styles}>
      <div className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
        {label}
      </div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}