"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Trash2, Plus, Minus, X } from "lucide-react";
import { toast } from "react-toastify";

import {
  getMyCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "@/lib/api/cart";
import { createOrder } from "@/lib/api/order";
import { handleWhoami } from "@/lib/actions/auth-actions";
import ShippingAddressModal from "./shippingAddressModal";
import { handleCreateOrder } from "@/lib/actions/order-action";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
};

type CartItem = {
    _id: string;           
  productId: string | Product;
  quantity: number;
};

type Cart = {
  items: CartItem[];
};

type ShippingAddress = {
  userName?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
};

function buildImageUrl(image?: string) {
  if (!image) return "/cookie.jpg";
  if (image.startsWith("http")) return image;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}/${image.replace(/^\/+/, "")}`;
}

function getProduct(item: CartItem): Product | null {
  if (typeof item.productId === "string") return null;
  return item.productId;
}

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [loading, setLoading] = useState(true);
const [mounted, setMounted] = useState(false);

  const [shippingOpen, setShippingOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<
    ShippingAddress | undefined
  >();
  const [loadingUser, setLoadingUser] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getMyCart();
      const items: CartItem[] =
        res?.data?.items || res?.items || res?.data?.data?.items || [];
      setCart({ items });
    } catch (e: any) {
      toast.error(e.message || "Failed to load cart");
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  // fetch only when drawer opens
  useEffect(() => {
    if (open) fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const total = useMemo(() => {
    return cart.items.reduce((sum, item) => {
      const p = getProduct(item);
      const price = p?.price ?? 0;
      return sum + price * item.quantity;
    }, 0);
  }, [cart.items]);

 
   const changeQty = async (productId: string, nextQty: number) => {
      if (nextQty < 1) return;
  
      try {
        await updateCartItemQuantity(productId, nextQty);
        await fetchCart();
      } catch (e: any) {
        toast.error(e.message || "Failed to update quantity");
      }
    };
  
    const removeItem = async (productId: string) => {
      try {
        await removeCartItem(productId);
        toast.success("Item removed");
        await fetchCart();
      } catch (e: any) {
        toast.error(e.message || "Failed to remove item");
      }
    };
  
    const onClearCart = async () => {
      try {
        await clearCart();
        toast.success("Cart cleared");
        await fetchCart();
      } catch (e: any) {
        toast.error(e.message || "Failed to clear cart");
      }
    };


  const loadUserShippingData = async () => {
    try {
      setLoadingUser(true);
      const res = await handleWhoami();
      const user = res?.data || res;
      if (!user) return;

      setShippingAddress({
        userName: user.userName || user.username || "",
        phone: user.phone || user.phoneNumber || "",
        address1: user.address1 || user.location || "",
        address2: user.address2 || "",
        city: user.city || "",
        state: user.state || "",
        zip: user.zip || "",
      });
    } catch {
      setShippingAddress(undefined);
    } finally {
      setLoadingUser(false);
    }
  };

  const onCheckout = async () => {
    await loadUserShippingData();
    setShippingOpen(true);
  };

 const onConfirmShipping = async (address: ShippingAddress) => {
  try {
    // 1) real user id
    const who = await handleWhoami();
    const user = who?.data || who;
    const userId = user?._id;

    if (!userId) {
      toast.error("User not found. Please login again.");
      return;
    }

    // 2) build items from populated product
    const items = cart.items
      .map((item) => {
        const product = getProduct(item);
        if (!product) return null;

        return {
          productId: product._id,                 // ✅ string
          name: product.name,                     // ✅
          price: product.price,                   // ✅
          image: product.image,                   // ✅ optional
          quantity: item.quantity,                // ✅
          lineTotal: product.price * item.quantity, // ✅ REQUIRED
        };
      })
      .filter(Boolean) as {
        productId: string;
        name: string;
        price: number;
        image?: string;
        quantity: number;
        lineTotal: number;
      }[];

    if (!items.length) {
      toast.error("Cart items are missing product details (populate cart in backend).");
      return;
    }

    // 3) totals
    const subtotal = items.reduce((sum, it) => sum + it.lineTotal, 0);
    const shippingFee = 0;
    const totalAmount = subtotal + shippingFee;

    // 4) send full payload
    const res = await handleCreateOrder({
      userId,
      items,
      subtotal,
      shippingFee,
      total: totalAmount,
      shippingAddress: address,
    });

    if (!res.success) {
      toast.error(res.message || "Checkout failed");
      return;
    }

    toast.success("Order placed successfully ");
    setShippingOpen(false);
    await fetchCart();
    onClose();
  } catch (e: any) {
    toast.error(e.message || "Checkout failed");
  }
};
const [visible, setVisible] = useState(false);

useEffect(() => {
  if (open) {
    setMounted(true);

    // next tick -> triggers animation
    requestAnimationFrame(() => setVisible(true));
    return;
  }

  // start closing animation
  setVisible(false);

  // wait for animation end then unmount
  const t = setTimeout(() => setMounted(false), 200);
  return () => clearTimeout(t);
}, [open]);

if (!mounted) return null;



  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
    <button
  className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
    visible ? "opacity-100" : "opacity-0"
  }`}
  onClick={onClose}
