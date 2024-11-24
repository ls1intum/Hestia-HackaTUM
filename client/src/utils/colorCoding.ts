export const getScoreColor = (score: number) => {
  if (score >= 8) return 'bg-green-500'
  if (score >= 6) return 'bg-blue-500'
  if (score >= 4) return 'bg-yellow-500'
  return 'bg-red-500'
}

export const getScoreTextColor = (score: number) => {
  if (score >= 8) return 'text-green-700'
  if (score >= 6) return 'text-blue-700'
  if (score >= 4) return 'text-yellow-700'
  return 'text-red-700'
}

export const getTileColorForScore = (score: number): string => {
  // Input validation
  if (typeof score !== 'number' || isNaN(score)) {
    throw new Error('Score must be a number')
  }

  if (score < 1 || score > 10) {
    throw new Error('Score must be between 1 and 10')
  }

  // Normalize score to 0-1 range
  const normalizedScore = (score - 1) / 9

  // Use a more pleasing color transition
  // Start with darker red, transition through yellow to vibrant green
  const red = Math.round(255 * (1 - Math.pow(normalizedScore, 2)))
  const green = Math.round(255 * Math.pow(normalizedScore, 0.8))
  const blue = 0

  // Helper function to convert to hex with validation
  const toHex = (num: number): string => {
    const validNum = Math.max(0, Math.min(255, Math.round(num)))
    return validNum.toString(16).padStart(2, '0')
  }

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`
}
