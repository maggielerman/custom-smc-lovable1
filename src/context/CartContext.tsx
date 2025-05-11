
import React, { createContext, useContext, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/bookTypes";
import { useAuth } from "./AuthContext";
import { Json } from "@/integrations/supabase/types";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Save cart to Supabase
  const saveCart = async (items: CartItem[]) => {
    if (!user) return;
    
    try {
      const totalAmount = items.reduce((total, item) => total + item.price, 0);
      
      // Convert CartItem[] to Json for Supabase
      const itemsJson: Json = items as unknown as Json;
      
      // Check if user has a saved cart
      const { data: existingCarts } = await supabase
        .from('saved_carts')
        .select('id')
        .eq('user_id', user.id);
        
      if (existingCarts && existingCarts.length > 0) {
        // Update existing cart
        await supabase
          .from('saved_carts')
          .update({
            items: itemsJson,
            total_amount: totalAmount,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingCarts[0].id);
      } else if (items.length > 0) {
        // Create new cart if there are items
        await supabase
          .from('saved_carts')
          .insert({
            user_id: user.id,
            items: itemsJson,
            total_amount: totalAmount
          });
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  // Cart functions
  const addToCart = (item: CartItem) => {
    // Check if item already exists in cart
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (!existingItem) {
      setCartItems([...cartItems, item]);
      
      // If user is logged in, try to save cart to Supabase
      saveCart([...cartItems, item]);
    }
  };
  
  const removeFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    
    // If user is logged in, update saved cart
    saveCart(updatedCart);
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);
  
  // Calculate cart count
  const cartCount = cartItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        cartTotal,
        cartCount
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
