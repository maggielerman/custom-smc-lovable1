
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
  if (!clerkId) {
    console.error("Missing Clerk ID");
    return '00000000-0000-0000-0000-000000000000';
  }
  
  // Generate a deterministic v5 UUID based on the Clerk ID and our namespace
  try {
    // Remove any non-alphanumeric characters to ensure consistent input
    const normalizedId = clerkId.replace(/[^a-zA-Z0-9]/g, '');
    const uuid = uuidv5(normalizedId, CLERK_NAMESPACE);
    console.log(`Converted Clerk ID ${clerkId} to Supabase UUID ${uuid}`);
    return uuid;
  } catch (error) {
    console.error("Failed to generate UUID from Clerk ID:", error);
    // Fallback to a default UUID (not ideal, but prevents crashes)
    return '00000000-0000-0000-0000-000000000000';
  }
}
