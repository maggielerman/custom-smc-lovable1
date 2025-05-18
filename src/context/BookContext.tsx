
import React, { createContext, useContext, useEffect } from "react";
import { BookCustomizationProvider, useBookCustomization } from "./BookCustomizationContext";
import { CartProvider, useCart } from "./CartContext";
import { DraftsProvider, useDrafts } from "./DraftsContext";
import { SavedDraft } from "@/types/bookTypes";
import { useAuth } from "./AuthContext";

// Create a combined context type that includes all our book-related contexts
interface BookContextType {
  // BookCustomization properties
  conceptionType: ReturnType<typeof useBookCustomization>["conceptionType"];
  setConceptionType: ReturnType<typeof useBookCustomization>["setConceptionType"];
  familyStructure: ReturnType<typeof useBookCustomization>["familyStructure"];
  setFamilyStructure: ReturnType<typeof useBookCustomization>["setFamilyStructure"];
  childName: ReturnType<typeof useBookCustomization>["childName"];
  setChildName: ReturnType<typeof useBookCustomization>["setChildName"];
  childAge: ReturnType<typeof useBookCustomization>["childAge"];
  setChildAge: ReturnType<typeof useBookCustomization>["setChildAge"];
  usedDonorEgg: ReturnType<typeof useBookCustomization>["usedDonorEgg"];
  setUsedDonorEgg: ReturnType<typeof useBookCustomization>["setUsedDonorEgg"];
  usedDonorSperm: ReturnType<typeof useBookCustomization>["usedDonorSperm"];
  setUsedDonorSperm: ReturnType<typeof useBookCustomization>["setUsedDonorSperm"];
  usedDonorEmbryo: ReturnType<typeof useBookCustomization>["usedDonorEmbryo"];
  setUsedDonorEmbryo: ReturnType<typeof useBookCustomization>["setUsedDonorEmbryo"];
  usedSurrogate: ReturnType<typeof useBookCustomization>["usedSurrogate"];
  setUsedSurrogate: ReturnType<typeof useBookCustomization>["setUsedSurrogate"];
  isPreviewOpen: ReturnType<typeof useBookCustomization>["isPreviewOpen"];
  openPreview: ReturnType<typeof useBookCustomization>["openPreview"];
  closePreview: ReturnType<typeof useBookCustomization>["closePreview"];
  isCheckoutOpen: ReturnType<typeof useBookCustomization>["isCheckoutOpen"];
  openCheckout: ReturnType<typeof useBookCustomization>["openCheckout"];
  closeCheckout: ReturnType<typeof useBookCustomization>["closeCheckout"];
  
  // Cart properties
  cartItems: ReturnType<typeof useCart>["cartItems"];
  addToCart: ReturnType<typeof useCart>["addToCart"];
  removeFromCart: ReturnType<typeof useCart>["removeFromCart"];
  cartTotal: ReturnType<typeof useCart>["cartTotal"];
  cartCount: ReturnType<typeof useCart>["cartCount"];
  
  // Drafts properties
  savedDrafts: ReturnType<typeof useDrafts>["savedDrafts"];
  loadingSavedDrafts: ReturnType<typeof useDrafts>["loadingSavedDrafts"];
  saveDraft: (title?: string) => Promise<void>;
  loadDraft: ReturnType<typeof useDrafts>["loadDraft"];
  deleteDraft: ReturnType<typeof useDrafts>["deleteDraft"];
  fetchSavedDrafts: ReturnType<typeof useDrafts>["fetchSavedDrafts"];
}

