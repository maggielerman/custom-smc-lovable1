
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v5 as uuidv5 } from "uuid";

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// UUID namespace for Clerk IDs (randomly generated UUID)
const CLERK_NAMESPACE = "f0e7d856-1081-4e5c-bc60-a52601464d98";

/**
 * Converts a Clerk user ID to a valid UUID format for Supabase
 * Uses UUID v5 to deterministically generate a UUID based on the Clerk ID
 * This ensures the same Clerk ID always maps to the same Supabase UUID
 */
export function clerkToSupabaseId(clerkId: string): string {
  if (!clerkId) return '';
  
  // Generate a deterministic v5 UUID based on the Clerk ID and our namespace
  try {
    // Create a UUID v5 using the clerkId as name and our namespace
    return uuidv5(clerkId, CLERK_NAMESPACE);
  } catch (error) {
    console.error("Failed to generate UUID from Clerk ID:", error);
    // Fallback to a default UUID (not ideal, but prevents crashes)
    return '00000000-0000-0000-0000-000000000000';
  }
}
