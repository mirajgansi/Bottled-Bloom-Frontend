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
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: item.quantity,
            lineTotal: product.price * item.quantity,
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

      toast.success("Order placed successfully");
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
      requestAnimationFrame(() => setVisible(true));
      return;
    }

    setVisible(false);
    const t = setTimeout(() => setMounted(false), 200);
    return () => clearTimeout(t);
  }, [open]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <button
        className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-[420px] max-w-[92vw] shadow-2xl flex flex-col
        transform transition-transform duration-200 ease-out
        ${visible ? "translate-x-0" : "translate-x-full"}`}
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        {/* header */}
        <div
          className="p-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" style={{ color: "var(--gold-primary)" }} />
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
            >
              Your Cart
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Loading cart...
            </p>
          ) : !cart.items.length ? (
            <div className="py-10 text-center">
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--bg-elevated)" }}
              >
                <ShoppingCart className="h-7 w-7" style={{ color: "var(--gold-primary)" }} />
              </div>
              <h3
                className="mt-4 text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Cart is empty
              </h3>
              <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                Add products and they will show up here.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {cart.items.length} item(s)
                </p>

                <button
                  type="button"
                  onClick={onClearCart}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-colors"
                  style={{
                    border: "1px solid var(--border-strong)",
                    color: "var(--text-secondary)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
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
                        className="rounded-2xl p-3"
                        style={{ border: "1px solid var(--border-subtle)" }}
                      >
                        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                          Product details not available (needs populate).
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(String(item.productId))}
                          className="mt-2 text-xs hover:underline"
                          style={{ color: "#E57373" }}
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
                      className="flex gap-3 rounded-2xl p-3"
                      style={{
                        border: "1px solid var(--border-subtle)",
                        backgroundColor: "var(--bg-elevated)",
                      }}
                    >
                      <div
                        className="relative h-16 w-16 overflow-hidden rounded-xl"
                        style={{ backgroundColor: "var(--bg-primary)" }}
                      >
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
                            <p
                              className="text-sm font-semibold line-clamp-1"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {product.name}
                            </p>
                            <p className="text-xs" style={{ color: "var(--gold-primary)" }}>
                              Rs {product.price.toFixed(2)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(pid)}
                            className="rounded-full p-1.5 transition-colors"
                            style={{ color: "var(--text-secondary)" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "var(--bg-primary)";
                              e.currentTarget.style.color = "#E57373";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                              e.currentTarget.style.color = "var(--text-secondary)";
                            }}
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div
                            className="inline-flex items-center rounded-full"
                            style={{ border: "1px solid var(--border-strong)" }}
                          >
                            <button
                              type="button"
                              onClick={() => changeQty(pid, item.quantity - 1)}
                              className="p-2 transition-colors"
                              style={{ color: "var(--text-primary)" }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-primary)")}
                              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
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
                              style={{ color: "var(--text-primary)" }}
                              aria-label="Quantity"
                            />

                            <button
                              type="button"
                              onClick={() => changeQty(pid, item.quantity + 1)}
                              className="p-2 transition-colors"
                              style={{ color: "var(--text-primary)" }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-primary)")}
                              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
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
        <div className="p-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: "var(--text-secondary)" }}>Total</span>
            <span className="text-lg font-semibold" style={{ color: "var(--gold-primary)" }}>
              Rs {total.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            disabled={!cart.items.length || loading || loadingUser}
            onClick={onCheckout}
            className="mt-4 w-full rounded-full py-3 text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            style={{
              backgroundColor: "var(--gold-primary)",
              color: "var(--text-on-gold)",
              boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
            }}
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