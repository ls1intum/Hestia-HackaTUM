import React, { useCallback, useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Cookies from "js-cookie";

export interface SettingsData {
  workAddress: string;
  weights: {
    commuteTime: {
      weight: number;
      enabled: boolean;
    };
    kindergartenProximity: {
      weight: number;
      enabled: boolean;
    };
    rentalPrice: {
      weight: number;
      enabled: boolean;
    };
  };
}

interface SettingsProps {
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const COOKIE_KEY = "user_settings";

const getInitialSettings = (): SettingsData => {
  const storedSettings = Cookies.get(COOKIE_KEY);
  if (storedSettings) {
    return JSON.parse(storedSettings) as SettingsData;
  }
  return {
    workAddress: "",
    weights: {
      commuteTime: { weight: 50, enabled: true },
      kindergartenProximity: { weight: 50, enabled: true },
      rentalPrice: { weight: 50, enabled: true },
    },
  };
};

function Settings({ setIsSettingsOpen } : SettingsProps) {
  const [settings, setSettings] = useState<SettingsData>(getInitialSettings());

  useEffect(() => {
    Cookies.set(COOKIE_KEY, JSON.stringify(settings), { expires: 14 });
  }, [settings]);

  const handleSliderChange = useCallback(
      (key: keyof SettingsData["weights"], value: number) => {
        setSettings((prev) => ({
          ...prev,
          weights: {
            ...prev.weights,
            [key]: { ...prev.weights[key], weight: value },
          },
        }));
      },
      []
  );

  const handleToggleChange = useCallback((key: keyof SettingsData["weights"]) => {
    setSettings((prev) => ({
      ...prev,
      weights: {
        ...prev.weights,
        [key]: { ...prev.weights[key], enabled: !prev.weights[key].enabled },
      },
    }));
  }, []);

  return (
      <Dialog open={true} onOpenChange={(isOpen) => setIsSettingsOpen(isOpen)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="workAddress" className="text-sm font-medium">
                Work Address
              </Label>
              <Input
                  id="workAddress"
                  placeholder="Musterstraße 123, München"
                  value={settings.workAddress}
                  onChange={(e) =>
                      setSettings((prev) => ({ ...prev, workAddress: e.target.value }))
                  }
              />
            </div>

            {Object.keys(settings.weights).map((key) => {
              const categoryKey = key as keyof SettingsData["weights"];
              const labels: Record<keyof SettingsData["weights"], string> = {
                commuteTime: "Commute Time",
                kindergartenProximity: "Proximity to Kindergartens",
                rentalPrice: "Rental Price",
              };
              return (
                  <div key={categoryKey} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">{labels[categoryKey]}</Label>
                      <Switch
                          checked={settings.weights[categoryKey].enabled}
                          onCheckedChange={() => handleToggleChange(categoryKey)}
                      />
                    </div>

                    {settings.weights[categoryKey].enabled && (
                        <div className="space-y-2">
                          <Slider
                              value={[settings.weights[categoryKey].weight]}
                              onValueChange={(value) => handleSliderChange(categoryKey, value[0])}
                              max={100}
                              step={1}
                              aria-label={labels[categoryKey]}
                              className="w-full"
                          />
                          <div className="text-right text-xs text-muted">
                            Weight: {settings.weights[categoryKey].weight}%
                          </div>
                        </div>
                    )}
                  </div>
              );
            })}
          </div>

          <Button className="mt-6 w-full" onClick={() => setIsSettingsOpen(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
  );
}

export default Settings;
