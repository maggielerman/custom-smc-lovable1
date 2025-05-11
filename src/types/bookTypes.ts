
import { Json } from "@/integrations/supabase/types";

export type ConceptionType = 'iui' | 'ivf' | 'donor-egg' | 'donor-sperm' | 'donor-embryo';
export type FamilyStructure = 'hetero-couple' | 'single-mom' | 'single-dad' | 'two-moms' | 'two-dads';

export interface CartItem {
  id: string;
  title: string;
  price: number;
}

export interface SavedDraft {
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

export interface BookCustomizationState {
  conceptionType: ConceptionType;
  familyStructure: FamilyStructure;
  childName: string;
  childAge: string;
  usedDonorEgg: boolean;
  usedDonorSperm: boolean;
  usedDonorEmbryo: boolean;
  usedSurrogate: boolean;
  isPreviewOpen: boolean;
  isCheckoutOpen: boolean;
}
