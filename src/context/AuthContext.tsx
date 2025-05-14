import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  useAuth as useClerkAuth, 
  useUser, 
  useSignIn, 
  useSignUp,
  useClerk
} from "@clerk/clerk-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { clerkToSupabaseId } from "@/lib/utils";

interface AuthContextType {
  session: any | null;
  user: any | null;
  userId: string | null;
  loading: boolean;
  isLoaded: boolean;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded: isAuthLoaded, isSignedIn } = useClerkAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { signIn: clerkSignIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp: clerkSignUp, isLoaded: isSignUpLoaded } = useSignUp();
  const clerk = useClerk();
  
  // State to track if components should re-render after auth changes
  const [authInitialized, setAuthInitialized] = useState(false);

  // Determine if we're still loading auth data
  const loading = !isAuthLoaded || !isUserLoaded || !isSignInLoaded || !isSignUpLoaded;
  const isLoaded = isAuthLoaded && isUserLoaded && isSignInLoaded && isSignUpLoaded;
  
  // Get user ID safely
  const userId = isSignedIn && user ? user.id : null;

  // Effect to handle auth state changes and force re-renders
  useEffect(() => {
    if (isLoaded) {
      setAuthInitialized(true);
      console.log("Auth initialized, signed in:", isSignedIn);
      
      // If user is signed in, ensure their profile exists in Supabase
      if (isSignedIn && user) {
        ensureProfileExists(user);
      }
    }
  }, [isLoaded, isSignedIn, user]);

  // Ensure user profile exists in Supabase
  const ensureProfileExists = async (user: any) => {
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

  const handleSignUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => {
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

  const handleSignIn = async (email: string, password: string) => {
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

  const handleSignInWithGoogle = async () => {
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

  const handleSignOut = async () => {
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

  const value = {
    session: isSignedIn ? { user } : null,
    user: isSignedIn ? user : null,
    userId: userId,
    loading,
    isLoaded,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    signInWithGoogle: handleSignInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