/>

      {/* panel */}
<aside
  className={`absolute right-0 top-0 h-full w-[420px] max-w-[92vw] bg-white shadow-2xl flex flex-col
  transform transition-transform duration-200 ease-out
  ${visible ? "translate-x-0" : "translate-x-full"}`}
>     {/* header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Your Cart</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="text-sm text-gray-500">Loading cart...</p>
          ) : !cart.items.length ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <ShoppingCart className="h-7 w-7 text-gray-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Cart is empty</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add products and they will show up here.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {cart.items.length} item(s)
                </p>

                <button
                  type="button"
                  onClick={onClearCart}
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs hover:bg-black/5"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </button>
              </div>

              <div className="space-y-3">
                {cart.items.map((item) => {
                  const product = getProduct(item);

                  if (!product) {
                    return (
                      <div
                        key={String(item.productId)}
                        className="rounded-2xl border p-3"
                      >
                        <p className="text-sm text-gray-600">
                          Product details not available (needs populate).
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(String(item.productId))}
                          className="mt-2 text-xs text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  }

const pid = typeof item.productId === "string" ? item.productId : item.productId._id;
                  const lineTotal = product.price * item.quantity;

                  return (
                    <div
                      key={pid}
                      className="flex gap-3 rounded-2xl border bg-white p-3"
                    >
                      <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-gray-100">
                        <Image
                          src={buildImageUrl(product.image)}
                          alt={product.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Rs {product.price.toFixed(2)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(pid)}
                            className="rounded-full p-1.5 text-gray-500 hover:bg-black/5 hover:text-red-600"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-full border">
                            <button
                        type="button"
                        onClick={() => changeQty(pid, item.quantity - 1)
}
                        className="p-2 hover:bg-black/5"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                     <input
  type="number"
  min={1}
  value={item.quantity}
  onChange={(e) => {
    const value = Number(e.target.value);
    if (!Number.isFinite(value)) return;

    changeQty(pid, Math.max(1, value));
  }}
  className="w-12 bg-transparent text-center text-sm font-medium outline-none"
  aria-label="Quantity"
/>

                      <button
                        type="button"
                        onClick={() => changeQty(pid, item.quantity + 1)
}
                        className="p-2 hover:bg-black/5"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                          <p className="text-sm font-semibold">
                            Rs {lineTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* footer */}
        <div className="border-t p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total</span>
            <span className="text-lg font-semibold">Rs {total.toFixed(2)}</span>
          </div>

         
          <button
            type="button"
            disabled={!cart.items.length || loading || loadingUser}
            onClick={onCheckout}
            className="mt-4 w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            Checkout
          </button>
        </div>
      </aside>
       <ShippingAddressModal
            open={shippingOpen}
            initialData={shippingAddress}
            onClose={() => setShippingOpen(false)}
            onSave={onConfirmShipping}
          />

    </div>
  );
}
