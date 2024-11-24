export function CommuteCard({
  icon: Icon,
  duration,
  subtitle,
}: {
  icon: any
  duration: number
  subtitle: string
}) {
  return (
    <div className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg '>
      <div className='p-2 bg-background rounded-md'>
        <Icon className='size-8' />
      </div>
      <div className='space-y-1'>
        <div className='text-xl font-bold'>
          {duration}{' '}
          <span className='text-sm font-normal text-muted-foreground'>min</span>
        </div>
        <div className='text-xs text-muted-foreground'>{subtitle}</div>
      </div>
    </div>
  )
}
