
import React, { createContext, useContext, useState } from "react";

// Define types for our book customization
export type ConceptionType = 'iui' | 'ivf' | 'donor-egg' | 'donor-sperm' | 'donor-embryo';
export type FamilyStructure = 'hetero-couple' | 'single-mom' | 'single-dad' | 'two-moms' | 'two-dads';

interface CartItem {
  id: string;
  title: string;
  price: number;
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
    }
  };
  
  const removeFromCart = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
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
