
import React, { createContext, useContext, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

// Define types for our book customization
export type ConceptionType = 'iui' | 'ivf' | 'donor-egg' | 'donor-sperm' | 'donor-embryo';
export type FamilyStructure = 'hetero-couple' | 'single-mom' | 'single-dad' | 'two-moms' | 'two-dads';

interface CartItem {
  id: string;
  title: string;
  price: number;
}

interface SavedDraft {
  id: string;
  title: string;
  conception_type: string;
  family_structure: string;
  child_name: string | null;
  child_age: string | null;
  used_donor_egg: boolean;
  used_donor_sperm: boolean;
  used_donor_embryo: boolean;
  used_surrogate: boolean;
  created_at: string;
}

interface BookContextType {
  // Book details
  conceptionType: ConceptionType;
  setConceptionType: (type: ConceptionType) => void;
  familyStructure: FamilyStructure;
  setFamilyStructure: (structure: FamilyStructure) => void;
  childName: string;
  setChildName: (name: string) => void;
  childAge: string;
  setChildAge: (age: string) => void;
  
  // Donor and surrogacy options
  usedDonorEgg: boolean;
  setUsedDonorEgg: (used: boolean) => void;
  usedDonorSperm: boolean;
  setUsedDonorSperm: (used: boolean) => void;
  usedDonorEmbryo: boolean;
  setUsedDonorEmbryo: (used: boolean) => void;
  usedSurrogate: boolean;
  setUsedSurrogate: (used: boolean) => void;
  
  // Preview state
  isPreviewOpen: boolean;
  openPreview: () => void;
  closePreview: () => void;
  
  // Payment state
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
  
  // Cart functionality
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  cartTotal: number;
  cartCount: number;

  // Draft functionality
  saveDraft: (title?: string) => Promise<void>;
  savedDrafts: SavedDraft[];
  loadDraft: (draft: SavedDraft) => void;
  deleteDraft: (draftId: string) => Promise<void>;
  loadingSavedDrafts: boolean;
  fetchSavedDrafts: () => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Book details state
  const [conceptionType, setConceptionType] = useState<ConceptionType>('ivf');
  const [familyStructure, setFamilyStructure] = useState<FamilyStructure>('hetero-couple');
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("3-5");
  
  // Donor and surrogacy options
  const [usedDonorEgg, setUsedDonorEgg] = useState(false);
  const [usedDonorSperm, setUsedDonorSperm] = useState(false);
  const [usedDonorEmbryo, setUsedDonorEmbryo] = useState(false);
  const [usedSurrogate, setUsedSurrogate] = useState(false);
  
  // Preview state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Checkout state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Saved drafts state
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>([]);
  const [loadingSavedDrafts, setLoadingSavedDrafts] = useState(false);
  
  // Get current auth user
  const { user } = useAuth();
  
  const openPreview = () => setIsPreviewOpen(true);
  const closePreview = () => setIsPreviewOpen(false);
  
  const openCheckout = () => setIsCheckoutOpen(true);
  const closeCheckout = () => setIsCheckoutOpen(false);
  
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
  
  // Save cart to Supabase
  const saveCart = async (items: CartItem[]) => {
    if (!user) return;
    
    try {
      const totalAmount = items.reduce((total, item) => total + item.price, 0);
      
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
            items: items,
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
            items: items,
            total_amount: totalAmount
          });
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };
  
  // Save book draft to Supabase
  const saveDraft = async (title?: string) => {
    if (!user) {
      toast.error("Please sign in to save drafts");
      return;
    }
    
    try {
      const draftTitle = title || (childName ? `${childName}'s Story` : "Untitled Draft");
      
      const { data, error } = await supabase
        .from('saved_drafts')
        .insert({
          user_id: user.id,
          title: draftTitle,
          conception_type: conceptionType,
          family_structure: familyStructure,
          child_name: childName || null,
          child_age: childAge || null,
          used_donor_egg: usedDonorEgg,
          used_donor_sperm: usedDonorSperm,
          used_donor_embryo: usedDonorEmbryo,
          used_surrogate: usedSurrogate
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success("Draft saved successfully");
      
      // Update local state
      fetchSavedDrafts();
      
      return data;
    } catch (error: any) {
      toast.error(error.message || "Error saving draft");
    }
  };
  
  // Fetch user's saved drafts
  const fetchSavedDrafts = async () => {
    if (!user) return;
    
    try {
      setLoadingSavedDrafts(true);
      const { data, error } = await supabase
        .from('saved_drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setSavedDrafts(data || []);
    } catch (error: any) {
      console.error('Error fetching drafts:', error);
    } finally {
      setLoadingSavedDrafts(false);
    }
  };
  
  // Load a saved draft
  const loadDraft = (draft: SavedDraft) => {
    setConceptionType(draft.conception_type as ConceptionType);
    setFamilyStructure(draft.family_structure as FamilyStructure);
    setChildName(draft.child_name || "");
    setChildAge(draft.child_age || "3-5");
    setUsedDonorEgg(draft.used_donor_egg);
    setUsedDonorSperm(draft.used_donor_sperm);
    setUsedDonorEmbryo(draft.used_donor_embryo);
    setUsedSurrogate(draft.used_surrogate);
    
    toast.success(`Loaded draft: ${draft.title}`);
  };
  
  // Delete a saved draft
  const deleteDraft = async (draftId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('saved_drafts')
        .delete()
        .eq('id', draftId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setSavedDrafts(savedDrafts.filter(draft => draft.id !== draftId));
      
      toast.success("Draft deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Error deleting draft");
    }
  };
  
  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);
  
  // Calculate cart count
  const cartCount = cartItems.length;
  
  return (
    <BookContext.Provider
      value={{
        conceptionType,
        setConceptionType,
        familyStructure,
        setFamilyStructure,
        childName,
        setChildName,
        childAge,
        setChildAge,
        usedDonorEgg,
        setUsedDonorEgg,
        usedDonorSperm,
        setUsedDonorSperm,
        usedDonorEmbryo,
        setUsedDonorEmbryo,
        usedSurrogate,
        setUsedSurrogate,
        isPreviewOpen,
        openPreview,
        closePreview,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        cartItems,
        addToCart,
        removeFromCart,
        cartTotal,
        cartCount,
        saveDraft,
        savedDrafts,
        loadDraft,
        deleteDraft,
        loadingSavedDrafts,
        fetchSavedDrafts,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBookContext = (): BookContextType => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error("useBookContext must be used within a BookProvider");
  }
  return context;
};
