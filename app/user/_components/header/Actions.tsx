"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import {
  Heart,
  ShoppingCart,
  Search,
  User,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMyCart } from "@/lib/api/cart";

import CartDrawer from "@/app/user/cart/components/CartDrawer"; // adjust path
import { CART_UPDATED_EVENT } from "@/lib/cart-event";
import AvatarMenu from "@/app/_componets/AvatarMenu";
import NotificationBell from "@/app/_componets/Notification";
import Link from "next/link";

type CartItem = { quantity: number };
type CartResponse = {
  data?: { items?: CartItem[] } | any;
  items?: CartItem[];
};

export default function Actions() {
const { user, loading } = useAuth(); 
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const displayName = user?.userName || user?.name || user?.email || "User"; 

const fetchCartCount = async () => {
  try {
    const res: CartResponse = await getMyCart();

    const items: CartItem[] =
      res?.data?.items || res?.items || res?.data?.data?.items || [];

    setCartCount(items.length);
  } catch {
    setCartCount(0);
  }
};

useEffect(() => {
  if (loading) return;

  // initial load
  fetchCartCount();

  // listen for cart updates
  const handler = () => fetchCartCount();

  window.addEventListener(CART_UPDATED_EVENT, handler);

  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, handler);
  };
}, [loading]);


  return (
    <>
      <div className="flex items-center gap-5">
        {/* Search */}
        <Link
  href="/user/favorites"
  className="text-gray-600 hover:text-black transition"
  aria-label="Favorites"
>
  <Heart size={20} />
</Link>
        {/* Wishlist */}
      <div className="flex justify-center xl:justify-end ">
              {user?._id &&<NotificationBell userId={user._id} role={user.role} />}
            </div>

        {/* Cart (opens drawer) */}
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="relative text-gray-600 hover:text-black transition cursor-pointer"
          aria-label="Cart"
        >
          <ShoppingCart size={20} />

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs min-w-5 h-5 px-1 flex items-center justify-center rounded-full">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>

        {/* User menu */}
        <AvatarMenu displayName={displayName} roleLabel=""  image={user?.image}  profileHref="/user/profile" />
        
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
