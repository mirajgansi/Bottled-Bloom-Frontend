"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { socket } from "@/lib/socket";

import {
  getMyNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api/notification";

type Role = "admin" | "driver" | "user";

type Notif = {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  data?: {
    orderId?: string;
    productId?: string;
    url?: string;
    urlByRole?: Partial<Record<Role, string>>;
  };
};

function resolveNotifUrl(n: Notif, role: Role) {
  // 0) if backend sends per-role urls, use them
  const roleUrl = n.data?.urlByRole?.[role];
  if (roleUrl) return roleUrl;

  switch (n.type) {
    case "driver_assigned":
    case "driver_eta":
    case "order_shipped":
    case "order_delivered": {
      const orderId = n.data?.orderId;
      if (!orderId) break;

      if (role === "user") return `/user/orders/${orderId}`;
      if (role === "driver") return `/driver/orders/${orderId}`;
      return `/admin/orders/${orderId}`;
    }

    case "product_added": {
      const productId = n.data?.productId;
      if (!productId) break;

      if (role === "user") return `/user/products/${productId}`;
      if (role === "admin") return `/admin/products/${productId}`;
      return `/products/${productId}`;
    }
  }

  // fallback for old notifications
  if (n.data?.url) return n.data.url;

  // page fallback (role-based)
  if (role === "user") return "/user/notifications";
  if (role === "driver") return "/driver/notifications";
  return "/admin/notifications";
}

function timeAgo(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}

export default function NotificationsPageClient({
  userId,
  role,
}: {
  userId: string;
  role: Role;
}) {
  const router = useRouter();

  const [items, setItems] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();

  const limit = 15;

  const load = async (nextPage = 1, mode: "replace" | "append" = "replace") => {
    const [countRes, listRes] = await Promise.all([
      getUnreadNotificationCount(),
      getMyNotifications({ page: nextPage, limit }),
    ]);

    setUnread(countRes.count ?? 0);

    const newItems: Notif[] = listRes.items ?? [];
    setItems((prev) => (mode === "append" ? [...prev, ...newItems] : newItems));

    // Decide hasMore from response (adjust if your API uses different fields)
    const total = listRes.total ?? undefined;
    if (typeof total === "number") {
      setHasMore(nextPage * limit < total);
    } else {
      // fallback: if returned less than limit, assume end
      setHasMore(newItems.length === limit);
    }

    setPage(nextPage);
  };

  useEffect(() => {
    if (!userId) return;

    // join room + initial load
    socket.emit("join", userId);

    startTransition(() => {
      load(1, "replace").catch(() => {});
    });

    const onNotif = (n: Notif) => {
      // push to top + increment badge
      setItems((prev) => [n, ...prev]);
      setUnread((u) => u + 1);

      toast(n.title, {
        description: n.message,
        action: {
          label: "Open",
          onClick: () => router.push(resolveNotifUrl(n, role)),
        },
      });
    };

    socket.on("notification", onNotif);

    return () => {
      socket.off("notification", onNotif);
    };
  }, [userId, role, router]);

  const openNotif = (n: Notif) => {
    startTransition(async () => {
      try {
        if (!n.read) {
          await markNotificationRead(n._id);
          setUnread((u) => Math.max(0, u - 1));
          setItems((prev) =>
            prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)),
          );
        }
        router.push(resolveNotifUrl(n, role));
      } catch {
        // silent
      }
    });
  };

  const markAllRead = () => {
    startTransition(async () => {
      try {
        await markAllNotificationsRead();
        setUnread(0);
        setItems((prev) => prev.map((x) => ({ ...x, read: true })));
      } catch {}
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Notifications</h1>
          <p className="text-sm text-gray-500">
            Unread: <span className="font-medium">{unread}</span>
          </p>
        </div>

        <button
          onClick={markAllRead}
          disabled={isPending || unread === 0}
          className="px-3 py-2 rounded-md text-sm font-medium bg-green-600 text-white disabled:opacity-50"
        >
          Mark all read
        </button>
      </div>

      <div className="mt-4 border rounded-lg overflow-hidden bg-white">
        {items.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No notifications
          </div>
        ) : (
          <ul className="divide-y">
            {items.map((n) => (
              <li
                key={n._id}
                onClick={() => openNotif(n)}
                className="cursor-pointer px-4 py-4 hover:bg-gray-50"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1 h-2.5 w-2.5 rounded-full ${
                      n.read ? "bg-transparent" : "bg-green-600"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div
                        className={`truncate ${
                          n.read ? "text-gray-800 font-medium" : "font-semibold"
                        }`}
                      >
                        {n.title}
                      </div>
                      <div className="shrink-0 text-xs text-gray-500">
                        {timeAgo(n.createdAt)}
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {n.message}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          disabled={isPending || !hasMore}
          onClick={() => startTransition(() => load(page + 1, "append").catch(() => {}))}
          className="px-4 py-2 rounded-md text-sm font-medium border disabled:opacity-50"
        >
          {hasMore ? "Load more" : "No more"}
        </button>
      </div>
    </div>
  );
}