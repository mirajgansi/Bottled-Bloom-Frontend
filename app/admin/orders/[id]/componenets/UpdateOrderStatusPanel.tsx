// "use client";

// import { useState, useTransition } from "react";
// import { handleUpdateOrderStatus } from "@/lib/actions/order-action";

// type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";
// type PaymentStatus = "unpaid" | "paid";

// export default function UpdateOrderStatusPanel({
//   orderId,
//   currentStatus,
//   currentPayment,
// }: {
//   orderId: string;
//   currentStatus: OrderStatus;
//   currentPayment: PaymentStatus;
// }) {
//   const [status, setStatus] = useState<OrderStatus>(currentStatus);
//   const [paymentStatus, setPaymentStatus] =
//     useState<PaymentStatus>(currentPayment);

//   const [pending, startTransition] = useTransition();
//   const [msg, setMsg] = useState<string | null>(null);

//   const onSave = () => {
//     setMsg(null);
//     startTransition(async () => {
//       const res = await handleUpdateOrderStatus(orderId, { status, paymentStatus });
//       if (!res.success) setMsg(res.message);
//       else setMsg(res.message || "Updated");
//     });
//   };

//   return (
//     <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//       <div className="flex flex-col gap-3 md:flex-row md:items-end">
//         <div>
//           <label className="block text-xs font-semibold text-gray-600">
//             Fulfillment
//           </label>
//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value as OrderStatus)}
//             className="mt-1 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
//           >
//             <option value="pending">pending</option>
//             <option value="paid">paid</option>
//             <option value="shipped">shipped</option>
//             <option value="delivered">delivered</option>
//             <option value="cancelled">cancelled</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-xs font-semibold text-gray-600">
//             Payment
//           </label>
//           <select
//             value={paymentStatus}
//             onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
//             className="mt-1 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
//           >
//             <option value="unpaid">unpaid</option>
//             <option value="paid">paid</option>
//           </select>
//         </div>

//         <button
//           onClick={onSave}
//           disabled={pending}
//           className="rounded-2xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
//         >
//           {pending ? "Saving..." : "Save"}
//         </button>
//       </div>

//       {msg ? <p className="text-sm text-gray-600">{msg}</p> : <span />}
//     </div>
//   );
// }
