import { getScoreColor, getScoreTextColor } from '@/utils/colorCoding.ts'
import { cn, formatNumber } from '@/lib/utils.ts'

export function ScoreDisplay({
  value,
  label,
  max = 10,
  showProgress = true,
  colorCode = true,
}: {
  value: number
  label: string
  max?: number
  showProgress?: boolean
  colorCode?: boolean
}) {
  return (
    <div className='space-y-2'>
      <div className='flex justify-between items-center mb-1'>
        <span className='text-sm font-medium'>{label}</span>
        <div className='flex items-center'>
          <span
            className={cn(
              'text-sm font-bold',
              colorCode ? getScoreTextColor(value) : ''
            )}
          >
            {formatNumber(value)}
          </span>
          <span className='text-sm text-muted-foreground'>/</span>
          <span className='text-sm'>{max}</span>
        </div>
      </div>
      {showProgress && (
        <div className='h-2 w-full bg-muted rounded-full overflow-hidden'>
          <div
            className={cn(
              'h-full transition-all',
              colorCode ? getScoreColor(value) : 'bg-primary'
            )}
            style={{ width: `${(value / max) * 100}%` }}
          />
        </div>
      )}
    </div>
  )
}
