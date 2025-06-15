import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Takes a string[][] of relays sets and normalizes the url and return a unique list of relays
 */
export function mergeRelays(relaySets: string[][]): string[] {
  const normalizedRelays = new Set<string>();

  const normalizeRelayUrl = (url: string): string => {
    const trimmed = url.trim();
    if (!trimmed) return trimmed;
    
    if (trimmed.includes('://')) {
      return trimmed;
    }
    
    return `wss://${trimmed}`;
  };

  for (const set of relaySets) {
    for (const relayUrl of set) {
      normalizedRelays.add(normalizeRelayUrl(relayUrl));
    }
  }

  return Array.from(normalizedRelays);
} 