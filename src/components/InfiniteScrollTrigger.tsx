import { Loader2 } from 'lucide-react'

interface InfiniteScrollTriggerProps {
  triggerRef: (node?: Element | null) => void
  loading: boolean
  exhausted: boolean
  itemCount: number
  emptyMessage?: string
  loadingMessage?: string
  exhaustedMessage?: string
}

/**
 * Component that displays loading states for infinite scroll
 * Should be placed at the bottom of the scrollable content
 */
export function InfiniteScrollTrigger({
  triggerRef,
  loading,
  exhausted,
  itemCount,
  emptyMessage = 'No items found.',
  loadingMessage = 'Loading more...',
  exhaustedMessage = 'No more items to load.',
}: InfiniteScrollTriggerProps) {
  return (
    <div ref={triggerRef} className="w-full py-8 flex items-center justify-center">
      {loading && itemCount > 0 && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingMessage}
        </div>
      )}
      {!loading && exhausted && itemCount > 0 && (
        <div className="text-muted-foreground">{exhaustedMessage}</div>
      )}
      {itemCount === 0 && !loading && (
        <div className="text-muted-foreground">{emptyMessage}</div>
      )}
    </div>
  )
}
