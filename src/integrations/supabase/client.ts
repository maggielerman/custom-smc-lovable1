import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
if (!SUPABASE_URL) throw new Error("Missing VITE_SUPABASE_URL");

const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
if (!SUPABASE_ANON_KEY) throw new Error("Missing VITE_SUPABASE_ANON_KEY");

/**
 * Fetches the Clerk JWT for the current session (template: "supabase").
 * Works only in the browser after Clerk has loaded.
 */
const fetchClerkToken = async (): Promise<string | null> => {
  if (typeof window === "undefined") return null;
  const clerk = (window as any).Clerk;
  try {
    return clerk?.session?.getToken
      ? await clerk.session.getToken({ template: "supabase" })
      : null;
  } catch (err) {
    console.error("Unable to fetch Clerk token", err);
    return null;
  }
};

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    accessToken: fetchClerkToken,
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
    },
  },
);
