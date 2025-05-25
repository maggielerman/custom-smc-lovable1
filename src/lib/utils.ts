
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { v5 as uuidv5 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a Clerk user ID to a deterministic UUID for Supabase
 * This ensures consistent mapping between Clerk and Supabase user IDs
 */
export function clerkToSupabaseId(clerkId: string): string {
  if (!clerkId) {
    throw new Error('Clerk ID is required');
  }
  
  // Use a fixed namespace UUID for consistent results
  const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
  
  try {
    const supabaseId = uuidv5(clerkId, namespace);
    console.log(`Converting Clerk ID ${clerkId} to Supabase ID ${supabaseId}`);
    return supabaseId;
  } catch (error) {
    console.error('Failed to convert Clerk ID to Supabase ID:', error);
    throw new Error(`Failed to convert Clerk ID: ${clerkId}`);
  }
}
