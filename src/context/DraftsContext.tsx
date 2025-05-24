import React, { createContext, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SavedDraft, ConceptionType, FamilyStructure } from "@/types/bookTypes";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { clerkToSupabaseId } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  error: string | null;
}

const DraftsContext = createContext<DraftsContextProps | undefined>(undefined);

export const DraftsProvider: React.FC<{
  children: React.ReactNode;
  onLoadDraft: (draft: SavedDraft) => void;
}> = ({ children, onLoadDraft }) => {
  const [error, setError] = React.useState<string | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch saved drafts using React Query for caching
  const {
    data: savedDrafts = [],
    isLoading: loadingSavedDrafts,
    error: queryError,
    refetch: refetchDrafts
  } = useQuery<SavedDraft[], Error>({
    queryKey: ["savedDrafts", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const supabaseUserId = clerkToSupabaseId(user.id);
      const { data, error } = await supabase
        .from("saved_drafts")
        .select("*")
        .eq("user_id", supabaseUserId)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5
  });

  useEffect(() => {
    if (queryError) {
      setError(queryError.message);
    } else {
      setError(null);
    }
  }, [queryError]);

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
      
      // Convert Clerk ID to UUID format for Supabase
      const supabaseUserId = clerkToSupabaseId(user.id);
      console.log('Saving draft with user ID:', supabaseUserId);
      

      
      let attempt = 0;
      const maxAttempts = 2;
      let lastError: any = null;

      while (attempt < maxAttempts) {
        const { error } = await supabase
          .from('saved_drafts')
          .insert({
            user_id: supabaseUserId,
            title: draftTitle,
            conception_type: bookData.conceptionType,
            family_structure: bookData.familyStructure,
            child_name: bookData.childName || null,
            child_age: bookData.childAge || null,
            used_donor_egg: bookData.usedDonorEgg,
            used_donor_sperm: bookData.usedDonorSperm,
            used_donor_embryo: bookData.usedDonorEmbryo,
            used_surrogate: bookData.usedSurrogate
          });

        if (!error) {
          toast.success("Draft saved successfully");
          await queryClient.invalidateQueries({ queryKey: ["savedDrafts", user.id] });
          return;
        }

        lastError = error;
        console.error(`Error saving draft (attempt ${attempt + 1}):`, error);
        attempt += 1;

        if (attempt < maxAttempts) {
          await new Promise(res => setTimeout(res, 1000));
        }
      }

      if (lastError) {
        throw lastError;
      }
    } catch (error: any) {
      console.error('Error saving draft:', error);
      setError(error.message || "Error saving draft");
      toast.error(error.message || "Error saving draft");
    }
  };
  
  // Manual refetch helper so components can trigger an update
  const fetchSavedDrafts = async (): Promise<void> => {
    await refetchDrafts();
  };
  
  // Add useEffect to fetch drafts when user changes
  useEffect(() => {
    if (user) {
      console.log('User changed, fetching drafts for user:', user.id);
      fetchSavedDrafts().catch(error => {
        console.error('Error in fetch drafts effect:', error);
      });
    } else {
      console.log('No user available, clearing drafts');
      setError(null);
    }
  }, [fetchSavedDrafts, user]);
  
  // Load a saved draft
  const loadDraft = (draft: SavedDraft) => {
    console.log('Loading draft in DraftsContext:', draft);
    onLoadDraft(draft);
    toast.success(`Loaded draft: ${draft.title}`);
  };
  
  // Delete a saved draft
  const deleteDraft = async (draftId: string): Promise<void> => {
    if (!user) return;
    
    try {
      const supabaseUserId = clerkToSupabaseId(user.id);
      

      
      const { error } = await supabase
        .from('saved_drafts')
        .delete()
        .eq('id', draftId)
        .eq('user_id', supabaseUserId);
        
      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["savedDrafts", user.id] });

      toast.success("Draft deleted successfully");
    } catch (error: any) {
      console.error('Error deleting draft:', error);
      setError(error.message || "Error deleting draft");
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
        fetchSavedDrafts,
        error
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
