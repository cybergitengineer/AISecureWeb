import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SecurityScoreCardProps {
  score: number;
  status: "excellent" | "good" | "warning" | "critical";
  trend?: number;
  label?: string;
}

export function SecurityScoreCard({ score, status, trend, label = "Security Score" }: SecurityScoreCardProps) {
  const statusColors = {
    excellent: "bg-green-500",
    good: "bg-blue-500",
    warning: "bg-yellow-500",
    critical: "bg-red-500"
  };

  const statusLabels = {
    excellent: "Excellent",
    good: "Good",
    warning: "Warning",
    critical: "Critical"
  };

  const statusBadgeVariants = {
    excellent: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    good: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    critical: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
  };

  return (
    <Card className="p-6" data-testid="card-security-score">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
        <Badge className={`${statusBadgeVariants[status]} border`} data-testid={`badge-status-${status}`}>
          {statusLabels[status]}
        </Badge>
      </div>
      
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
              opacity="0.2"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className={statusColors[status]}
              strokeDasharray={`${(score / 100) * 351.86} 351.86`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold" data-testid="text-score-value">{score}</span>
          </div>
        </div>
      </div>

      {trend !== undefined && (
        <div className="flex items-center justify-center gap-1 text-sm">
          {trend > 0 ? (
            <>
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+{trend}%</span>
            </>
          ) : (
            <>
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-red-500 font-medium">{trend}%</span>
            </>
          )}
          <span className="text-muted-foreground">vs last week</span>
        </div>
      )}
    </Card>
  );
}
