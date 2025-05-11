
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/types/bookTypes";
import { Json } from "@/integrations/supabase/types";

interface SavedCart {
  id: string;
  name: string | null;
  items: CartItem[];
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export default function SavedCartsSection() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [savedCarts, setSavedCarts] = useState<SavedCart[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedCarts();
    }
  }, [user]);

  const fetchSavedCarts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('saved_carts')
        .select('*')
        .eq('user_id', user?.id || '')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      // Type conversion - ensure items are properly typed as CartItem[]
      const typedCarts: SavedCart[] = data?.map(cart => ({
        ...cart,
        // First cast to unknown, then to CartItem[] to avoid direct type assertions
        items: Array.isArray(cart.items) ? (cart.items as unknown) as CartItem[] : []
      })) || [];
      
      setSavedCarts(typedCarts);
    } catch (error: any) {
      toast.error(error.message || "Error fetching saved carts");
    } finally {
      setLoading(false);
    }
  };
  
  const handleRestoreCart = (cart: SavedCart) => {
    // Add all items from the saved cart to the current cart
    cart.items.forEach(item => {
      addToCart(item);
    });
    
    toast.success("Cart items restored to your current cart");
  };
  
  const handleDeleteCart = async (cartId: string) => {
    try {
      const { error } = await supabase
        .from('saved_carts')
        .delete()
        .eq('id', cartId)
        .eq('user_id', user?.id || '');
      
      if (error) throw error;
      
      setSavedCarts(savedCarts.filter(cart => cart.id !== cartId));
      toast.success("Saved cart deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Error deleting saved cart");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-book-red" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Your Saved Carts</h3>

      {savedCarts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">You don't have any saved shopping carts yet.</p>
            <p className="text-sm text-muted-foreground">
              Items in your cart will be automatically saved when you're signed in.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedCarts.map(cart => (
            <Card key={cart.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {cart.name || "Saved Cart"}
                </CardTitle>
                <CardDescription>
                  Saved on {new Date(cart.updated_at).toLocaleDateString()} • 
                  {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Total Amount:</span>
                    <span className="font-medium">${cart.total_amount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between space-x-2">
                    <Button 
                      variant="outline"
                      className="flex-1 border-book-red text-book-red hover:bg-book-red/10"
                      onClick={() => handleRestoreCart(cart)}
                    >
                      Restore Cart
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 border-red-300 text-red-500 hover:bg-red-50"
                      onClick={() => handleDeleteCart(cart.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
