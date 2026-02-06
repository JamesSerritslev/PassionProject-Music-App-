import { useState, useCallback } from 'react'
import { geocodeAddress } from '@/lib/geocoding'

export function useLocationGeocode() {
  const [geocoding, setGeocoding] = useState(false)
  const [geocodeError, setGeocodeError] = useState<string | null>(null)

  const geocode = useCallback(
    async (address: string): Promise<{ lat: number; lng: number } | null> => {
      if (!address?.trim()) return null
      setGeocodeError(null)
      setGeocoding(true)
      try {
        const result = await geocodeAddress(address)
        if (result) return { lat: result.lat, lng: result.lng }
        setGeocodeError('Could not find coordinates for this address')
        return null
      } catch {
        setGeocodeError('Geocoding failed')
        return null
      } finally {
        setGeocoding(false)
      }
    },
    []
  )

  return { geocode, geocoding, geocodeError, clearError: () => setGeocodeError(null) }
}
