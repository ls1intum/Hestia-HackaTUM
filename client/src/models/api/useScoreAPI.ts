import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getSettings, SettingsData } from '@/components/Settings'

// Interfaces for the API request and response
type ScoreRequestWeights = SettingsData['weights']

interface ScoreRequest {
  address: string
  travelMode: 'DRIVE' | 'TRANSIT'
  zips: string[]
  weights: ScoreRequestWeights
}

interface ScoreResponse {
  [zipCode: string]: number
}

interface UseScoreAPIParams {
  zipCodes: string[]
  travelMode?: 'DRIVE' | 'TRANSIT'
}

const QUERY_KEY = ['zipCodeScores'] as const

async function fetchScores({
  zipCodes,
  travelMode = 'DRIVE',
}: UseScoreAPIParams): Promise<ScoreResponse> {
  if (!zipCodes || zipCodes.length === 0) {
    throw new Error('No ZIP codes provided')
  }

  const settings = getSettings()

  const response = await fetch(`/api/score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address: settings.workAddress,
      travelMode,
      zips: zipCodes,
      weights: settings.weights,
    } as ScoreRequest),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export function useScoreAPI({ zipCodes, travelMode = 'DRIVE' }: UseScoreAPIParams) {
  return useQuery({
    queryKey: [...QUERY_KEY, zipCodes, travelMode],
    queryFn: () => fetchScores({ zipCodes, travelMode }),
    enabled: zipCodes.length > 0,
    staleTime: 1000 * 60 * 15, // Consider data fresh for 15 minutes
    gcTime: 1000 * 60 * 60 * 24, // Keep unused data in cache for 24 hours
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

// Utility function to get score for a specific ZIP code
export function getScoreForZipCode(
  data: ScoreResponse | undefined,
  zipCode: string
): number | undefined {
  return data?.[zipCode]
}

// Utility function to convert score to color
export function getColorForScore(score: number): string {
  const clampedValue = Math.min(100, Math.max(0, score))
  const red = Math.round(255 * (1 - clampedValue / 100))
  const green = Math.round(255 * (clampedValue / 100))
  const blue = 0
  const toHex = (num: number) => num.toString(16).padStart(2, '0')
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`
}

// Utility function to get colors for multiple ZIP codes
export function getColorsForZipCodes(
  data: ScoreResponse | undefined,
  zipCodes: string[]
): Record<string, string> {
  if (!data) return {}

  const colors: Record<string, string> = {}
  zipCodes.forEach(zip => {
    const score = data[zip]
    if (score !== undefined) {
      colors[zip] = getColorForScore(score)
    }
  })
  return colors
}

// Optional: Prefetch function
export function prefetchScores(
  queryClient: ReturnType<typeof useQueryClient>,
  params: UseScoreAPIParams
) {
  return queryClient.prefetchQuery({
    queryKey: [...QUERY_KEY, params.zipCodes, params.travelMode],
    queryFn: () => fetchScores(params),
  })
}

// Example usage in component:
/*
function YourComponent() {
  const zipCodes = ['80331', '80333']
  const { data, isLoading, error } = useScoreAPI({ zipCodes })

  useEffect(() => {
    if (data) {
      const colors = getColorsForZipCodes(data, zipCodes)
      setZipCodeColors(colors) // Your existing state setter
    }
  }, [data, zipCodes])

  // Rest of your component
}
*/

export type {
  ScoreResponse,
  ScoreRequest,
  ScoreRequestWeights,
  UseScoreAPIParams
}