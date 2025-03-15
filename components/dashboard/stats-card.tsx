import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "relative overflow-hidden transition-all hover:shadow-md",
  {
    variants: {
      variant: {
        default: "bg-card",
        purple: "bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 border-purple-100 dark:border-purple-900/20",
        blue: "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 border-blue-100 dark:border-blue-900/20",
        green: "bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10 border-green-100 dark:border-green-900/20",
        pink: "bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-900/10 border-pink-100 dark:border-pink-900/20",
        red: "bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-900/10 border-red-100 dark:border-red-900/20",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

interface StatsCardProps {
  label: string;
  value: number;
  unit: string;
  trend?: number;
  variant?: VariantProps<typeof cardVariants>["variant"];
  icon?: LucideIcon;
}

export function StatsCard({ label, value, unit, trend, variant, icon: Icon }: StatsCardProps) {
  return (
    <Card className={cardVariants({ variant })}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {Icon && (
            <Icon className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        {trend !== undefined && (
          <div className="mt-4 flex items-center gap-1">
            <div className={`flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              trend > 0 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </div>
            <span className="text-xs text-muted-foreground">vs last week</span>
          </div>
        )}
        <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y--8 opacity-[0.05]">
          {Icon && <Icon className="h-full w-full" />}
        </div>
      </CardContent>
    </Card>
  );
} 