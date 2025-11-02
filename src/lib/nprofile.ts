import { nip19 } from 'nostr-tools'
import { getSeenRelays } from 'applesauce-core/helpers/relays'
import type { NostrEvent } from 'nostr-tools'

/**
 * Generate an nprofile with relay hints from an event
 * Uses the relays where the event was seen, or falls back to provided relays
 */
export function nprofileFromEvent(
  pubkey: string,
  event?: NostrEvent,
  fallbackRelays: string[] = []
): string {
  const seenRelays = event ? getSeenRelays(event) : undefined
  const relays = seenRelays ? Array.from(seenRelays) : fallbackRelays

  return nip19.nprofileEncode({
    pubkey,
    relays: relays.slice(0, 5), // Limit to 5 relays to keep URL reasonable
  })
}

/**
 * Generate an nprofile with specific relays
 */
export function nprofileFromPubkey(pubkey: string, relays: string[] = []): string {
  return nip19.nprofileEncode({
    pubkey,
    relays: relays.slice(0, 5), // Limit to 5 relays to keep URL reasonable
  })
}
