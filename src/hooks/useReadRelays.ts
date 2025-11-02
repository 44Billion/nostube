import { useMemo } from 'react'
import { useAppContext } from './useAppContext'

/**
 * Returns read relays from app configuration
 */
export function useReadRelays(): string[] {
  const { config } = useAppContext()
  
  return useMemo(
    () => config.relays.filter(r => r.tags.includes('read')).map(r => r.url),
    [config.relays]
  )
}
