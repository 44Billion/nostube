import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { NostrEvent } from '@nostrify/nostrify';
import { mergeRelays } from '@/lib/utils';
import { presetRelays } from '@/App';

interface RelayInfo {
  url: string;
  read: boolean;
  write: boolean;
}

/**
 * Hook to read a user's NIP-65 relay list metadata.
 * @param pubkey The public key of the user.
 * @returns A query result containing the user's relay list.
 */
export function useUserRelays(pubkey: string | undefined) {
  const { nostr } = useNostr();

  return useQuery<RelayInfo[]>({
    queryKey: ['user-relays', pubkey],
    queryFn: async ({ signal }) => {
      if (!pubkey) return [];

      const events = await nostr.query(
        [
          {
            kinds: [10002],
            authors: [pubkey],
            limit: 1,
          },
        ],
        { signal, relays: mergeRelays([['wss://purplepag.es'], presetRelays.map(r => r.url)]) }
      );

      if (events.length === 0) return [];

      const relayListEvent: NostrEvent = events[0];
      const relays: RelayInfo[] = [];

      for (const tag of relayListEvent.tags) {
        if (tag[0] === 'r' && tag[1]) {
          const url = tag[1];
          const read = tag[2] === 'read' || tag[2] === undefined; // Default to read if no marker
          const write = tag[2] === 'write' || tag[2] === undefined; // Default to write if no marker
          relays.push({ url, read, write });
        }
      }

      return relays;
    },
    enabled: !!pubkey,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
}
