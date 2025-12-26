import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SERVICE_LABELS } from "@/data/mockData";
import { X } from "lucide-react";

interface FiltersProps {
  selectedServices: string[];
  onServiceChange: (service: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedState: string;
  onStateChange: (state: string) => void;
  availableStates: string[];
  onReset: () => void;
}

export function Filters({
  selectedServices,
  onServiceChange,
  searchQuery,
  onSearchChange,
  selectedState,
  onStateChange,
  availableStates,
  onReset,
}: FiltersProps) {
  // Sort services by label
  const sortedServices = Object.entries(SERVICE_LABELS).sort(([, a], [, b]) =>
    a.localeCompare(b)
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Filters</h3>
          {(selectedServices.length > 0 || searchQuery || selectedState) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 px-2 text-muted-foreground"
            >
              Reset
              <X className="ml-2 h-3 w-3" />
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label>State</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedState === "" ? "default" : "outline"}
                size="sm"
                onClick={() => onStateChange("")}
              >
                All
              </Button>
              {availableStates.map((state) => (
                <Button
                  key={state}
                  variant={selectedState === state ? "default" : "outline"}
                  size="sm"
                  onClick={() => onStateChange(state)}
                >
                  {state}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label>Services</Label>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {sortedServices.map(([code, label]) => (
              <div key={code} className="flex items-start space-x-2">
                <Checkbox
                  id={`service-${code}`}
                  checked={selectedServices.includes(code)}
                  onCheckedChange={() => onServiceChange(code)}
                />
                <Label
                  htmlFor={`service-${code}`}
                  className="text-sm font-normal leading-tight cursor-pointer"
                >
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
