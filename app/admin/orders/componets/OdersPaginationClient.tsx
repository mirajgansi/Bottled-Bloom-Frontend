"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "./Pagination";

export default function OrdersPaginationClient({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const onPageChange = (p: number) => {
    const params = new URLSearchParams(sp.toString());
    params.set("page", String(p));
    router.push(`?${params.toString()}`);
  };

  return <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />;
}
