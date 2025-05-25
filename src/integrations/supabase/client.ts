
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://yohlethqxunrvrqkjjsh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvaGxldGhxeHVucnZycWtqanNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NzAwMTEsImV4cCI6MjA2MjU0NjAxMX0.krRX1jHct8wVOLm-RrKMTHI5Vt0LcY96ebUSzWKhr70";

/**
 * Fetches the Clerk JWT for the current session with the "supabase" template.
 * This JWT will be used by Supabase RLS policies to identify the user.
 */
const fetchClerkToken = async (): Promise<string | null> => {
  if (typeof window === "undefined") return null;
  
  try {
    const clerk = (window as any).Clerk;
    if (!clerk?.session?.getToken) {
      console.log("Clerk session or getToken not available");
      return null;
    }
    
    const token = await clerk.session.getToken({ template: "supabase" });
    if (token) {
      console.log("Successfully fetched Clerk JWT token for Supabase");
    } else {
      console.log("No Clerk JWT token received");
    }
    return token;
  } catch (err) {
    console.error("Error fetching Clerk token:", err);
    return null;
  }
};

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    global: {
      headers: {
        // Set a custom header to help with debugging
        'X-Client-Info': 'clerk-integration'
      }
    },
    auth: {
      // Disable Supabase's built-in auth since we're using Clerk
      persistSession: false,
      detectSessionInUrl: false,
      autoRefreshToken: false,
    },
    // Custom access token function that fetches from Clerk
    accessToken: fetchClerkToken,
  },
);
