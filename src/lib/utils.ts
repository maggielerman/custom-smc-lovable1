
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a Clerk user ID to a UUID format compatible with Supabase
 * Creates a deterministic UUID from any string input
 */
export function clerkToSupabaseId(clerkId: string): string {
  try {
    // If the ID is already a valid UUID, just return it
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clerkId)) {
      return clerkId;
    }
    
    // Create a numeric hash from the string
    let hash = 0;
    for (let i = 0; i < clerkId.length; i++) {
      hash = ((hash * 31) + clerkId.charCodeAt(i)) & 0xffffffff;
    }
    
    // Create a deterministic UUID using the hash
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c => {
      const val = (hash ^ (parseInt(c, 10) & 15)) % 16;
      return val.toString(16);
    });
  } catch (error) {
    console.error('Error converting Clerk ID to UUID:', error);
    // Fallback to a fixed UUID if conversion fails
    return '00000000-0000-0000-0000-000000000000';
  }
}
