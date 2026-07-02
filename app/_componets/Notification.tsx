"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  getMyNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api/notification";

import { socket } from "@/lib/socket";

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

  // 2) Only if we couldn't build a url, use backend url (old notifications)
  if (n.data?.url) return n.data.url;

  // 3) Final fallback
  return "/notifications";
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

export default function NotificationBell({
  userId,
  role,
}: {
  userId: string;
  role: Role;
}) {
  const router = useRouter();
  const [items, setItems] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const topItems = useMemo(() => items.slice(0, 10), [items]);

  const refresh = async () => {
    const [countRes, listRes] = await Promise.all([
      getUnreadNotificationCount(),
      getMyNotifications({ page: 1, limit: 10 }),
    ]);

    setUnread(countRes.count ?? 0);
    setItems(listRes.items ?? []);
  };

  useEffect(() => {
    if (!userId) return;

    socket.emit("join", userId);

    startTransition(() => {
      (async () => {
        try {
          await refresh();
        } catch {}
      })();
    });

   const onNotif = (n: Notif) => {
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
    // role is not needed here; only userId changes room
  }, [userId]);

  const handleClickNotif = (n: Notif) => {
    startTransition(async () => {
      try {
        if (!n.read) {
          await markNotificationRead(n._id);
          setUnread((u) => Math.max(0, u - 1));
          setItems((prev) =>
            prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)),
          );
        }

        const url = resolveNotifUrl(n, role) ?? "/notifications";
        router.push(url);
      } catch {
      }
    });
  };

  const handleReadAll = () => {
    startTransition(async () => {
      try {
        await markAllNotificationsRead();
        setUnread(0);
        setItems((prev) => prev.map((x) => ({ ...x, read: true })));
      } catch {
        // silent
      }
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          {unread > 0 ? (
            <span className="absolute -top-1 -right-1 min-w-4.5 rounded-full bg-red-600 px-1 text-center text-[11px] leading-[18px] text-white">
              {unread > 99 ? "99+" : unread}
            </span>
          ) : null}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-90 p-0">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="text-sm font-semibold">Notifications</div>
          <button
            onClick={handleReadAll}
            disabled={isPending || unread === 0}
            className="text-xs font-medium text-green-700 disabled:opacity-50 hover:text-green-900 transition cursor-pointer"
          >
            Mark all read
          </button>
        </div>

        <DropdownMenuSeparator />

        {topItems.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-gray-500">
            No notifications
          </div>
        ) : (
          <div className="max-h-90 overflow-auto">
            {topItems.map((n) => (
              <DropdownMenuItem
                key={n._id}
                onClick={() => handleClickNotif(n)}
                className="cursor-pointer items-start gap-2 px-3 py-3"
              >
                <span
                  className={`mt-1 h-2 w-2 rounded-full ${
                    n.read ? "bg-transparent" : "bg-green-600"
                  }`}
                />
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`truncate text-sm ${
                        n.read ? "font-medium text-gray-700" : "font-semibold"
                      }`}
                    >
                      {n.title}
                    </div>
                    <div className="shrink-0 text-[11px] text-gray-500">
                      {timeAgo(n.createdAt)}
                    </div>
                  </div>
                  <div className="mt-0.5 line-clamp-2 text-sm text-gray-600">
                    {n.message}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        <DropdownMenuSeparator />

        <div className="px-3 py-2">
          <button
            onClick={() => router.push(role === "user" ? "/user/notifications"
  : role === "driver" ? "/driver/notifications"
  : "/admin/notifications")}
            className="w-full rounded-md bg-gray-900 py-2 text-sm font-semibold text-white  cursor-pointer hover:bg-gray-700 transition"
          >
            View all
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
