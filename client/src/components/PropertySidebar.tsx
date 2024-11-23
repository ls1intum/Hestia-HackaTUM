// src/components/PropertySidebar.tsx
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, Train, Home, Baby } from 'lucide-react'
import { cn } from "@/lib/utils"

interface PropertyData {
  plz: string;
  name: string;
  rentPrices: {
    average: number;
    range: string;
  };
  buyPrices: {
    average: number;
    range: string;
  };
  transportation: {
    score: number;
    stations: number;
    busLines: number;
  };
  childcare: {
    kindergartens: number;
    kitas: number;
    availablePlaces: number;
  };
}

interface PropertySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  data: PropertyData | null;
}

export function PropertySidebar({ isOpen, onClose, data }: PropertySidebarProps) {
  if (!data) return null;

  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-full w-[400px] bg-background border-l transform transition-transform duration-300 ease-in-out overflow-y-auto",
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Badge>{data.plz}</Badge>
            <h2 className="text-2xl font-bold mt-2">{data.name}</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Real Estate Prices Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Real Estate Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Average Rent (per m²)</span>
                  <span className="text-sm font-bold">€{data.rentPrices.average.toFixed(2)}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Range: {data.rentPrices.range}
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Average Purchase (per m²)</span>
                  <span className="text-sm font-bold">€{data.buyPrices.average.toFixed(0)}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Range: {data.buyPrices.range}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transportation Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Train className="h-5 w-5" />
                Public Transportation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Connectivity Score</span>
                  <span className="text-sm font-bold">{data.transportation.score.toFixed(1)}/10</span>
                </div>
                <Progress value={data.transportation.score * 10} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Train/Metro Stations</div>
                  <div className="text-2xl font-bold">{data.transportation.stations}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Bus Lines</div>
                  <div className="text-2xl font-bold">{data.transportation.busLines}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Childcare Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="h-5 w-5" />
                Childcare Facilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Kindergartens</div>
                  <div className="text-2xl font-bold">{data.childcare.kindergartens}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Kitas</div>
                  <div className="text-2xl font-bold">{data.childcare.kitas}</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Available Places</div>
                <div className="text-2xl font-bold">{data.childcare.availablePlaces}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}