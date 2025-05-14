
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a Clerk user ID to a valid UUID format for Supabase
 * Clerk IDs are in the format "user_1234567890", which needs to be 
 * converted to a valid UUID format for Supabase
 */
export function clerkToSupabaseId(clerkId: string): string {
  if (!clerkId) return '';
  
  // Remove the "user_" prefix if present
  const idWithoutPrefix = clerkId.startsWith('user_') 
    ? clerkId.substring(5) 
    : clerkId;
  
  // Create a deterministic UUID based on the Clerk ID
  // This will consistently generate the same UUID for the same Clerk ID
  let uuid = '';
  
  // Standard UUID format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  // where y is 8, 9, a, or b
  
  // Use the Clerk ID to generate the first 8 characters
  const part1 = idWithoutPrefix.padEnd(8, '0').substring(0, 8);
  
  // Use the Clerk ID to generate the next 4 characters
  const part2 = idWithoutPrefix.padEnd(12, '0').substring(8, 12);
  
  // The variant "4" for the 13th character (UUID version 4)
  const part3 = '4' + idWithoutPrefix.padEnd(16, '0').substring(12, 15);
  
  // The variant character (8, 9, a, or b) followed by 3 more chars
  const variantChars = ['8', '9', 'a', 'b'];
  const variantChar = variantChars[Math.floor(idWithoutPrefix.length % 4)];
  const part4 = variantChar + idWithoutPrefix.padEnd(19, '0').substring(15, 18);
  
  // The final 12 characters
  const part5 = idWithoutPrefix.padEnd(30, '0').substring(18, 30);
  
  // Combine all parts into a standard UUID format
  uuid = `${part1}-${part2}-${part3}-${part4}-${part5}`;
  
  return uuid;
}
