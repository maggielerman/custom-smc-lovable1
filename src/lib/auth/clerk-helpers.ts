
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

/**
 * Handle user registration
 */
export const handleSignUp = async (
  clerkSignUp: any, 
  clerkSignIn: any,
  clerk: any,
  email: string, 
  password: string, 
  metadata?: { first_name?: string; last_name?: string }
) => {
  try {
    console.log("AuthContext: Attempting to sign up", { email });
    
    await clerkSignUp.create({
      emailAddress: email,
      password,
      firstName: metadata?.first_name || undefined,
      lastName: metadata?.last_name || undefined
    });
    
    // Check signup status
    if (clerkSignUp.status === 'complete') {
      toast.success("Registration successful! You can now sign in.");
      
      // If sign up is complete, try to sign in immediately
      try {
        await clerkSignIn.create({
          identifier: email,
          password,
        });
        
        if (clerkSignIn.status === 'complete') {
          await clerk.setActive({ session: clerkSignIn.createdSessionId });
          console.log("Auto sign-in successful after registration");
          toast.success("You have been automatically signed in");
        }
      } catch (signInError) {
        console.error("Failed to auto sign in after registration", signInError);
      }
    } else if (clerkSignUp.status === 'missing_requirements' || clerkSignUp.status === 'abandoned') {
      // Email verification might be required, or other requirements
      toast.success("Registration successful! Check your email to confirm your account.");
    } else {
      toast.success("Registration successful! Please proceed to sign in.");
    }
    
  } catch (error: any) {
    console.error("AuthContext: Sign up error", error);
    toast.error(error.errors?.[0]?.message || "An error occurred during signup");
    throw error;
  }
};

/**
 * Handle user sign in with email/password
 */
export const handleSignIn = async (
  clerkSignIn: any,
  clerk: any,
  email: string, 
  password: string
) => {
  try {
    console.log("AuthContext: Attempting to sign in", { email });
    
    await clerkSignIn.create({
      identifier: email,
      password,
    });
    
    if (clerkSignIn.status === 'complete') {
      console.log("AuthContext: Sign in successful, setting active session");
      // Ensure the session is activated
      await clerk.setActive({ session: clerkSignIn.createdSessionId });
      toast.success("Successfully signed in");
    }
    
  } catch (error: any) {
    console.error("AuthContext: Sign in error", error);
    toast.error(error.errors?.[0]?.message || "Failed to sign in");
    throw error;
  }
};

/**
 * Handle sign in with Google
 */
export const handleSignInWithGoogle = async (clerkSignIn: any) => {
  try {
    console.log("AuthContext: Attempting to sign in with Google");
    
    // Use the current URL's origin instead of hardcoded value to ensure proper redirect
    const currentOrigin = window.location.origin;
    
    await clerkSignIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: `${currentOrigin}/auth?oauth_callback=true`,
      redirectUrlComplete: currentOrigin,
    });
    
    console.log("AuthContext: Google OAuth redirect initiated");
  } catch (error: any) {
    console.error("AuthContext: Google sign in error", error);
    toast.error(error.errors?.[0]?.message || "Failed to sign in with Google");
    throw error;
  }
};

/**
 * Handle user sign out
 */
export const handleSignOut = async (clerk: any) => {
  try {
    console.log("AuthContext: Attempting to sign out");
    await clerk.signOut();
    console.log("AuthContext: Sign out successful");
    toast.info("You have been signed out");
  } catch (error: any) {
    console.error("AuthContext: Sign out error", error);
    toast.error(error.message || "Failed to sign out");
    throw error;
  }
};
