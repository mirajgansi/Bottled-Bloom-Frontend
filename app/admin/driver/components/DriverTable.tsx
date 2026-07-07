"use client";

import UserAvatar from "@/app/_componets/userAvatar";
import { handleGetDrivers } from "@/lib/actions/admin/driver-action";
import NextLink from "next/link";
import { useMemo, useState, useEffect } from "react";

type Driver = {
  _id: string;
  username: string;
  email: string;
  role?: "user" | "admin" | "driver";
  phoneNumber?: string;
  location?: string;
  status?: "active" | "inactive";
  avatar?: string;
  isAvailable?: boolean;

  totalAssigned?: number;
  deliveredCount?: number;
};

type Pagination = { size: number };

export default function DriversTable({
  pagination,
  initialSearch = "",
}: {
  pagination: Pagination;
  initialSearch?: string;
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await handleGetDrivers({
          page: 1,
          size: pagination?.size && pagination.size > 0 ? pagination.size : 10,
          search: "",
        });

        if (!res?.success) throw new Error(res?.message || "Failed to fetch drivers");

        setDrivers(Array.isArray(res.drivers) ? res.drivers : []);
      } catch (e: any) {
        setError(e.message || "Failed to fetch drivers");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [pagination?.size]);

  const driverOnly = useMemo(() => drivers, [drivers]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return driverOnly;

    return driverOnly.filter((d) => {
      return (
        d.username?.toLowerCase().includes(q) ||
        d.email?.toLowerCase().includes(q) ||
        (d.phoneNumber ?? "").toLowerCase().includes(q) ||
        (d.location ?? "").toLowerCase().includes(q)
      );
    });
  }, [driverOnly, searchTerm]);

  const pageSize = pagination?.size && pagination.size > 0 ? pagination.size : 10;
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [searchTerm]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  if (loading)
    return (
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        Loading drivers...
      </p>
    );
  if (error)
    return (
      <p className="text-sm" style={{ color: "#E57373" }}>
        {error}
      </p>
    );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div
        className="flex w-full items-center gap-2 rounded-full px-3 py-1"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div className="flex flex-1 items-center gap-2">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search drivers"
            className="h-9 w-full bg-transparent text-sm outline-none"
            style={{ color: "var(--text-primary)" }}
          />
        </div>
      </div>

      {pageItems.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          No drivers found
        </p>
      ) : (
        <div
          className="overflow-x-auto rounded-xl"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <table className="min-w-[1050px] w-full text-sm">
            <thead style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
              <tr className="text-left">
                <th className="px-4 py-3 font-medium"></th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Assigned</th>
                <th className="px-4 py-3 font-medium">Delivered</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.map((d, idx) => (
                <tr
                  key={d._id}
                  className="transition-colors"
                  style={{ borderTop: idx === 0 ? "none" : "1px solid var(--border-subtle)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td className="px-4 py-3">
                    <NextLink
                      href={`/admin/driver/${d._id}`}
                      className="flex items-center gap-3"
                    >
                      <UserAvatar username={d.username} avatar={d.avatar} />
                    </NextLink>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-primary)" }}>
                    {d.username}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                    {d.email}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                    {d.phoneNumber ?? "-"}
                  </td>

                  <td className="px-4 py-3" style={{ color: "var(--text-primary)" }}>
                    {d.totalAssigned ?? 0}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--gold-primary)" }}>
                    {d.deliveredCount ?? 0}
                  </td>

                  <td className="px-4 py-3">
                    <NextLink
                      href={`/admin/driver/${d._id}`}
                      className="inline-flex h-9 items-center rounded-lg px-3 text-sm transition-colors"
                      style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
                    >
                      View
                    </NextLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* pagination */}
          <div
            className="flex items-center justify-between px-4 py-3 text-sm"
            style={{ borderTop: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
          >
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-8 rounded-md px-3 text-xs transition-colors disabled:opacity-50"
                style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="h-8 rounded-md px-3 text-xs transition-colors disabled:opacity-50"
                style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}