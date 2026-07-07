"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getDriverDetail } from "@/lib/api/driver";
import { handleGetMyAssignedOrders } from "@/lib/actions/order-action";
import StatCard from "./StatsCard";
import { Clock, Truck } from "lucide-react";

type ActivityItem = {
  orderId: string;
  label: string;
  when: string;
  rawStatus?: string;
};

export default function DriverDashboardPage({ user }: { user: any }) {
  const driverId = user?._id;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [assigned, setAssigned] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const [lastActivity, setLastActivity] = useState("—");
  const [driverName, setDriverName] = useState(
    user?.name || user?.username || "Driver",
  );

  const [activityType, setActivityType] = useState("—");
  const [activityOrderId, setActivityOrderId] = useState<string | null>(null);

  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);

  const ran = useRef(false);

  const lastActivityLabel = useMemo(() => {
    return lastActivity === "—"
      ? "No activity info available"
      : `Last seen: ${lastActivity}`;
  }, [lastActivity]);

  useEffect(() => {
    if (!driverId) return;
    if (ran.current) return;
    ran.current = true;

    const run = async () => {
      try {
        setLoading(true);
        setErr(null);

        const ordersRes: any = await handleGetMyAssignedOrders({
          page: 1,
          size: 200,
        });
        if (ordersRes?.success === false) {
          throw new Error(
            ordersRes.message || "Failed to load assigned orders",
          );
        }

        const odata = ordersRes?.data ?? ordersRes;
        const meta = odata?.pagination || odata?.meta || {};
        const list =
          odata?.orders ||
          odata?.items ||
          (Array.isArray(odata) ? odata : []) ||
          [];

        setAssigned(Number(meta?.total ?? odata?.total ?? list.length ?? 0));
        setDelivered(list.filter((o: any) => o.status === "delivered").length);

        const getOrderTime = (o: any) =>
          new Date(o.updatedAt || o.createdAt || 0).getTime();

        const lastOrder = [...list]
          .filter((o: any) => o.createdAt || o.updatedAt)
          .sort((a: any, b: any) => getOrderTime(b) - getOrderTime(a))[0];

        if (lastOrder) {
          const when = lastOrder.updatedAt || lastOrder.createdAt;
          setLastActivity(new Date(when).toLocaleString());
          setActivityOrderId(lastOrder._id || null);

          if (lastOrder.status === "delivered") setActivityType("Delivered");
          else if (
            lastOrder.status === "shipped" ||
            lastOrder.status === "pending"
          )
            setActivityType("Assigned");
          else setActivityType(`Status: ${lastOrder.status}`);
        } else {
          setLastActivity("—");
          setActivityType("—");
          setActivityOrderId(null);
        }

        const toLabel = (status: string) => {
          if (status === "delivered") return "Delivered";
          if (status === "shipped") return "Shipped";
          if (status === "pending") return "Assigned";
          if (status === "cancelled") return "Cancelled";
          if (status === "paid") return "Paid";
          return `Status: ${status}`;
        };

        const recent: ActivityItem[] = [...list]
          .filter((o: any) => o.createdAt || o.updatedAt)
          .sort((a: any, b: any) => getOrderTime(b) - getOrderTime(a))
          .slice(0, 5)
          .map((o: any) => {
            const when = o.updatedAt || o.createdAt;
            const status = String(o.status || "");
            return {
              orderId: o._id,
              label: toLabel(status),
              rawStatus: status,
              when: when ? new Date(when).toLocaleString() : "—",
            };
          });

        setRecentActivities(recent);

        const detailRes: any = await getDriverDetail(driverId);
        const detail = detailRes?.data ?? detailRes;
        setDriverName(detail?.name || detail?.username || driverName);
      } catch (e: any) {
        setErr(e?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [driverId, driverName]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
        >
          {loading ? "Loading..." : `Welcome, ${driverName}`}
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          {lastActivityLabel}
        </p>

        {err ? (
          <div
            className="mt-6 rounded-2xl p-4 text-sm"
            style={{
              border: "1px solid rgba(225, 83, 83, 0.3)",
              backgroundColor: "rgba(225, 83, 83, 0.08)",
              color: "#E57373",
            }}
          >
            {err}
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Orders Assigned"
            value={loading ? "—" : assigned}
            sub="All orders assigned to you"
            color="yellow"
            Icon={Clock}
          />
          <StatCard
            title="Total Delivered"
            value={loading ? "—" : delivered}
            sub="Orders you have completed"
            color="green"
            Icon={Truck}
          />
        </div>

        {/* Last activity (single) */}
        <div
          className="mt-6 rounded-2xl p-5"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            My Last Activity
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Activity
              </p>
              <p className="text-lg font-bold" style={{ color: "var(--gold-primary)" }}>
                {activityType}
              </p>

              <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                {lastActivity === "—"
                  ? "No recent order activity found."
                  : lastActivity}
              </p>

              {activityOrderId ? (
                <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                  Order:{" "}
                  <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    {activityOrderId}
                  </span>
                </p>
              ) : null}
            </div>

            {activityOrderId ? (
              <a
                href={`/driver/orders/${activityOrderId}`}
                className="rounded-xl px-4 py-2 text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundColor: "var(--gold-primary)",
                  color: "var(--text-on-gold)",
                  boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
                }}
              >
                View Order
              </a>
            ) : null}
          </div>
        </div>

        {/* Last 5 activity list */}
        <div
          className="mt-6 rounded-2xl p-5"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Recent Activity (Last 5)
          </p>

          {loading ? (
            <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
              Loading activity...
            </p>
          ) : recentActivities.length ? (
            <ul className="mt-4 space-y-2">
              {recentActivities.map((a) => (
                <li
                  key={a.orderId}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {a.label}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      {a.when}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Order:{" "}
                      <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                        {a.orderId}
                      </span>
                    </p>
                  </div>

                  <a
                    href={`/driver/orders/${a.orderId}`}
                    className="rounded-lg px-3 py-2 text-xs font-semibold transition-transform duration-200 hover:scale-[1.02]"
                    style={{ backgroundColor: "var(--gold-primary)", color: "var(--text-on-gold)" }}
                  >
                    View
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
              No recent activity found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}