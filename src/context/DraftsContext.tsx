
import React, { createContext, useContext, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SavedDraft, ConceptionType, FamilyStructure } from "@/types/bookTypes";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface DraftsContextProps {
  savedDrafts: SavedDraft[];
  loadingSavedDrafts: boolean;
  saveDraft: (
    title: string | undefined,
    bookData: {
      conceptionType: ConceptionType;
      familyStructure: FamilyStructure;
      childName: string;
      childAge: string;
      usedDonorEgg: boolean;
      usedDonorSperm: boolean;
      usedDonorEmbryo: boolean;
      usedSurrogate: boolean;
    }
  ) => Promise<void>;
  loadDraft: (draft: SavedDraft) => void;
  deleteDraft: (draftId: string) => Promise<void>;
  fetchSavedDrafts: () => Promise<void>;
}

const DraftsContext = createContext<DraftsContextProps | undefined>(undefined);

export const DraftsProvider: React.FC<{ 
  children: React.ReactNode;
  onLoadDraft: (draft: SavedDraft) => void;
}> = ({ children, onLoadDraft }) => {
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>([]);
  const [loadingSavedDrafts, setLoadingSavedDrafts] = useState(false);
  const { user } = useAuth();

  // Save book draft to Supabase
  const saveDraft = async (
    title: string | undefined,
    bookData: {
      conceptionType: ConceptionType;
      familyStructure: FamilyStructure;
      childName: string;
      childAge: string;
      usedDonorEgg: boolean;
      usedDonorSperm: boolean;
      usedDonorEmbryo: boolean;
      usedSurrogate: boolean;
    }
  ): Promise<void> => {
    if (!user) {
      toast.error("Please sign in to save drafts");
      return;
    }
    
    try {
      const draftTitle = title || (bookData.childName ? `${bookData.childName}'s Story` : "Untitled Draft");
      
      const { data, error } = await supabase
        .from('saved_drafts')
        .insert({
          user_id: user.id,
          title: draftTitle,
          conception_type: bookData.conceptionType,
          family_structure: bookData.familyStructure,
          child_name: bookData.childName || null,
          child_age: bookData.childAge || null,
          used_donor_egg: bookData.usedDonorEgg,
          used_donor_sperm: bookData.usedDonorSperm,
          used_donor_embryo: bookData.usedDonorEmbryo,
          used_surrogate: bookData.usedSurrogate
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success("Draft saved successfully");
      
      // Update local state
      fetchSavedDrafts();
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
    onLoadDraft(draft);
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

  return (
    <DraftsContext.Provider
      value={{
        savedDrafts,
        loadingSavedDrafts,
        saveDraft,
        loadDraft,
        deleteDraft,
        fetchSavedDrafts
      }}
    >
      {children}
    </DraftsContext.Provider>
  );
};

export const useDrafts = (): DraftsContextProps => {
  const context = useContext(DraftsContext);
  if (context === undefined) {
    throw new Error("useDrafts must be used within a DraftsProvider");
  }
  return context;
};