// Combined context component that provides a unified API
const BookContextProvider = ({ children }: { children: React.ReactNode }) => {
  const bookCustomization = useBookCustomization();
  const cart = useCart();
  const drafts = useDrafts();
  const { user } = useAuth();
  
  // Fetch saved drafts when user logs in
  useEffect(() => {
    if (user) {
      drafts.fetchSavedDrafts();
    }
  }, [user, drafts]);
  
  // Create a wrapper for saveDraft to match the old API
  const saveDraft = (title?: string): Promise<void> => {
    return drafts.saveDraft(title, {
      conceptionType: bookCustomization.conceptionType,
      familyStructure: bookCustomization.familyStructure,
      childName: bookCustomization.childName,
      childAge: bookCustomization.childAge,
      usedDonorEgg: bookCustomization.usedDonorEgg,
      usedDonorSperm: bookCustomization.usedDonorSperm,
      usedDonorEmbryo: bookCustomization.usedDonorEmbryo,
      usedSurrogate: bookCustomization.usedSurrogate
    });
  };
  
  // Handle loading a draft by updating the book customization state
  const handleLoadDraft = (draft: SavedDraft) => {
    bookCustomization.setConceptionType(draft.conception_type as ReturnType<typeof useBookCustomization>["conceptionType"]);
    bookCustomization.setFamilyStructure(draft.family_structure as ReturnType<typeof useBookCustomization>["familyStructure"]);
    bookCustomization.setChildName(draft.child_name || "");
    bookCustomization.setChildAge(draft.child_age || "3-5");
    bookCustomization.setUsedDonorEgg(draft.used_donor_egg);
    bookCustomization.setUsedDonorSperm(draft.used_donor_sperm);
    bookCustomization.setUsedDonorEmbryo(draft.used_donor_embryo);
    bookCustomization.setUsedSurrogate(draft.used_surrogate);
  };
  
  const contextValue: BookContextType = {
    // Book customization properties
    conceptionType: bookCustomization.conceptionType,
    setConceptionType: bookCustomization.setConceptionType,
    familyStructure: bookCustomization.familyStructure,
    setFamilyStructure: bookCustomization.setFamilyStructure,
    childName: bookCustomization.childName,
    setChildName: bookCustomization.setChildName,
    childAge: bookCustomization.childAge,
    setChildAge: bookCustomization.setChildAge,
    usedDonorEgg: bookCustomization.usedDonorEgg,
    setUsedDonorEgg: bookCustomization.setUsedDonorEgg,
    usedDonorSperm: bookCustomization.usedDonorSperm,
    setUsedDonorSperm: bookCustomization.setUsedDonorSperm,
    usedDonorEmbryo: bookCustomization.usedDonorEmbryo,
    setUsedDonorEmbryo: bookCustomization.setUsedDonorEmbryo,
    usedSurrogate: bookCustomization.usedSurrogate,
    setUsedSurrogate: bookCustomization.setUsedSurrogate,
    isPreviewOpen: bookCustomization.isPreviewOpen,
    openPreview: bookCustomization.openPreview,
    closePreview: bookCustomization.closePreview,
    isCheckoutOpen: bookCustomization.isCheckoutOpen,
    openCheckout: bookCustomization.openCheckout,
    closeCheckout: bookCustomization.closeCheckout,
    
    // Cart properties
    cartItems: cart.cartItems,
    addToCart: cart.addToCart,
    removeFromCart: cart.removeFromCart,
    cartTotal: cart.cartTotal,
    cartCount: cart.cartCount,
    
    // Drafts properties
    savedDrafts: drafts.savedDrafts,
    loadingSavedDrafts: drafts.loadingSavedDrafts,
    saveDraft,
    loadDraft: drafts.loadDraft,
    deleteDraft: drafts.deleteDraft,
    fetchSavedDrafts: drafts.fetchSavedDrafts,
  };
  
  return (
    <>
      {React.Children.map(children, child => {
        return React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, contextValue as any)
          : child;
      })}
    </>
  );
};

// Combined BookProvider component
export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BookCustomizationProvider>
      <CartProvider>
        <DraftsProvider onLoadDraft={draft => {}}>
          <BookContextProvider>{children}</BookContextProvider>
        </DraftsProvider>
      </CartProvider>
    </BookCustomizationProvider>
  );
};

// Export the useBookContext hook with the combined type
export const useBookContext = (): BookContextType => {
  const bookCustomization = useBookCustomization();
  const cart = useCart();
  const drafts = useDrafts();
  
  // Create a wrapper for saveDraft to match the old API
  const saveDraft = (title?: string): Promise<void> => {
    return drafts.saveDraft(title, {
      conceptionType: bookCustomization.conceptionType,
      familyStructure: bookCustomization.familyStructure,
      childName: bookCustomization.childName,
      childAge: bookCustomization.childAge,
      usedDonorEgg: bookCustomization.usedDonorEgg,
      usedDonorSperm: bookCustomization.usedDonorSperm,
      usedDonorEmbryo: bookCustomization.usedDonorEmbryo,
      usedSurrogate: bookCustomization.usedSurrogate
    });
  };
  
  return {
    // Book customization properties
    conceptionType: bookCustomization.conceptionType,
    setConceptionType: bookCustomization.setConceptionType,
    familyStructure: bookCustomization.familyStructure,
    setFamilyStructure: bookCustomization.setFamilyStructure,
    childName: bookCustomization.childName,
    setChildName: bookCustomization.setChildName,
    childAge: bookCustomization.childAge,
    setChildAge: bookCustomization.setChildAge,
    usedDonorEgg: bookCustomization.usedDonorEgg,
    setUsedDonorEgg: bookCustomization.setUsedDonorEgg,
    usedDonorSperm: bookCustomization.usedDonorSperm,
    setUsedDonorSperm: bookCustomization.setUsedDonorSperm,
    usedDonorEmbryo: bookCustomization.usedDonorEmbryo,
    setUsedDonorEmbryo: bookCustomization.setUsedDonorEmbryo,
    usedSurrogate: bookCustomization.usedSurrogate,
    setUsedSurrogate: bookCustomization.setUsedSurrogate,
    isPreviewOpen: bookCustomization.isPreviewOpen,
    openPreview: bookCustomization.openPreview,
    closePreview: bookCustomization.closePreview,
    isCheckoutOpen: bookCustomization.isCheckoutOpen,
    openCheckout: bookCustomization.openCheckout,
    closeCheckout: bookCustomization.closeCheckout,
    
    // Cart properties
    cartItems: cart.cartItems,
    addToCart: cart.addToCart,
    removeFromCart: cart.removeFromCart,
    cartTotal: cart.cartTotal,
    cartCount: cart.cartCount,
    
    // Drafts properties
    savedDrafts: drafts.savedDrafts,
    loadingSavedDrafts: drafts.loadingSavedDrafts,
    saveDraft,
    loadDraft: drafts.loadDraft,
    deleteDraft: drafts.deleteDraft,
    fetchSavedDrafts: drafts.fetchSavedDrafts,
  };
};

// Export the types for reuse
export type { ConceptionType, FamilyStructure } from "@/types/bookTypes";
