import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Baby,
  Bus,
  Calculator,
  Car,
  Coffee,
  Coins,
  Home,
  Hospital,
  Shield,
  ShoppingCart,
  Shrub,
  Train,
  Wind,
  X,
} from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PropertyData from '@/models/HousingPropertyData.ts'
import { calculateOverallScore } from '@/utils/calculateScore.ts'
import { getScoreColor } from '@/utils/colorCoding.ts'
import { StatCard } from '@/components/StatCard.tsx'
import { ScoreDisplay } from '@/components/ScoreDisplay.tsx'
import { CommuteCard } from '@/components/CommuteCard.tsx' // Extended interface with score weights

interface PropertySidebarProps {
  isOpen: boolean
  onClose: () => void
  data: PropertyData | null
}

const handleFinanceCalculator = () => {
  window.open(
    'https://www.interhyp.de/finanzierung-anfragen/?ventureReason=KaufBest&estateCombiType=Wohnung&zipVenture=80939&estateUtilization=eigen&priceBuilding=653000&equityValue=130600#/Finanzierungsgrund',
    '_blank'
  )
}

export function PropertySidebar({
  isOpen,
  onClose,
  data,
}: PropertySidebarProps) {
  if (!data) return null

  const overallScore = calculateOverallScore(data)

  return (
    <div
      className={cn(
        'fixed right-0 top-0 h-full w-[450px] bg-background border-l',
        'transition-all duration-300 ease-in-out',
        isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    >
      <div className='flex flex-col h-full'>
        {/* Header with Overall Score */}
        <div className='p-6 border-b'>
          <div className='flex justify-between items-start mb-4'>
            <div>
              <Badge variant='secondary'>{data.plz}</Badge>
              <h2 className='text-2xl font-bold mt-2'>München</h2>
            </div>
            <Button variant='ghost' size='icon' onClick={onClose}>
              <X className='h-4 w-4' />
            </Button>
          </div>

          {/* Overall Score - Keep color coding here */}
          <div className='flex items-center gap-4 p-4 bg-muted rounded-lg'>
            <div
              className={cn(
                'h-16 w-16 rounded-full flex items-center justify-center',
                getScoreColor(overallScore)
              )}
            >
              <span className='text-white text-2xl font-bold'>
                {formatNumber(overallScore)}
              </span>
            </div>
            <div>
              <div className='font-semibold'>Overall Score</div>
              <div className='text-sm text-muted-foreground'>
                Based on price, location, and amenities
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className='flex-1 p-6'>
          <Tabs defaultValue='overview' className='space-y-6'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='details'>Details</TabsTrigger>
            </TabsList>

            <TabsContent value='overview' className='space-y-6'>
              {/* Price Overview - Keep color coding */}
              <Card className='border-primary/20'>
                <CardHeader className='pb-2'>
                  <CardTitle className='flex items-center gap-2 text-primary'>
                    <Coins className='h-5 w-5' />
                    Price Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <StatCard
                    icon={Coins}
                    label='Average Rent'
                    value={data.rentPrices.average}
                    unit='€/m²'
                    score={data.rentPrices.score}
                    emphasized
                    colorCode={true}
                  />
                  <div className='text-sm text-muted-foreground'>
                    Price Range: {data.rentPrices.range}
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics - Only color code important scores */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                  <CardDescription>
                    Essential neighborhood information
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <ScoreDisplay
                    value={data.transportation.score}
                    label='Transportation'
                    colorCode={true}
                  />
                  <ScoreDisplay
                    value={data.safety.score}
                    label='Safety'
                    colorCode={true}
                  />
                </CardContent>
              </Card>

              {/* Quick Stats - Minimal color coding */}
              <div className='grid grid-cols-2 gap-3'>
                <StatCard
                  icon={Car}
                  label='Car Commute'
                  value={data.transportation.commute.car.duration}
                  unit='min'
                />
                <StatCard
                  icon={Train}
                  label='Public Transport'
                  value={data.transportation.commute.publicTransport.duration}
                  unit='min'
                />
                <StatCard
                  icon={Baby}
                  label='Kita Places'
                  value={data.childcare.availablePlaces}
                />
                <StatCard
                  icon={Wind}
                  label='Air Quality'
                  value={formatNumber(
                    data.environment?.airQualityIndex || 0,
                    0
                  )}
                  unit='/10'
                  colorCode={false}
                  score={data.environment.score}
                />
                <StatCard
                  icon={Shield}
                  label='Emergency Response'
                  value={formatNumber(
                    data.safety?.emergencyResponseTime || 0,
                    0
                  )}
                  unit='min'
                />
              </div>

              {/* Financing Calculator Card - New Addition */}
              <Card
                className='border-primary/20 hover:bg-accent cursor-pointer transition-colors'
                onClick={handleFinanceCalculator}
              >
                <CardHeader className='pb-2'>
                  <CardTitle className='flex items-center gap-2 text-primary'>
                    <Calculator className='h-5 w-5' />
                    Financing Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-sm text-muted-foreground'>
                    Calculate your mortgage rate and monthly payments with
                    Interhyp
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='details' className='space-y-6'>
              {/* Real Estate */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Home className='h-5 w-5' />
                    Real Estate
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <div className='flex justify-between mb-2'>
                      <span className='text-sm font-medium'>Rent (per m²)</span>
                      <span className='text-sm font-bold'>
                        €{data.rentPrices.average.toFixed(2)}
                      </span>
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Range: {data.rentPrices.range}
                    </div>
                  </div>
                  <div>
                    <div className='flex justify-between mb-2'>
                      <span className='text-sm font-medium'>
                        Purchase (per m²)
                      </span>
                      <span className='text-sm font-bold'>
                        €{data.buyPrices.average.toFixed(0)}
                      </span>
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Range: {data.buyPrices.range}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transportation */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Train className='h-5 w-5' />
                    Transportation
                  </CardTitle>
                  <CardDescription>Commute times to workplace</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <CommuteCard
                      icon={Car}
                      duration={data.transportation.commute.car.duration}
                      subtitle={`${data.transportation.commute.car.distance} km distance`}
                    />
                    <CommuteCard
                      icon={Train}
                      duration={
                        data.transportation.commute.publicTransport.duration
                      }
                      subtitle={`${data.transportation.commute.publicTransport.changes} changes`}
                    />
                  </div>

                  <div className='pt-4 border-t'>
                    <div className='text-sm font-medium mb-4'>
                      Public Transport Access
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <StatCard
                        icon={Train}
                        label='Metro Stations'
                        value={data.transportation.stations}
                      />
                      <StatCard
                        icon={Bus}
                        label='Bus Lines'
                        value={data.transportation.busLines}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Wind className='h-5 w-5' />
                    Environment
                  </CardTitle>
                </CardHeader>
                <CardContent className='grid grid-cols-2 gap-4'>
                  <StatCard
                    icon={Wind}
                    label='Air Quality'
                    value={formatNumber(
                      data.environment?.airQualityIndex || 0,
                      0
                    )}
                    unit='/10'
                    colorCode={false}
                    score={data.environment.score}
                  />
                  <StatCard
                    icon={Shrub}
                    label='Green Spaces'
                    value={data.environment?.greenSpaces || 0}
                  />
                </CardContent>
              </Card>

              {/* Healthcare */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Hospital className='h-5 w-5' />
                    Healthcare
                  </CardTitle>
                </CardHeader>
                <CardContent className='grid grid-cols-2 gap-4'>
                  <StatCard
                    icon={Hospital}
                    label='Hospitals'
                    value={data.healthcare?.hospitals || 0}
                  />
                  <StatCard
                    icon={Hospital}
                    label='Clinics'
                    value={data.healthcare?.clinics || 0}
                  />
                </CardContent>
              </Card>

              {/* Family & Education */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Baby className='h-5 w-5' />
                    Family & Education
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <StatCard
                      icon={Baby}
                      label='Kindergartens'
                      value={data.childcare.kindergartens}
                    />
                    <StatCard
                      icon={Baby}
                      label='Kitas'
                      value={data.childcare.kitas}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Lifestyle */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Coffee className='h-5 w-5' />
                    Lifestyle
                  </CardTitle>
                </CardHeader>
                <CardContent className='grid grid-cols-2 gap-4'>
                  <StatCard
                    icon={Coffee}
                    label='Restaurants'
                    value={data.lifestyle?.restaurants || 0}
                  />
                  <StatCard
                    icon={ShoppingCart}
                    label='Shops'
                    value={data.lifestyle?.shops || 0}
                  />
                </CardContent>
              </Card>

              {/* Safety */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Shield className='h-5 w-5' />
                    Safety
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {data.safety?.crimeRate && (
                    <ScoreDisplay
                      value={10 - data.safety.crimeRate}
                      label='Safety Score'
                    />
                  )}
                  {data.safety?.emergencyResponseTime && (
                    <div className='flex justify-between'>
                      <span className='text-sm font-medium'>
                        Emergency Response
                      </span>
                      <span className='text-sm font-bold'>
                        {formatNumber(data.safety.emergencyResponseTime, 0)} min
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </div>
    </div>
  )
}
