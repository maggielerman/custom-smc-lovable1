
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { clerkToSupabaseId } from "@/lib/utils";

/**
 * Ensures that a user profile exists in Supabase after authentication with Clerk
 */
export const ensureProfileExists = async (user: any) => {
  if (!user) return;
  
  try {
    const supabaseId = clerkToSupabaseId(user.id);
    console.log("Checking profile for:", { clerkId: user.id, supabaseId });
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', supabaseId)
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') {
      console.error("Error checking profile:", error);
      return;
    }
    
    // If profile doesn't exist, create it
    if (!data) {
      console.log("Creating profile for new user", supabaseId);
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: supabaseId,
          first_name: user.firstName || null,
          last_name: user.lastName || null,
          updated_at: new Date().toISOString()
        });
        
      if (createError) {
        console.error("Failed to create profile:", createError);
      } else {
        console.log("Profile created successfully");
      }
    } else {
      console.log("User profile exists:", data);
    }
  } catch (error) {
    console.error("Error in profile check:", error);
  }
};
