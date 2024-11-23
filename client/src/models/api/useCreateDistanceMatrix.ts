import { useMutation, useQueryClient } from '@tanstack/react-query'

// Enums and Interfaces remain the same
export enum TravelMode {
  TRAVEL_MODE_UNSPECIFIED = 'TRAVEL_MODE_UNSPECIFIED',
  DRIVE = 'DRIVE',
  BICYCLE = 'BICYCLE',
  WALK = 'WALK',
  TWO_WHEELER = 'TWO_WHEELER',
  TRANSIT = 'TRANSIT'
}

interface Location {
  latitude: number
  longitude: number
}

interface DistanceMatrixRequest {
  origin: Location
  placeIds: string[]
  travelMode: TravelMode
}

interface DistanceMatrixResponse {
  durations: Record<string, number>
  message?: string
  request?: {
    duration: number
    time: string
  }
}

const ENDPOINT = 'https://hestia.aet.cit.tum.de/api/google/distance-matrix'
const QUERY_KEY = ['distances'] as const

async function fetchDistanceMatrix(
  request: DistanceMatrixRequest
): Promise<DistanceMatrixResponse> {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to fetch distance matrix: ${errorText}`)
  }

  return response.json()
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} sec`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes < 60) {
    return remainingSeconds > 0
      ? `${minutes} min ${remainingSeconds} sec`
      : `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  return remainingMinutes > 0
    ? `${hours} hr ${remainingMinutes} min`
    : `${hours} hr`
}

interface CacheKey {
  type: 'distance'
  origin: Location
  placeId: string
  mode: TravelMode
}

export function useDistanceCalculator() {
  const mutation = useMutation({
    mutationFn: fetchDistanceMatrix,
  })
  const queryClient = useQueryClient()

  // Proper query key generator
  const getCacheKey = (origin: Location, placeId: string, mode: TravelMode): CacheKey => ({
    type: 'distance',
    origin,
    placeId,
    mode,
  })

  // Function to get cached value
  const getCachedDuration = (origin: Location, placeId: string, mode: TravelMode) => {
    const queryKey = [QUERY_KEY, getCacheKey(origin, placeId, mode)] as const
    return queryClient.getQueryData<number>(queryKey)
  }

  // Function to set cached value
  const setCachedDuration = (
    origin: Location,
    placeId: string,
    mode: TravelMode,
    duration: number
  ) => {
    const queryKey = [QUERY_KEY, getCacheKey(origin, placeId, mode)] as const
    queryClient.setQueryData(queryKey, duration)
  }

  return {
    ...mutation,
    calculateDistances: async (
      origin: Location,
      placeIds: string[],
      mode: TravelMode
    ) => {
      // Filter out placeIds that are already cached
      const uncachedPlaceIds = placeIds.filter(
        id => !getCachedDuration(origin, id, mode)
      )

      if (uncachedPlaceIds.length > 0) {
        const result = await mutation.mutateAsync({
          origin,
          placeIds: uncachedPlaceIds,
          travelMode: mode,
        })

        // Cache the new results
        Object.entries(result.durations).forEach(([placeId, duration]) => {
          setCachedDuration(origin, placeId, mode, duration)
        })

        return result.durations
      }

      // Return all durations (both cached and new)
      return Object.fromEntries(
        placeIds.map(id => [
          id,
          getCachedDuration(origin, id, mode) as number
        ])
      )
    },

    // Add a method to prefetch distances
    prefetchDistances: async (
      origin: Location,
      placeIds: string[],
      mode: TravelMode
    ) => {
      const uncachedPlaceIds = placeIds.filter(
        id => !getCachedDuration(origin, id, mode)
      )

      if (uncachedPlaceIds.length > 0) {
        return queryClient.prefetchQuery({
          queryKey: [QUERY_KEY, 'prefetch', { origin, placeIds: uncachedPlaceIds, mode }],
          queryFn: () => fetchDistanceMatrix({
            origin,
            placeIds: uncachedPlaceIds,
            travelMode: mode,
          })
        })
      }
    },

    // Add a method to clear cache for specific entries
    clearCache: (origin: Location, placeIds: string[], mode: TravelMode) => {
      placeIds.forEach(placeId => {
        const queryKey = [QUERY_KEY, getCacheKey(origin, placeId, mode)] as const
        queryClient.removeQueries({ queryKey })
      })
    },

    // Get single duration with loading state
    getDuration: (origin: Location, placeId: string, mode: TravelMode) => {
      const queryKey = [QUERY_KEY, getCacheKey(origin, placeId, mode)] as const
      return {
        duration: queryClient.getQueryData<number>(queryKey),
        isLoading: queryClient.isFetching({ queryKey })
      }
    }
  }
}

// Export types
export type {
  Location,
  DistanceMatrixRequest,
  DistanceMatrixResponse,
  CacheKey
}