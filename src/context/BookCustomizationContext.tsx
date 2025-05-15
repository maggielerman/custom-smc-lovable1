
import React, { createContext, useContext, useState, useEffect } from "react";
import { ConceptionType, FamilyStructure } from "@/types/bookTypes";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { clerkToSupabaseId } from "@/lib/utils";

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  birthdate?: string;
}

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
  
  // Family members
  familyMembers: FamilyMember[];
  familyStory: string;
  
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
  const { userId } = useAuth();
  
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
  
  // Family members and story
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [familyStory, setFamilyStory] = useState("");
  
  // Preview state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Checkout state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const openPreview = () => setIsPreviewOpen(true);
  const closePreview = () => setIsPreviewOpen(false);
  
  const openCheckout = () => setIsCheckoutOpen(true);
  const closeCheckout = () => setIsCheckoutOpen(false);

  // Load family members and story when the user ID changes
  useEffect(() => {
    async function loadFamilyData() {
      if (!userId) return;

      try {
        const supabaseUserId = clerkToSupabaseId(userId);
        
        // Load family members
        const { data: membersData, error: membersError } = await supabase
          .from('family_members')
          .select('*')
          .eq('user_id', supabaseUserId);

        if (membersError) {
          console.error("Error loading family members:", membersError);
        } else {
          setFamilyMembers(membersData || []);
        }
        
        // Load family story
        const { data: storyData, error: storyError } = await supabase
          .from('family_stories')
          .select('story')
          .eq('user_id', supabaseUserId)
          .single();

        if (storyError) {
          if (storyError.code !== 'PGRST116') { // Not found error
            console.error("Error loading family story:", storyError);
          }
        } else if (storyData) {
          setFamilyStory(storyData.story);
        }
      } catch (error) {
        console.error("Exception loading family data:", error);
      }
    }

    loadFamilyData();
  }, [userId]);

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
        familyMembers,
        familyStory,
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
