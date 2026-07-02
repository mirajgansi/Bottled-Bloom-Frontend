"use client";

import UserAvatar from "@/app/_componets/userAvatar";
import { handleGetDrivers } from "@/lib/actions/admin/driver-action";
import NextLink from "next/link";
import { useMemo, useState, useEffect } from "react";

type Driver = {
  _id: string;
  username: string;
  email: string;
  role?: "user" | "admin" | "driver"; // make optional
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

  if (loading) return <p className="text-sm text-gray-600">Loading drivers...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex w-full items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 shadow-sm dark:border-white/15 dark:bg-background">
        <div className="flex flex-1 items-center gap-2">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search drivers"
            className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {pageItems.length === 0 ? (
        <p className="text-sm text-gray-600">No drivers found</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-white/15 dark:bg-background">
          <table className="min-w-[1050px] w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 dark:bg-white/5 dark:text-gray-300">
              <tr className="text-left">
              <th className="px-4 py-3 font-medium"></th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Assigned</th>
                <th className="px-4 py-3 font-medium">Delivered</th>
                <th className="px-4 py-3 font-medium ">Action</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.map((d) => (
                <tr key={d._id} className="border-t">
                  <td className="px-4 py-3">
              <NextLink
                href={`/admin/driver/${d._id}`}
                className="flex items-center gap-3 "
              >
                <UserAvatar username={d.username} avatar={d.avatar} />
              </NextLink>
            </td>
                  <td className="px-4 py-3">{d.username}</td>
                  <td className="px-4 py-3">{d.email}</td>
                  <td className="px-4 py-3">{d.phoneNumber ?? "-"}</td>

                  <td className="px-4 py-3">{d.totalAssigned ?? 0}</td>
                  <td className="px-4 py-3">{d.deliveredCount ?? 0}</td>

                  <td className="px-4 py-3 ">
                    <NextLink
                      href={`/admin/driver/${d._id}`}
                      className="inline-flex h-9 items-center rounded-lg border px-3 text-sm"
                    >
                      View
                    </NextLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* pagination */}
          <div className="flex items-center justify-between px-4 py-3 text-sm">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-8 rounded-md border px-3 text-xs disabled:opacity-50"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="h-8 rounded-md border px-3 text-xs disabled:opacity-50"
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
