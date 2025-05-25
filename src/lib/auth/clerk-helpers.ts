
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { clerkToSupabaseId } from "@/lib/utils";

/**
 * Ensures that a user profile exists in Supabase after authentication with Clerk
 * and keeps profile data synchronized between the two systems
 */
export const ensureProfileExists = async (user: any) => {
  if (!user) {
    console.error("No user provided to ensureProfileExists");
    return null;
  }
  
  try {
    const clerkId = user.id;
    let supabaseId: string;
    
    try {
      supabaseId = clerkToSupabaseId(clerkId);
    } catch (error) {
      console.error("Failed to convert Clerk ID to Supabase UUID:", error);
      toast.error("Error with user identification. Please try logging out and back in.");
      return null;
    }
    
    // Get primary email address from the user object
    const primaryEmail = user.emailAddresses?.find((email: any) => 
      email.id === user.primaryEmailAddressId
    )?.emailAddress || user.email || null;
    
    // Get avatar URL from Clerk
    const avatarUrl = user.imageUrl || null;
    
    console.log("Ensuring profile exists:", { 
      clerkId, 
      supabaseId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: primaryEmail,
      avatarUrl
    });
    
    // First check if profile exists by clerk_id (more reliable than UUID)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, email, clerk_id, updated_at')
      .eq('clerk_id', clerkId)
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') {
      console.error("Error checking profile by clerk_id:", error);
      return null;
    }
    
    const firstName = user.firstName || null;
    const lastName = user.lastName || null;
    
    // If profile doesn't exist, create it
    if (!data) {
      console.log("Profile not found. Creating new profile with Clerk ID:", clerkId);
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: supabaseId,
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
          email: primaryEmail,
          clerk_id: clerkId,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (createError) {
        console.error("Failed to create profile:", createError);
        
        // Check if it's a UUID format error
        if (createError.message?.includes('invalid input syntax for type uuid')) {
          console.error("UUID conversion failed for Clerk ID:", clerkId);
          toast.error("Error creating your profile. Please contact support.");
        } else {
          toast.error("Failed to set up your profile. Please try logging out and back in.");
        }
        return null;
      } else {
        console.log("Profile created successfully");
        return newProfile;
      }
    } 
    // If profile exists but data is different, synchronize it
    else if (
      data.first_name !== firstName || 
      data.last_name !== lastName || 
      data.avatar_url !== avatarUrl ||
      data.email !== primaryEmail
    ) {
      console.log("Synchronizing profile data:", { 
        current: data,
        new: { firstName, lastName, avatarUrl, email: primaryEmail }
      });
      
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
          email: primaryEmail,
          updated_at: new Date().toISOString()
        })
        .eq('clerk_id', clerkId)
        .select()
        .single();
        
      if (updateError) {
        console.error("Failed to update profile:", updateError);
        return data;
      } else {
        console.log("Profile synchronized successfully");
        return updatedProfile;
      }
    } else {
      console.log("User profile exists and is up to date:", data);
      return data;
    }
  } catch (error) {
    console.error("Error in profile check:", error);
    toast.error("There was a problem with your profile. Please try logging out and back in.");
    return null;
  }
};

/**
 * Syncs profile data from Supabase to Clerk
 * Call this when profile data is updated in Supabase outside of Clerk
 */
export const syncProfileToClerk = async (user: any, profileData: any) => {
  if (!user || !profileData) return false;
  
  try {
    // Check if Clerk data needs updating
    const needsUpdate = 
      user.firstName !== profileData.first_name || 
      user.lastName !== profileData.last_name;
      
    if (needsUpdate) {
      console.log("Syncing Supabase profile data to Clerk");
      await user.update({
        firstName: profileData.first_name || undefined,
        lastName: profileData.last_name || undefined,
      });
      console.log("Clerk profile updated successfully");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error syncing profile to Clerk:", error);
    return false;
  }
};

/**
 * Safely gets a Supabase ID from a Clerk user 
 * with built-in error handling
 */
export const getSafeSupabaseId = (clerkId: string): string | null => {
  if (!clerkId) {
    console.error("Missing Clerk ID in getSafeSupabaseId");
    return null;
  }
  
  try {
    return clerkToSupabaseId(clerkId);
  } catch (error) {
    console.error("Failed to convert Clerk ID to Supabase ID:", error);
    toast.error("Error with user identification. Please refresh the page.");
    return null;
  }
};
