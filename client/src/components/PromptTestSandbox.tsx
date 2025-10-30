import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Play, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TestResult {
  status: "safe" | "warning" | "dangerous";
  threats: string[];
  confidence: number;
  analysis: string;
}

export function PromptTestSandbox() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const { toast } = useToast();

  const handleTest = async () => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest<TestResult>("/api/security/test-prompt", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });
      
      setResult(response);
    } catch (error: any) {
      console.error('Error testing prompt:', error);
      toast({
        title: "Error",
        description: "Failed to analyze prompt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statusConfig = {
    safe: {
      icon: CheckCircle,
      label: "Safe",
      className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
    },
    warning: {
      icon: AlertTriangle,
      label: "Warning",
      className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
    },
    dangerous: {
      icon: AlertTriangle,
      label: "Dangerous",
      className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
    }
  };

  return (
    <Card className="p-6" data-testid="card-prompt-sandbox">
      <h3 className="text-xl font-semibold mb-4">Prompt Security Sandbox</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Test your prompts for potential security vulnerabilities including injection attacks, jailbreaks, and data extraction attempts.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Input Prompt</label>
            <Textarea
              placeholder="Enter your AI prompt to test for security vulnerabilities..."
              className="min-h-[200px] font-mono text-sm resize-y"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              data-testid="input-prompt"
            />
          </div>
          <Button
            onClick={handleTest}
            disabled={!prompt.trim() || isLoading}
            className="w-full"
            data-testid="button-test-prompt"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Test Prompt
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium mb-2 block">Security Analysis</label>
          {result ? (
            <div className="space-y-4 p-4 rounded-lg bg-muted/50 min-h-[200px]" data-testid="panel-test-results">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {(() => {
                    const StatusIcon = statusConfig[result.status].icon;
                    return <StatusIcon className="h-5 w-5" />;
                  })()}
                  <span className="font-semibold">Security Status</span>
                </div>
                <Badge className={`${statusConfig[result.status].className} border`}>
                  {statusConfig[result.status].label}
                </Badge>
              </div>

              {result.threats.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Detected Threats:</p>
                  <ul className="space-y-1">
                    {result.threats.map((threat, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{threat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium">Analysis:</p>
                <p className="text-sm text-muted-foreground">{result.analysis}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Confidence: {result.confidence}%</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-12 rounded-lg bg-muted/50 min-h-[200px]">
              <p className="text-sm text-muted-foreground">Enter a prompt and click "Test Prompt" to see results</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
