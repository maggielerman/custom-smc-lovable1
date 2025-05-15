
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  useAuth as useClerkAuth, 
  useUser, 
  useClerk
} from "@clerk/clerk-react";
import { toast } from "sonner";
import { AuthContextType } from "@/lib/auth/types";
import { ensureProfileExists } from "@/lib/auth/clerk-helpers";
import { updateSupabaseAuthWithClerkSession } from "@/integrations/supabase/client";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded: isAuthLoaded, isSignedIn, getToken } = useClerkAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const clerk = useClerk();
  
  // State to track if components should re-render after auth changes
  const [authInitialized, setAuthInitialized] = useState(false);

  // Determine if we're still loading auth data
  const loading = !isAuthLoaded || !isUserLoaded;
  const isLoaded = isAuthLoaded && isUserLoaded;
  
  // Get user ID safely
  const userId = isSignedIn && user ? user.id : null;

  // Effect to sync Clerk session with Supabase
  useEffect(() => {
    const syncAuthState = async () => {
      if (isLoaded) {
        if (isSignedIn && user) {
          try {
            // Get JWT token from Clerk
            const token = await getToken({ template: "supabase" });
            // Update Supabase auth with the Clerk JWT
            await updateSupabaseAuthWithClerkSession(token);
            console.log("Supabase auth updated with Clerk session");
          } catch (error) {
            console.error("Failed to sync Clerk session with Supabase:", error);
          }
        } else {
          // Clear Supabase session when signed out
          await updateSupabaseAuthWithClerkSession(null);
          console.log("Cleared Supabase auth session");
        }
      }
    };

    syncAuthState();
  }, [isLoaded, isSignedIn, user, getToken]);

  // Effect to handle auth state changes and force re-renders
  useEffect(() => {
    if (isLoaded) {
      setAuthInitialized(true);
      console.log("Auth initialized, signed in:", isSignedIn);
      
      // If user is signed in, ensure their profile exists in Supabase
      if (isSignedIn && user) {
        // Add some delay to ensure Clerk has fully processed the authentication
        setTimeout(() => {
          console.log("Ensuring profile exists for user:", user.id);
          ensureProfileExists(user)
            .catch(err => {
              console.error("Failed to ensure profile exists:", err);
              toast.error("There was a problem with your profile. Please try logging out and back in.");
            });
        }, 1000); // Increased delay for better reliability
      }
    }
  }, [isLoaded, isSignedIn, user]);

  // Since we're using Clerk components, we don't need explicit functions for signUp, signIn
  // We only need signOut which might be called from nav/account areas
  const value = {
    session: isSignedIn ? { user } : null,
    user: isSignedIn ? user : null,
    userId: userId,
    loading,
    isLoaded,
    // Pass the getToken method from Clerk's useAuth hook
    getToken,
    signUp: async () => {
      toast.error("Please use the sign up form");
    },
    signIn: async () => {
      toast.error("Please use the sign in form");
    },
    signOut: async () => {
      try {
        await clerk.signOut();
        toast.info("You have been signed out");
      } catch (error: any) {
        console.error("AuthContext: Sign out error", error);
        toast.error(error.message || "Failed to sign out");
        throw error;
      }
    },
    signInWithGoogle: async () => {
      toast.error("Please use the sign in form");
    },
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
