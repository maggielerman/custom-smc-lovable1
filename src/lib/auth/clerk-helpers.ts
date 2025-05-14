
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { clerkToSupabaseId } from "@/lib/utils";

/**
 * Ensures that a user profile exists in Supabase after authentication with Clerk
 * and keeps profile data synchronized between the two systems
 */
export const ensureProfileExists = async (user: any) => {
  if (!user) return;
  
  try {
    const clerkId = user.id;
    const supabaseId = clerkToSupabaseId(clerkId);
    
    console.log("Checking profile:", { 
      clerkId, 
      supabaseId,
      firstName: user.firstName,
      lastName: user.lastName
    });
    
    // First check if profile exists
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, updated_at')
      .eq('id', supabaseId)
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') {
      console.error("Error checking profile:", error);
      return;
    }
    
    const firstName = user.firstName || null;
    const lastName = user.lastName || null;
    const avatarUrl = user.imageUrl || null;
    
    // If profile doesn't exist, create it
    if (!data) {
      console.log("Creating new profile with ID:", supabaseId);
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: supabaseId,
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        });
        
      if (createError) {
        console.error("Failed to create profile:", createError);
        toast.error("Failed to set up your profile. Please try logging out and back in.");
      } else {
        console.log("Profile created successfully");
        toast.success("Profile set up successfully");
      }
    } 
    // If profile exists but data is different, synchronize it
    else if (
      data.first_name !== firstName || 
      data.last_name !== lastName || 
      data.avatar_url !== avatarUrl
    ) {
      console.log("Synchronizing profile data:", { 
        current: data,
        new: { firstName, lastName, avatarUrl }
      });
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', supabaseId);
        
      if (updateError) {
        console.error("Failed to update profile:", updateError);
      } else {
        console.log("Profile synchronized successfully");
      }
    } else {
      console.log("User profile exists and is up to date:", data);
    }
  } catch (error) {
    console.error("Error in profile check:", error);
    toast.error("There was a problem with your profile. Please try logging out and back in.");
  }
};

/**
 * Syncs profile data from Supabase to Clerk
 * Call this when profile data is updated in Supabase outside of Clerk
 */
export const syncProfileToClerk = async (user: any, profileData: any) => {
  if (!user || !profileData) return;
  
  try {
    // Check if Clerk data needs updating
    if (
      user.firstName !== profileData.first_name || 
      user.lastName !== profileData.last_name
    ) {
      console.log("Syncing Supabase profile data to Clerk");
      await user.update({
        firstName: profileData.first_name || undefined,
        lastName: profileData.last_name || undefined
      });
      console.log("Clerk profile updated successfully");
    }
  } catch (error) {
    console.error("Error syncing profile to Clerk:", error);
  }
};
