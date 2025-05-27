
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/bookTypes";
import { Json } from "@/integrations/supabase/types";
import { toast } from "sonner";

// Save cart to Supabase
export const saveCartToSupabase = async (
  userId: string,
  items: CartItem[]
): Promise<void> => {
  try {
    console.log("saveCartToSupabase called with userId:", userId);
    console.log("saveCartToSupabase userId type:", typeof userId);
    console.log("saveCartToSupabase userId length:", userId.length);
    
    const totalAmount = calculateCartTotal(items);
    
    // Check if user has a saved cart
    const { data: existingCarts, error: fetchError } = await supabase
      .from('saved_carts')
      .select('id')
      .eq('user_id', userId);
      
    if (fetchError) {
      console.error('Error fetching existing carts:', fetchError);
      toast.error('Failed to save cart');
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
        toast.error('Failed to save cart');
        return;
      }
      
      console.log('Cart updated successfully');
    } else if (items.length > 0) {
      // Create new cart if there are items
      const { error: createError } = await supabase
        .from('saved_carts')
        .insert({
          user_id: userId,
          items: items as unknown as Json,
          total_amount: totalAmount
        });
        
      if (createError) {
        console.error('Error creating cart:', createError);
        toast.error('Failed to save cart');
        return;
      }
      
      console.log('New cart created successfully');
    }
  } catch (error) {
    console.error('Error saving cart:', error);
    toast.error('Failed to save cart');
  }
};

// Save cart with a name
export const saveCartWithNameToSupabase = async (
  userId: string,
  name: string,
  items: CartItem[]
): Promise<void> => {
  console.log("saveCartWithNameToSupabase called with userId:", userId);
  console.log("saveCartWithNameToSupabase userId type:", typeof userId);
  
  if (items.length === 0) {
    toast.error("Cannot save an empty cart");
    throw new Error("Cannot save an empty cart");
  }
  
  try {
    const totalAmount = calculateCartTotal(items);
    
    const { error } = await supabase
      .from('saved_carts')
      .insert({
        user_id: userId,
        name,
        items: items as unknown as Json,
        total_amount: totalAmount
      });
      
    if (error) {
      console.error('Error saving cart with name:', error);
      throw error;
    }
      
    toast.success("Cart saved successfully");
  } catch (error: any) {
    toast.error(error.message || "Error saving cart");
    throw error;
  }
};

// Load cart from Supabase
export const loadCartFromSupabase = async (
  userId: string
): Promise<{ items: CartItem[] | null; error: Error | null }> => {
  try {
    console.log("loadCartFromSupabase called with userId:", userId);
    console.log("loadCartFromSupabase userId type:", typeof userId);
    console.log("loadCartFromSupabase userId length:", userId.length);
    
    const { data, error } = await supabase
      .from('saved_carts')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1);
      
    if (error) {
      console.error('Error loading cart:', error);
      return { items: null, error: new Error(error.message) };
    }
    
    if (data && data.length > 0) {
      // Load the most recent cart and ensure items are properly typed
      const cartData = data[0];
      if (cartData.items && Array.isArray(cartData.items)) {
        // Double-cast to safely convert from Json to CartItem[]
        const items = (cartData.items as any) as CartItem[];
        if (items.length > 0) {
          console.log(`Loaded ${items.length} items from saved cart`);
          return { items, error: null };
        }
      }
    }
    
    return { items: [], error: null };
  } catch (error: any) {
    console.error('Error loading cart:', error);
    return { items: null, error };
  }
};

// Calculate cart total
export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price, 0);
};

// Calculate cart count
export const calculateCartCount = (items: CartItem[]): number => {
  return items.length;
};
