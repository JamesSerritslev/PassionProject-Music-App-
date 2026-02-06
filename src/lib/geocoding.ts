/**
 * Google Maps Geocoding API - convert address to lat/lng
 * Add VITE_GOOGLE_MAPS_API_KEY to .env
 */

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'

export interface GeocodeResult {
  lat: number
  lng: number
  formatted_address: string | null
}

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  if (!API_KEY || !address?.trim()) return null
  const encoded = encodeURIComponent(address.trim())
  const url = `${BASE_URL}?address=${encoded}&key=${API_KEY}`
  try {
    const res = await fetch(url)
    const data = await res.json()
    if (data.status !== 'OK' || !data.results?.length) return null
    const loc = data.results[0].geometry?.location
    const formatted = data.results[0].formatted_address ?? null
    if (!loc?.lat || !loc?.lng) return null
    return { lat: loc.lat, lng: loc.lng, formatted_address: formatted }
  } catch {
    return null
  }
}

/**
 * Haversine distance between two lat/lng points in miles
 */
export function distanceMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3958.8 // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
