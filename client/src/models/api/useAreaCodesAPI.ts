import {useQuery, useQueryClient} from '@tanstack/react-query'
import {FeatureCollection} from 'geojson'

interface BoundingBox {
    minLat: number
    minLon: number
    maxLat: number
    maxLon: number
}

const QUERY_KEY = ['zipCodes'] as const

async function fetchZipCodes(bounds: BoundingBox): Promise<FeatureCollection> {
    const params = new URLSearchParams({
        min_lat: bounds.minLat.toString(),
        min_lon: bounds.minLon.toString(),
        max_lat: bounds.maxLat.toString(),
        max_lon: bounds.maxLon.toString(),
    })

    const response = await fetch(`/api/geo?${params.toString()}`, {
        method: 'POST',
    })

    if (!response.ok) {
        throw new Error('Failed to fetch ZIP codes')
    }

    return {
        type: 'FeatureCollection',
        features: await response.json()
    }
}

export function useZipCodes(bounds: BoundingBox) {
    return useQuery({
        queryKey: [...QUERY_KEY, bounds],
        queryFn: () => fetchZipCodes(bounds),
        staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
        gcTime: 1000 * 60 * 60, // Keep unused data in cache for 1 hour
        retry: 3, // Retry failed requests 3 times
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
    })
}

export function prefetchZipCodes(
    queryClient: ReturnType<typeof useQueryClient>,
    bounds: BoundingBox
) {
    return queryClient.prefetchQuery({
        queryKey: [...QUERY_KEY, bounds],
        queryFn: () => fetchZipCodes(bounds),
    })
}
