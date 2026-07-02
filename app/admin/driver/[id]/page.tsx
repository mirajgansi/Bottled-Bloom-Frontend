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

const res = await handleOneDriver({ driverId: id, page:1, size:10 });

if (!res?.success) {
  return <p className="p-4 text-sm text-red-600">{res?.message || "Failed to load driver"}</p>;
}



  if (!res?.success) {
    return <p className="p-4 text-sm text-red-600">{res?.message || "Failed to load driver"}</p>;
  }

const { driver, stats, orders, pagination } = res.data;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Driver Detail</h1>
          <p className="text-sm text-gray-500">Driver ID: {driver?._id}</p>
        </div>

        <NextLink
          href="/admin/driver"
          className="inline-flex h-9 items-center rounded-lg border px-3 text-sm"
        >
          Back
        </NextLink>
      </div>

    <div className="space-y-6">
  {/* TOP: Profile + Stats */}
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
    {/* Profile */}
    <div className="lg:col-span-2">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <UserAvatar username={driver?.username} avatar={driver?.avatar} />
            <div className="min-w-0">
              <div className="font-medium truncate">{driver?.username ?? "-"}</div>
              <div className="text-xs text-gray-500 truncate">
                {driver?.email ?? "-"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <Row label="Phone" value={driver?.phoneNumber ?? "-"} />
            <Row label="Location" value={driver?.location ?? "-"} />
            <Row label="gender" value={driver?.gender ?? "-"} />
             <Row label="Date of birth" value={driver?.DOB ?? "-"} />
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Stats */}
    <div className="lg:col-span-1">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Stats</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <StatBox
            label="Assigned Orders"
            value={stats?.totalAssigned ?? 0}
            color="blue"
          />
          <StatBox
            label="Delivered Orders"
            value={stats?.deliveredCount ?? 0}
            color="green"
          />
        </CardContent>
      </Card>
    </div>
  </div>

  {/* BOTTOM: Orders */}
  <Card className="rounded-2xl">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-base">Orders</CardTitle>
      <div className="text-sm text-gray-500">
        Page {pagination.page} of {pagination.totalPages}
      </div>
    </CardHeader>

    <CardContent>
      {orders?.length ? (
        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
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
              {orders.map((o: any) => (
                <tr key={o._id} className="border-t">
                  <td className="px-4 py-3">{o._id}</td>
                  <td className="px-4 py-3">
  <OrderStatusPill type="order" value={o.status} />
</td>
                  <td className="px-4 py-3">Rs {o.total ?? "-"}</td>
                  <td className="px-4 py-3">
                    {o.shippingAddress?.userName ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <NextLink
                      href={`/admin/orders/${o._id}`}
                      className="inline-flex h-8 items-center rounded-md border px-3 text-xs hover:bg-gray-50"
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
        <p className="text-sm text-gray-600">No orders found for this driver.</p>
      )}

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <NextLink
          href={`/admin/driver/${id}?page=${Math.max(1, pagination.page - 1)}`}
          className={`h-8 rounded-md border px-3 text-xs flex items-center ${
            pagination.page <= 1 ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Prev
        </NextLink>

        <NextLink
          href={`/admin/driver/${id}?page=${Math.min(
            pagination.totalPages,
            pagination.page + 1,
          )}`}
          className={`h-8 rounded-md border px-3 text-xs flex items-center ${
            pagination.page >= pagination.totalPages
              ? "pointer-events-none opacity-50"
              : ""
          }`}
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
    <div className="flex items-center gap-2 rounded-lg border bg-gray-50 px-3 py-2 hover:bg-green-200 hover:border-green-700 cursor-pointer">
      <span className="text-gray-600 whitespace-nowrap">{label}:</span>
      <span className="font-medium text-gray-900 truncate">{String(value)}</span>
    </div>
  );
}

function StatBox({
  label,
  value,
  color = "gray",
}: {
  label: string;
  value: number;
  color?: "green" | "blue" | "gray";
}) {
  const colors = {
    green: "bg-green-50 text-green-700 border-green-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <div className={`rounded-xl border p-2 ${colors[color]}`}>
      <div className="text-xs font-medium">{label}</div>
      <div className="text-2xl font-semibold ">{value}</div>
    </div>
  );
}
