"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  handleDeleteUser,
  handleGetAllUSER,
} from "@/lib/actions/admin/user-action";
import DeleteModal from "@/app/_componets/DeleteModal";
import UserAvatar from "@/app/_componets/userAvatar";
import NextLink from "next/link";
import Link from "next/link";

type User = {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin" | "driver";
  phoneNumber?: string;
  location?: string;
  status?: "active" | "frozen" | "inactive";
  totalOrders?: number;
  avatar?: string;
};

type Pagination = {
  page: number;
  size: number;
  total: number;
  totalPages: number;
};

function StatusPill({ status }: { status: User["status"] }) {
  const s = status ?? "active";
  const map = {
    active: "bg-green-100 text-green-700 border-green-200",
    frozen: "bg-blue-100 text-blue-700 border-blue-200",
    inactive: "bg-gray-100 text-gray-600 border-gray-200",
  } as const;

  const label = s === "active" ? "Active" : s === "frozen" ? "Frozen" : "Inactive";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${map[s]}`}
    >
      {label}
    </span>
  );
}

function useOutsideClick<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);
  return ref;
}

export default function UsersTable({
  users,
  pagination,
  search,
}: {
  users: User[];
  pagination: Pagination;
  search?: string;
}) {
  // ---- UI state ----
  const [searchTerm, setSearchTerm] = useState(search || "");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // dropdown
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);
  const menuRef = useOutsideClick<HTMLDivElement>(() => setOpenMenuFor(null));

  // ---- server-paging state (THIS IS THE KEY CHANGE) ----
  const [tableUsers, setTableUsers] = useState<User[]>(users ?? []);
  const [page, setPage] = useState<number>(pagination?.page ?? 1);
  const [pageSize, setPageSize] = useState<number>(
    pagination?.size && pagination.size > 0 ? pagination.size : 10
  );
  const [total, setTotal] = useState<number>(pagination?.total ?? 0);
  const [totalPages, setTotalPages] = useState<number>(pagination?.totalPages ?? 1);
  const [loading, setLoading] = useState(false);

  // Sync initial props (when server sends new initial data)
  useEffect(() => {
    setTableUsers(users ?? []);
    setPage(pagination?.page ?? 1);
    setPageSize(pagination?.size && pagination.size > 0 ? pagination.size : 10);
    setTotal(pagination?.total ?? 0);
    setTotalPages(pagination?.totalPages ?? 1);
  }, [users, pagination]);

  // Fetch a page from server (no route push)
  const fetchPage = async (nextPage: number, nextSearch = searchTerm) => {
    try {
      setLoading(true);
      const res = await handleGetAllUSER({
        page: nextPage,
        size: pageSize,
        search: nextSearch,
      });

      if (!res?.success) throw new Error(res?.message || "Failed to fetch users");

      setTableUsers(res.users ?? []);
      setPage(res.pagination?.page ?? nextPage);
      setPageSize(res.pagination?.size ?? pageSize);
      setTotal(res.pagination?.total ?? 0);
      setTotalPages(res.pagination?.totalPages ?? 1);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search -> fetch page 1
  useEffect(() => {
    const t = setTimeout(() => {
      fetchPage(1, searchTerm);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // If your backend already returns ONLY role=user, remove this filter.
  const pageItems = useMemo(
    () => tableUsers.filter((u) => u.role === "user"),
    [tableUsers]
  );

  const onDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await handleDeleteUser(deleteId);
      if (!res.success) throw new Error(res.message || "Failed to delete user");
      toast.success("User removed successfully");

      // refresh current page (no full reload)
      await fetchPage(page);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setDeleteId(null);
    }
  };

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = total === 0 ? 0 : Math.min(page * pageSize, total);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex w-full items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 shadow-sm dark:border-white/15 dark:bg-background">
        <div className="flex flex-1 items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.15 13.15z"
            />
          </svg>

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
            className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>

        <button
          type="button"
          onClick={() => fetchPage(1, searchTerm.trim())}
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
          aria-label="Search"
          title="Search"
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-600 dark:text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.15 13.15z"
            />
          </svg>
        </button>

        <Link
          href="/admin/user/create"
          className="h-10 inline-flex items-center rounded-2xl bg-green-600 border-gray-200 border-2 px-4 text-sm font-semibold text-white hover:bg-green-700"
        >
          Create new user
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-gray-600">Loading...</p>
      ) : pageItems.length === 0 ? (
        <p className="text-sm text-gray-600">No users found</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-white/15 dark:bg-background">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 dark:bg-white/5 dark:text-gray-300">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Address</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.map((u) => (
                <tr
                  key={u._id}
                  className="border-t border-gray-100 hover:bg-gray-50/60 dark:border-white/10 dark:hover:bg-white/5"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <NextLink
                        href={`/admin/driver/${u._id}`}
                        className="flex items-center gap-3 "
                      >
                        <UserAvatar username={u.username} avatar={u.avatar} />
                        <span className="font-medium dark:text-white truncate">
                          {u.username}
                        </span>
                      </NextLink>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {u.email}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {u.phoneNumber ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 truncate max-w-[240px]">
                    {u.location ?? "-"}
                  </td>
                
                  <td className="px-4 py-3">
                    <StatusPill status={u.status} />
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div
                      className="relative inline-block"
                      ref={openMenuFor === u._id ? menuRef : undefined}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuFor((prev) => (prev === u._id ? null : u._id))
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
                        aria-label="Actions"
                        title="Actions"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600 dark:text-gray-300"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 14a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                        </svg>
                      </button>

                      {openMenuFor === u._id && (
                        <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-white/15 dark:bg-background">
                          <button
                            type="button"
                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50/60 dark:hover:bg-red-500/10"
                            onClick={() => {
                              setOpenMenuFor(null);
                              setDeleteId(u._id);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination footer */}
          <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-600 dark:border-white/10 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs dark:border-white/15">
                {pageSize}
              </span>
              <span className="ml-3 text-xs">
                Showing {from}-{to} of {total}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchPage(page - 1)}
                disabled={loading || page <= 1}
                className="h-8 rounded-md border px-3 text-xs disabled:opacity-50 dark:border-white/15"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => fetchPage(page + 1)}
                disabled={loading || page >= totalPages}
                className="h-8 rounded-md border px-3 text-xs disabled:opacity-50 dark:border-white/15"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={onDelete}
        title="Delete Confirmation"
        description="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
}