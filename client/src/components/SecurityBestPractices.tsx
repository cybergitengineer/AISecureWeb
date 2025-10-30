import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

interface BestPractice {
  id: string;
  title: string;
  description: string;
  importance: "critical" | "recommended" | "optional";
  implemented: boolean;
}

interface SecurityBestPracticesProps {
  practices: BestPractice[];
}

const importanceConfig = {
  critical: {
    label: "Critical",
    className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
  },
  recommended: {
    label: "Recommended",
    className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
  },
  optional: {
    label: "Optional",
    className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
  }
};

export function SecurityBestPractices({ practices }: SecurityBestPracticesProps) {
  return (
    <Card className="p-6" data-testid="card-best-practices">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">Security Best Practices</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Follow these guidelines to enhance your AI security posture
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20 border">
          {practices.filter(p => p.implemented).length}/{practices.length} Implemented
        </Badge>
      </div>

      <div className="space-y-4">
        {practices.map((practice) => (
          <div
            key={practice.id}
            className="flex gap-4 p-4 rounded-lg border border-border hover-elevate"
            data-testid={`practice-${practice.id}`}
          >
            <div className="flex-shrink-0 mt-1">
              {practice.implemented ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <h4 className="font-medium">{practice.title}</h4>
                <Badge className={`${importanceConfig[practice.importance].className} border flex-shrink-0`}>
                  {importanceConfig[practice.importance].label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{practice.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Need help implementing these practices?
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200/80">
              Check our comprehensive documentation for step-by-step guides and code examples.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
