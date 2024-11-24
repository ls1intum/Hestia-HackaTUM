import React, { useCallback, useEffect, useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import {
  Baby,
  Clock,
  Coins,
  Hospital,
  MapPin,
  School,
  Wind,
} from 'lucide-react'
import Cookies from 'js-cookie'

export interface SettingsData {
  workAddress: string
  weights: {
    commuteTime: {
      weight: number
      enabled: boolean
    }
    kitaProximity: {
      weight: number
      enabled: boolean
    }
    schoolProximity: {
      weight: number
      enabled: boolean
    }
    airQuality: {
      weight: number
      enabled: boolean
    }
    price: {
      weight: number
      enabled: boolean
    }
    klinikProximity: {
      weight: number
      enabled: boolean
    }
  }
}

interface SettingsProps {
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const COOKIE_KEY = 'user_settings'

export const getSettings = (): SettingsData => {
  const storedSettings = Cookies.get(COOKIE_KEY)
  if (storedSettings) {
    return JSON.parse(storedSettings) as SettingsData
  }
  return {
    workAddress: '',
    weights: {
      price: { weight: 50, enabled: true },
      commuteTime: { weight: 50, enabled: true },
      kitaProximity: { weight: 50, enabled: true },
      schoolProximity: { weight: 50, enabled: true },
      airQuality: { weight: 50, enabled: true },
      klinikProximity: { weight: 50, enabled: true },
    },
  }
}

const categoryConfig: Record<
  keyof SettingsData['weights'],
  {
    label: string
    icon: React.ReactNode
    description: string
  }
> = {
  price: {
    label: 'Rental Price',
    icon: <Coins className='w-4 h-4' />,
    description: 'Weight importance of rental costs',
  },
  commuteTime: {
    label: 'Commute Time',
    icon: <Clock className='w-4 h-4' />,
    description: 'Prioritize locations with shorter commute times',
  },
  kitaProximity: {
    label: 'Kindergartens',
    icon: <Baby className='w-4 h-4' />,
    description: 'Consider proximity to kindergartens',
  },
  schoolProximity: {
    label: 'Schools',
    icon: <School className='w-4 h-4' />,
    description: 'Factor in distance to schools',
  },
  airQuality: {
    label: 'Air Quality',
    icon: <Wind className='w-4 h-4' />,
    description: 'Prefer areas with better air quality',
  },
  klinikProximity: {
    label: 'Hospitals',
    icon: <Hospital className='w-4 h-4' />,
    description: 'Consider distance to medical facilities',
  },
}

function Settings({ setIsSettingsOpen }: SettingsProps) {
  const [settings, setSettings] = useState<SettingsData>(getSettings())
  const [isDirty, setIsDirty] = useState(false)
  const [addressError, setAddressError] = useState<string>('')

  useEffect(() => {
    setIsDirty(true)
  }, [settings])

  const handleSave = () => {
    if (!settings.workAddress.trim()) {
      setAddressError('Work address is required')
      return
    }
    Cookies.set(COOKIE_KEY, JSON.stringify(settings), { expires: 14 })
    setIsDirty(false)
    setIsSettingsOpen(false)
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSettings(prev => ({ ...prev, workAddress: value }))
    if (value.trim()) {
      setAddressError('')
    }
  }

  const handleSliderChange = useCallback(
    (key: keyof SettingsData['weights'], value: number) => {
      setSettings(prev => ({
        ...prev,
        weights: {
          ...prev.weights,
          [key]: { ...prev.weights[key], weight: value },
        },
      }))
    },
    []
  )

  const handleToggleChange = useCallback(
    (key: keyof SettingsData['weights']) => {
      setSettings(prev => ({
        ...prev,
        weights: {
          ...prev.weights,
          [key]: { ...prev.weights[key], enabled: !prev.weights[key].enabled },
        },
      }))
    },
    []
  )

  return (
    <Dialog open={true} onOpenChange={isOpen => setIsSettingsOpen(isOpen)}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Search Preferences</DialogTitle>
          <DialogDescription>
            Customize your search criteria to find the perfect home
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center gap-2 mb-2'>
                <MapPin className='w-4 h-4' />
                <Label htmlFor='workAddress' className='text-sm font-medium'>
                  Work Address <span className='text-red-500'>*</span>
                </Label>
              </div>
              <Input
                id='workAddress'
                placeholder='Musterstraße 123, München'
                value={settings.workAddress}
                onChange={handleAddressChange}
                className={`w-full ${addressError ? 'border-red-500' : ''}`}
                required
                aria-required='true'
              />
              {addressError && (
                <p className='text-red-500 text-sm mt-1'>{addressError}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6 space-y-6'>
              {Object.entries(categoryConfig).map(([key, config]) => {
                const categoryKey = key as keyof SettingsData['weights']
                return (
                  <div key={categoryKey} className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        {config.icon}
                        <div>
                          <Label className='text-sm font-medium'>
                            {config.label}
                          </Label>
                          <p className='text-xs text-muted-foreground'>
                            {config.description}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.weights[categoryKey].enabled}
                        onCheckedChange={() => handleToggleChange(categoryKey)}
                      />
                    </div>
                    <div className='h-8 flex flex-col justify-center'>
                      {settings.weights[categoryKey].enabled && (
                        <div className='space-y-1'>
                          <Slider
                            value={[settings.weights[categoryKey].weight]}
                            onValueChange={value =>
                              handleSliderChange(categoryKey, value[0])
                            }
                            max={100}
                            step={1}
                            aria-label={config.label}
                            className='w-full'
                          />
                          <div className='text-right text-xs text-muted-foreground'>
                            Priority: {settings.weights[categoryKey].weight}%
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => setIsSettingsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isDirty}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Settings
