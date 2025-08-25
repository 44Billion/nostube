import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Subject } from "rxjs";
import { finalize, takeUntil, tap } from "rxjs/operators";
import { processEvents } from '@/utils/video-event';
import { useReportedPubkeys } from '@/hooks/useReportedPubkeys';

import { TimelineLoader } from "applesauce-loaders/loaders";
import { storeEventInIDB } from "./core";

// Minimales Event - muss mit der processEvents Funktion kompatibel sein
export type NEvent = {
  id: string;
  kind: number;
  pubkey: string;
  created_at: number;
  content: string;
  tags: string[][];
  sig: string; // Required by processEvents
};

export function useInfiniteTimeline(loader?: TimelineLoader, readRelays: string[] = []) {
  const [events, setEvents] = useState<NEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const blockedPubkeys = useReportedPubkeys();


  // Abort-Signale pro „Page Load"
  const pageAbort$ = useRef(new Subject<void>());

  const loadMore = useCallback(() => {
    if (loading || exhausted || !loader) {
      console.log('loadMore: early return - loading:', loading, 'exhausted:', exhausted, 'loader:', !!loader);
      return;
    }
    setLoading(true);

    // The loader is a function that returns an observable
    const sub = loader()
      .pipe(
        takeUntil(pageAbort$.current), // cancel falls Komponente wechselt/unmountet
        tap(async (event) => {
          // Manuell in IDB speichern für zusätzliche Persistenz
          try {
            await storeEventInIDB(event);
          } catch (error) {
            console.warn('Failed to store event in IDB:', error);
          }
        }),
        finalize(() => setLoading(false)) // egal ob complete/error
      )
      .subscribe({
        next: (e) => {
          console.log('Event received:', e.id, e.kind, e.content.slice(0, 50));
          setEvents(prev => (prev.some(x => x.id === e.id) ? prev : [...prev, e]));
        },
        complete: () => {
          console.log('Loader completed');
          // Simple Heuristik: nichts Neues? -> eventuell „am Ende"
          setExhausted(prev => prev || false /* hier ggf. besseres Signal vom Loader nutzen */);
        },
        error: (err) => {
          console.log('Loader error:', err);
          // Fehler beendet diesen Page-Load, aber wir lassen die Liste stehen
        }
      });

    return () => { console.log("unsubscribe"); sub.unsubscribe(); }
  }, [loading, exhausted, loader, readRelays]); // Include readRelays for relay updates

  // Reset (z. B. beim Filterwechsel)
  const reset = useCallback(() => {
    pageAbort$.current.next(); // laufende Page-Loads abbrechen
    setEvents([]);
    setExhausted(false);
    setLoading(false);
  }, []);

  // Bei Unmount alle laufenden Loads abbrechen
  useEffect(() => {
    return () => {
      pageAbort$.current.next();
      pageAbort$.current.complete();
    };
  }, []);

  // Process events to VideoEvent format
  const videos = useMemo(() => {
    return processEvents(events, readRelays, blockedPubkeys);
  }, [events, readRelays, blockedPubkeys]);

  return { 
    events, 
    videos, 
    loading, 
    exhausted, 
    loadMore, 
    reset 
  };
}
