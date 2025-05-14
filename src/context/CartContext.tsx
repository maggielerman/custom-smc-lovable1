
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/bookTypes";
import { useAuth } from "./AuthContext";
import { Json } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { clerkToSupabaseId } from "@/lib/utils";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  saveCartWithName: (name: string) => Promise<void>;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [cartErrorShown, setCartErrorShown] = useState(false);
  const { user, userId } = useAuth();

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
      
      const { data, error } = await supabase
        .from('saved_carts')
        .select('*')
        .eq('user_id', supabaseUserId)
        .order('updated_at', { ascending: false })
        .limit(1);
        
      if (error) {
        console.error('Error loading cart:', error);
        if (!cartErrorShown) {
          toast.error("Failed to load your cart");
          setCartErrorShown(true);
        }
        return;
      }
      
      if (data && data.length > 0) {
        // Load the most recent cart and ensure items are properly typed
        const cartData = data[0];
        if (cartData.items && Array.isArray(cartData.items)) {
          // Double-cast to safely convert from Json to CartItem[]
          const items = (cartData.items as any) as CartItem[];
          if (items.length > 0) {
            setCartItems(items);
            console.log(`Loaded ${items.length} items from saved cart`);
          }
        }
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

  // Save cart to Supabase
  const saveCart = async (items: CartItem[]) => {
    if (!user) return;
    
    try {
      const supabaseUserId = clerkToSupabaseId(user.id);
      const totalAmount = items.reduce((total, item) => total + item.price, 0);
      
      // Check if user has a saved cart
      const { data: existingCarts, error: fetchError } = await supabase
        .from('saved_carts')
        .select('id')
        .eq('user_id', supabaseUserId);
        
      if (fetchError) {
        console.error('Error fetching existing carts:', fetchError);
        return;
      }
        
      if (existingCarts && existingCarts.length > 0) {
        // Update existing cart
        const { error: updateError } = await supabase
          .from('saved_carts')
          .update({
            items: items as unknown as Json,
            total_amount: totalAmount,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingCarts[0].id);
          
        if (updateError) {
          console.error('Error updating cart:', updateError);
          return;
        }
        
        console.log('Cart updated successfully');
      } else if (items.length > 0) {
        // Create new cart if there are items
        const { error: createError } = await supabase
          .from('saved_carts')
          .insert({
            user_id: supabaseUserId,
            items: items as unknown as Json,
            total_amount: totalAmount
          });
          
        if (createError) {
          console.error('Error creating cart:', createError);
          return;
        }
        
        console.log('New cart created successfully');
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };
  
  // Save cart with a specific name
  const saveCartWithName = async (name: string) => {
    if (!user) {
      toast.error("Please sign in to save carts");
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error("Cannot save an empty cart");
      return;
    }
    
    try {
      const supabaseUserId = clerkToSupabaseId(user.id);
      const totalAmount = cartItems.reduce((total, item) => total + item.price, 0);
      
      const { error } = await supabase
        .from('saved_carts')
        .insert({
          user_id: supabaseUserId,
          name,
          items: cartItems as unknown as Json,
          total_amount: totalAmount
        });
        
      if (error) {
        console.error('Error saving cart with name:', error);
        throw error;
      }
        
      toast.success("Cart saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Error saving cart");
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
      if (user) saveCart(updatedCart);
    }
  };
  
  const removeFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    
    // If user is logged in, update saved cart
    if (user) saveCart(updatedCart);
  };
  
  const clearCart = () => {
    setCartItems([]);
    
    // If user is logged in, update saved cart
    if (user) saveCart([]);
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
        clearCart,
        saveCartWithName,
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
