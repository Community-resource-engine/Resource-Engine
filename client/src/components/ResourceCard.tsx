import { Resource, SERVICE_LABELS } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Building2 } from "lucide-react";

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-border/40">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-xl font-semibold text-primary">
              {resource.name1}
            </CardTitle>
            {resource.name2 && (
              <p className="text-sm text-muted-foreground mt-1">{resource.name2}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p>{resource.street1}</p>
              {resource.street2 && <p>{resource.street2}</p>}
              <p>
                {resource.city}, {resource.state} {resource.zip}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0" />
            <a href={`tel:${resource.phone}`} className="hover:text-primary transition-colors">
              {resource.phone}
            </a>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Services Available
          </p>
          <div className="flex flex-wrap gap-1.5">
            {resource.service_code_info.map((code) => (
              <Badge 
                key={code} 
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {SERVICE_LABELS[code] || code}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
