import { useQuery, useQueryClient } from '@tanstack/react-query'

// Interfaces for the API response
interface PriceIndexValue {
  zipCode: string
  prizePerSqm: number
  googlePlaceId: string
}

interface RequestMetadata {
  duration: number
  time: string
}

interface PriceIndexResponse {
  values: PriceIndexValue[]
  estateType: string
  message: string
  request: RequestMetadata
}

// Optional: Interface for query parameters if needed
interface PriceIndexParams {
  estateType?: 'houses'
}

const QUERY_KEY = ['priceIndex'] as const

async function fetchPriceIndex(
  params?: PriceIndexParams
): Promise<PriceIndexResponse> {
  const queryParams = new URLSearchParams()

  if (params?.estateType) {
    queryParams.append('estateType', params.estateType)
  }

  const url = `https://hestia.aet.cit.tum.de/api/interhyp/price-index/buy${
    queryParams.toString() ? `?${queryParams.toString()}` : ''
  }`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch price index: ${response.statusText}`)
  }

  return response.json()
}

export function usePriceIndex(params?: PriceIndexParams) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => fetchPriceIndex(params),
    staleTime: 1000 * 60 * 15, // Consider data fresh for 15 minutes
    gcTime: 1000 * 60 * 60 * 24, // Keep unused data in cache for 24 hours
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

// Utility function to get price for a specific ZIP code
export function getPriceForZipCode(
  data: PriceIndexResponse | undefined,
  zipCode: string
): number | undefined {
  return data?.values.find(value => value.zipCode === zipCode)?.prizePerSqm
}

// Optional: Prefetch function
export function prefetchPriceIndex(
  queryClient: ReturnType<typeof useQueryClient>,
  params?: PriceIndexParams
) {
  return queryClient.prefetchQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => fetchPriceIndex(params),
  })
}

// Export types for use in other components
export type {
  PriceIndexValue,
  PriceIndexResponse,
  PriceIndexParams,
  RequestMetadata,
}
