
import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "@/types/bookTypes";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { getSafeSupabaseId } from "@/lib/auth/clerk-helpers";
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
  const { user } = useAuth();

  // Load cart from Supabase when user signs in
  useEffect(() => {
    if (user) {
      console.log("CartContext: User changed, loading cart for user:", user.id);
      loadCart();
    }
  }, [user]);

  // Load cart from Supabase
  const loadCart = async () => {
    if (!user) {
      console.log("CartContext: No user, skipping cart load");
      return;
    }

    try {
      setLoadingCart(true);
      setCartErrorShown(false);

      console.log("CartContext: Getting Supabase ID for Clerk user:", user.id);
      const supabaseUserId = getSafeSupabaseId(user.id);
      console.log("CartContext: Got Supabase ID:", supabaseUserId);
      
      if (!supabaseUserId) {
        console.error('CartContext: Failed to get Supabase user ID for Clerk ID:', user.id);
        if (!cartErrorShown) {
          toast.error("Failed to load your cart");
          setCartErrorShown(true);
        }
        return;
      }
      
      console.log('CartContext: Loading cart for user:', user.id);
      console.log('CartContext: Using Supabase user ID:', supabaseUserId);
      
      const { items, error } = await loadCartFromSupabase(supabaseUserId);
      
      if (error) {
        console.error('CartContext: Error loading cart:', error);
        if (!cartErrorShown) {
          toast.error("Failed to load your cart");
          setCartErrorShown(true);
        }
        return;
      }
      
      if (items) {
        console.log('CartContext: Successfully loaded cart with', items.length, 'items');
        setCartItems(items);
      }
    } catch (error) {
      console.error('CartContext: Error loading cart:', error);
      if (!cartErrorShown) {
        toast.error("Failed to load your cart");
        setCartErrorShown(true);
      }
    } finally {
      setLoadingCart(false);
    }
  };
  
  // Cart functions
  const addToCart = async (item: CartItem) => {
    console.log("CartContext: Adding item to cart:", item.id);
    // Check if item already exists in cart
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (!existingItem) {
      const updatedCart = [...cartItems, item];
      setCartItems(updatedCart);
      
      // If user is logged in, try to save cart to Supabase
      if (user) {
        console.log("CartContext: User logged in, saving cart to Supabase for user:", user.id);
        const supabaseUserId = getSafeSupabaseId(user.id);
        console.log("CartContext: Using Supabase ID for save:", supabaseUserId);
        if (supabaseUserId) {
          await saveCartToSupabase(supabaseUserId, updatedCart);
        } else {
          console.error("CartContext: Failed to get Supabase ID for cart save");
        }
      }
    } else {
      console.log("CartContext: Item already exists in cart, skipping add");
    }
  };
  
  const removeFromCart = async (itemId: string) => {
    console.log("CartContext: Removing item from cart:", itemId);
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    
    // If user is logged in, update saved cart
    if (user) {
      console.log("CartContext: User logged in, updating cart in Supabase for user:", user.id);
      const supabaseUserId = getSafeSupabaseId(user.id);
      console.log("CartContext: Using Supabase ID for update:", supabaseUserId);
      if (supabaseUserId) {
        await saveCartToSupabase(supabaseUserId, updatedCart);
      } else {
        console.error("CartContext: Failed to get Supabase ID for cart update");
      }
    }
  };
  
  const clearCart = async () => {
    console.log("CartContext: Clearing cart");
    setCartItems([]);
    
    // If user is logged in, update saved cart
    if (user) {
      console.log("CartContext: User logged in, clearing cart in Supabase for user:", user.id);
      const supabaseUserId = getSafeSupabaseId(user.id);
      console.log("CartContext: Using Supabase ID for clear:", supabaseUserId);
      if (supabaseUserId) {
        await saveCartToSupabase(supabaseUserId, []);
      } else {
        console.error("CartContext: Failed to get Supabase ID for cart clear");
      }
    }
  };

  // Save cart with a specific name
  const saveCartWithName = async (name: string) => {
    if (!user) {
      toast.error("Please sign in to save carts");
      return;
    }
    
    try {
      console.log("CartContext: Saving named cart for user:", user.id);
      const supabaseUserId = getSafeSupabaseId(user.id);
      console.log("CartContext: Using Supabase ID for named save:", supabaseUserId);
      
      if (!supabaseUserId) {
        toast.error("Error with user identification. Please try logging out and back in.");
        return;
      }
      
      await saveCartWithNameToSupabase(supabaseUserId, name, cartItems);
    } catch (error) {
      // Error handling is done in the utility function
      console.error('CartContext: Error in saveCartWithName:', error);
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
