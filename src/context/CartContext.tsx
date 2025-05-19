import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "@/types/bookTypes";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { clerkToSupabaseId } from "@/lib/utils";
import { CartContextType } from "@/types/cartTypes";
import {
  saveCartToSupabase,
  loadCartFromSupabase,
  saveCartWithNameToSupabase,
  calculateCartTotal,
  calculateCartCount
} from "@/utils/cartUtils";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [cartErrorShown, setCartErrorShown] = useState(false);
  const { user, getToken } = useAuth();

  // Load cart from Supabase when user signs in
  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user]);

  // Load cart from Supabase
  const loadCart = async () => {
    if (!user) return;

    try {
      setLoadingCart(true);
      setCartErrorShown(false);

      const supabaseUserId = clerkToSupabaseId(user.id);
      console.log('Loading cart for user:', user.id);
      console.log('Using Supabase user ID:', supabaseUserId);

      const { items, error } = await loadCartFromSupabase(
        supabaseUserId,
        getToken
      );

      if (error) {
        console.error('Error loading cart:', error);
        if (!cartErrorShown) {
          toast.error("Failed to load your cart");
          setCartErrorShown(true);
        }
        return;
      }

      if (items) {
        setCartItems(items);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      if (!cartErrorShown) {
        toast.error("Failed to load your cart");
        setCartErrorShown(true);
      }
    } finally {
      setLoadingCart(false);
    }
  };

  // Cart functions
  const addToCart = (item: CartItem) => {
    // Check if item already exists in cart
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (!existingItem) {
      const updatedCart = [...cartItems, item];
      setCartItems(updatedCart);

      // If user is logged in, try to save cart to Supabase
      if (user) {
        const supabaseUserId = clerkToSupabaseId(user.id);
        saveCartToSupabase(supabaseUserId, updatedCart, getToken);
      }
    }
  };

  const removeFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);

    // If user is logged in, update saved cart
    if (user) {
      const supabaseUserId = clerkToSupabaseId(user.id);
      saveCartToSupabase(supabaseUserId, updatedCart, getToken);
    }
  };

  const clearCart = () => {
    setCartItems([]);

    // If user is logged in, update saved cart
    if (user) {
      const supabaseUserId = clerkToSupabaseId(user.id);
      saveCartToSupabase(supabaseUserId, [], getToken);
    }
  };

  // Save cart with a specific name
  const saveCartWithName = async (name: string) => {
    if (!user) {
      toast.error("Please sign in to save carts");
      return;
    }

    try {
      const supabaseUserId = clerkToSupabaseId(user.id);
      await saveCartWithNameToSupabase(supabaseUserId, name, cartItems, getToken);
    } catch (error) {
      // Error handling is done in the utility function
      console.error('Error in saveCartWithName:', error);
    }
  };

  // Calculate cart total and count
  const cartTotal = calculateCartTotal(cartItems);
  const cartCount = calculateCartCount(cartItems);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        saveCartWithName,
        cartTotal,
        cartCount,
        isLoading: loadingCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
