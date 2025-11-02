import { useMemo } from 'react'
import { useAppContext } from './useAppContext'

/**
 * Returns write relays from app configuration
 */
export function useWriteRelays(): string[] {
  const { config } = useAppContext()
  
  return useMemo(
    () => config.relays.filter(r => r.tags.includes('write')).map(r => r.url),
    [config.relays]
  )
}
