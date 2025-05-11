
import React, { createContext, useContext, useState } from "react";
import { ConceptionType, FamilyStructure } from "@/types/bookTypes";

interface BookCustomizationContextType {
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
  
  // Checkout state
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
}

const BookCustomizationContext = createContext<BookCustomizationContextType | undefined>(undefined);

export const BookCustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  
  const openPreview = () => setIsPreviewOpen(true);
  const closePreview = () => setIsPreviewOpen(false);
  
  const openCheckout = () => setIsCheckoutOpen(true);
  const closeCheckout = () => setIsCheckoutOpen(false);

  return (
    <BookCustomizationContext.Provider
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
        closeCheckout
      }}
    >
      {children}
    </BookCustomizationContext.Provider>
  );
};

export const useBookCustomization = (): BookCustomizationContextType => {
  const context = useContext(BookCustomizationContext);
  if (context === undefined) {
    throw new Error("useBookCustomization must be used within a BookCustomizationProvider");
  }
  return context;
};
