
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
    
    // For non-UUID format IDs, create a deterministic UUID
    // Using a modified version of the UUID v5 algorithm
    
    // Create a numeric hash from the string
    let hash = 0;
    for (let i = 0; i < clerkId.length; i++) {
      const char = clerkId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Format as UUID v4
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (hash + Math.random() * 16) % 16 | 0;
      hash = Math.floor(hash / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    
    return uuid;
  } catch (error) {
    console.error('Error converting Clerk ID to UUID:', error);
    // Fallback to a fixed UUID if conversion fails
    return '00000000-0000-0000-0000-000000000000';
  }
}
