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
    active: { backgroundColor: "rgba(201, 161, 93, 0.15)", color: "var(--gold-primary)", border: "1px solid rgba(201, 161, 93, 0.3)" },
    frozen: { backgroundColor: "rgba(245, 237, 224, 0.1)", color: "var(--text-secondary)", border: "1px solid var(--border-strong)" },
    inactive: { backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" },
  } as const;

  const label = s === "active" ? "Active" : s === "frozen" ? "Frozen" : "Inactive";

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
      style={map[s]}
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

  // ---- server-paging state ----
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
      <div
        className="flex w-full items-center gap-2 rounded-full px-3 py-1"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div className="flex flex-1 items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            style={{ color: "var(--text-secondary)" }}
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
            className="h-9 w-full bg-transparent text-sm outline-none"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        <button
          type="button"
          onClick={() => fetchPage(1, searchTerm.trim())}
          className="grid h-9 w-9 place-items-center rounded-full transition-colors"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          aria-label="Search"
          title="Search"
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
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
          className="h-10 inline-flex items-center rounded-2xl px-4 text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: "var(--gold-primary)",
            color: "var(--text-on-gold)",
            boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
          }}
        >
          Create new user
        </Link>
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Loading...
        </p>
      ) : pageItems.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          No users found
        </p>
      ) : (
        <div
          className="overflow-x-auto rounded-xl"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <table className="min-w-[1000px] w-full text-sm">
            <thead style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
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
              {pageItems.map((u, idx) => (
                <tr
                  key={u._id}
                  className="transition-colors"
                  style={{ borderTop: idx === 0 ? "none" : "1px solid var(--border-subtle)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <NextLink
                        href={`/admin/driver/${u._id}`}
                        className="flex items-center gap-3"
                      >
                        <UserAvatar username={u.username} avatar={u.avatar} />
                        <span
                          className="font-medium truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {u.username}
                        </span>
                      </NextLink>
                    </div>
                  </td>

                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                    {u.email}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                    {u.phoneNumber ?? "-"}
                  </td>
                  <td
                    className="px-4 py-3 truncate max-w-[240px]"
                    style={{ color: "var(--text-secondary)" }}
                  >
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
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
                        style={{ color: "var(--text-secondary)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        aria-label="Actions"
                        title="Actions"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 14a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                        </svg>
                      </button>

                      {openMenuFor === u._id && (
                        <div
                          className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl"
                          style={{
                            backgroundColor: "var(--bg-elevated)",
                            border: "1px solid var(--border-subtle)",
                            boxShadow: "var(--shadow-deep)",
                          }}
                        >
                          <button
                            type="button"
                            className="w-full px-3 py-2 text-left text-sm transition-colors"
                            style={{ color: "#E57373" }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(225, 83, 83, 0.1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
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
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
            style={{
              borderTop: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <span
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs"
                style={{ border: "1px solid var(--border-strong)" }}
              >
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
                className="h-8 rounded-md px-3 text-xs transition-colors disabled:opacity-50"
                style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => fetchPage(page + 1)}
                disabled={loading || page >= totalPages}
                className="h-8 rounded-md px-3 text-xs transition-colors disabled:opacity-50"
                style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
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