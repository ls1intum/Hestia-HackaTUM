import {cn, formatNumber} from "@/lib/utils.ts";
import {getScoreTextColor} from "@/utils/colorCoding.ts";

export function StatCard({
  icon: Icon,
  label,
  value,
  unit = '',
  score,
  emphasized = false,
  colorCode = false, // New prop to control color coding
}: {
  icon: any
  label: string
  value: number | string
  unit?: string
  score?: number
  emphasized?: boolean
  colorCode?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg',
        emphasized ? 'bg-primary/10' : 'bg-muted/50',
        colorCode && score ? getScoreTextColor(score) : ''
      )}
    >
      <div
        className={cn(
          'p-2 rounded-md',
          emphasized ? 'bg-primary/20' : 'bg-background'
        )}
      >
        <Icon className='h-4 w-4' />
      </div>
      <div>
        <div
          className={cn(
            'text-sm',
            emphasized ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {label}
        </div>
        <div className={cn('font-bold', emphasized && 'text-lg')}>
          {typeof value === 'number' ? formatNumber(value) : value}
          {unit && (
            <span className='text-sm font-normal text-muted-foreground ml-1'>
              {unit}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
