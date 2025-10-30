import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Key, AlertTriangle, CheckCircle, Loader2, Server, Code } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SecurityResult {
  status: "safe" | "warning" | "dangerous";
  threats: string[];
  confidence: number;
  analysis: string;
}

export default function APISecurity() {
  const { toast } = useToast();

  // API Scanner state
  const [endpoint, setEndpoint] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResult, setApiResult] = useState<SecurityResult | null>(null);

  // API Key Scanner state
  const [keyInput, setKeyInput] = useState("");
  const [keyLoading, setKeyLoading] = useState(false);
  const [keyResult, setKeyResult] = useState<SecurityResult | null>(null);

  const handleAPIScan = async () => {
    setApiLoading(true);

    try {
      const response = await apiRequest<SecurityResult>("/api/security/scan-api", {
        method: "POST",
        body: JSON.stringify({ endpoint, method, headers, body }),
      });

      setApiResult(response);
      setApiLoading(false);

      // Invalidate caches for real-time updates
      queryClient.invalidateQueries({ queryKey: ["/api/security/scans"] }).catch(console.error);
      queryClient.invalidateQueries({ queryKey: ["/api/security/stats"] }).catch(console.error);
    } catch (error: any) {
      console.error('Error scanning API:', error);
      setApiLoading(false);
      toast({
        title: "Error",
        description: error.message || "Failed to scan API endpoint. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleKeyScan = async () => {
    setKeyLoading(true);

    try {
      const response = await apiRequest<SecurityResult>("/api/security/scan-api-key", {
        method: "POST",
        body: JSON.stringify({ input: keyInput }),
      });

      setKeyResult(response);
      setKeyLoading(false);

      // Invalidate caches for real-time updates
      queryClient.invalidateQueries({ queryKey: ["/api/security/scans"] }).catch(console.error);
      queryClient.invalidateQueries({ queryKey: ["/api/security/stats"] }).catch(console.error);
    } catch (error: any) {
      console.error('Error scanning for keys:', error);
      setKeyLoading(false);
      toast({
        title: "Error",
        description: error.message || "Failed to scan for API keys. Please try again.",
        variant: "destructive"
      });
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

  const renderResult = (result: SecurityResult | null) => {
    if (!result) {
      return (
        <div className="flex items-center justify-center p-12 rounded-lg bg-muted/50 min-h-[300px]">
          <p className="text-sm text-muted-foreground">Run a scan to see results</p>
        </div>
      );
    }

    const StatusIcon = statusConfig[result.status].icon;

    return (
      <div className="space-y-4 p-6 rounded-lg bg-muted/50 min-h-[300px]" data-testid="panel-security-results">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon className="h-5 w-5" />
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
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">API Security Testing</h1>
        <p className="text-muted-foreground">
          Scan REST APIs for vulnerabilities and detect exposed API keys in your code
        </p>
      </div>

      <Tabs defaultValue="api-scanner" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="api-scanner" data-testid="tab-api-scanner">
            <Server className="h-4 w-4 mr-2" />
            API Scanner
          </TabsTrigger>
          <TabsTrigger value="key-scanner" data-testid="tab-key-scanner">
            <Key className="h-4 w-4 mr-2" />
            API Key Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api-scanner" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">API Endpoint Security Scanner</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Test your REST API endpoints for common security vulnerabilities including authentication issues, injection attacks, and improper access controls.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">API Endpoint URL</label>
                  <Input
                    placeholder="https://api.example.com/users"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    data-testid="input-api-endpoint"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">HTTP Method</label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger data-testid="select-http-method">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Headers (Optional)</label>
                  <Textarea
                    placeholder="Authorization: Bearer token&#10;Content-Type: application/json"
                    className="font-mono text-sm resize-y"
                    rows={3}
                    value={headers}
                    onChange={(e) => setHeaders(e.target.value)}
                    data-testid="input-api-headers"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Request Body (Optional)</label>
                  <Textarea
                    placeholder='{"username": "test", "password": "pass123"}'
                    className="font-mono text-sm resize-y"
                    rows={3}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    data-testid="input-api-body"
                  />
                </div>

                <Button
                  onClick={handleAPIScan}
                  disabled={!endpoint.trim() || apiLoading}
                  className="w-full"
                  data-testid="button-scan-api"
                >
                  {apiLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Scan API Endpoint
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">Security Analysis</label>
                {renderResult(apiResult)}
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-muted/30">
            <h3 className="text-lg font-semibold mb-4">What We Check</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Authentication & Authorization</p>
                    <p className="text-xs text-muted-foreground">Missing or weak authentication headers</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Injection Vulnerabilities</p>
                    <p className="text-xs text-muted-foreground">SQL, NoSQL, and command injection risks</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Dangerous HTTP Methods</p>
                    <p className="text-xs text-muted-foreground">Insecure DELETE/PUT without auth</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Sensitive Data Exposure</p>
                    <p className="text-xs text-muted-foreground">Admin endpoints and internal APIs</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="key-scanner" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Key className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">API Key Security Scanner</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Scan your code, configuration files, or logs for exposed API keys and secrets. Detects keys from AWS, OpenAI, GitHub, Stripe, and more.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Code / Text to Scan</label>
                  <Textarea
                    placeholder="Paste your code, configuration files, or logs here...&#10;&#10;Example:&#10;const apiKey = 'sk-proj-abc123...'&#10;AWS_ACCESS_KEY_ID=AKIA..."
                    className="font-mono text-sm resize-y min-h-[300px]"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    data-testid="input-key-scan"
                  />
                </div>

                <Button
                  onClick={handleKeyScan}
                  disabled={!keyInput.trim() || keyLoading}
                  className="w-full"
                  data-testid="button-scan-keys"
                >
                  {keyLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Code className="h-4 w-4 mr-2" />
                      Scan for API Keys
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">Scan Results</label>
                {renderResult(keyResult)}
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-muted/30">
            <h3 className="text-lg font-semibold mb-4">Detected Key Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Cloud Providers</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• AWS Access Keys</li>
                  <li>• Google API Keys</li>
                  <li>• Azure Keys</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Development Services</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• GitHub Tokens</li>
                  <li>• GitLab Tokens</li>
                  <li>• NPM Tokens</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">AI & Payment APIs</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• OpenAI API Keys</li>
                  <li>• Stripe Keys</li>
                  <li>• Bearer Tokens</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
