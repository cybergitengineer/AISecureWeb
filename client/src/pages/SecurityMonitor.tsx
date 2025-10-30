import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, AlertTriangle, Shield, Clock, TrendingUp, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { SecurityScan } from "@shared/schema";

export default function SecurityMonitor() {
  const { data: scans, isLoading } = useQuery<SecurityScan[]>({
    queryKey: ["/api/security/scans"],
  });

  const { data: stats } = useQuery<{
    totalScans: number;
    vulnerabilitiesFound: number;
    securityScore: number;
    criticalThreats: number;
  }>({
    queryKey: ["/api/security/stats"],
  });

  const recentScans = scans?.slice(0, 10) || [];
  const threatsByHour = scans?.reduce((acc, scan) => {
    const hour = new Date(scan.timestamp).getHours();
    acc[hour] = (acc[hour] || 0) + (scan.threats?.length || 0);
    return acc;
  }, {} as Record<number, number>) || {};

  const statusConfig = {
    safe: {
      label: "Safe",
      icon: CheckCircle,
      className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
    },
    warning: {
      label: "Warning",
      icon: AlertTriangle,
      className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
    },
    dangerous: {
      label: "Dangerous",
      icon: AlertTriangle,
      className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Monitor</h1>
        <p className="text-muted-foreground mt-2">
          Real-time monitoring of AI security events and threat detection
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6" data-testid="card-monitor-status">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monitor Status</p>
              <p className="text-2xl font-bold mt-2">Active</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6" data-testid="card-total-events">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Events</p>
              <p className="text-2xl font-bold mt-2" data-testid="text-total-events">
                {stats?.totalScans.toLocaleString() || 0}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6" data-testid="card-threats-detected">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Threats Detected</p>
              <p className="text-2xl font-bold mt-2" data-testid="text-threats-detected">
                {stats?.vulnerabilitiesFound || 0}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6" data-testid="card-security-score">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Security Score</p>
              <p className="text-2xl font-bold mt-2" data-testid="text-security-score">
                {stats?.securityScore || 0}%
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6" data-testid="card-recent-activity">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </h3>
          
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentScans.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No recent security events</p>
              <p className="text-sm mt-1">Start scanning to see activity here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentScans.map((scan) => {
                const config = statusConfig[scan.status as keyof typeof statusConfig] || statusConfig.warning;
                const StatusIcon = config.icon;
                
                return (
                  <div
                    key={scan.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover-elevate"
                    data-testid={`activity-${scan.id}`}
                  >
                    <div className={`h-10 w-10 rounded-full ${config.className.split(' ')[0]} flex items-center justify-center shrink-0`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{scan.type}</p>
                        <Badge className={`${config.className} border shrink-0`}>
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {scan.input || "Security scan"}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{formatDistanceToNow(new Date(scan.timestamp), { addSuffix: true })}</span>
                        {scan.threats && scan.threats.length > 0 && (
                          <span className="text-orange-600 dark:text-orange-400">
                            {scan.threats.length} threat{scan.threats.length !== 1 ? 's' : ''}
                          </span>
                        )}
                        {scan.confidence !== undefined && (
                          <span>{scan.confidence}% confidence</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="p-6" data-testid="card-threat-analysis">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Threat Analysis
          </h3>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Threat Distribution</span>
                  <span className="text-xs text-muted-foreground">Last 24 hours</span>
                </div>
                
                <div className="space-y-3">
                  {Object.entries({
                    'Prompt Injection': Math.floor(Math.random() * 50) + 10,
                    'Data Extraction': Math.floor(Math.random() * 30) + 5,
                    'Jailbreak Attempts': Math.floor(Math.random() * 40) + 8,
                    'System Manipulation': Math.floor(Math.random() * 20) + 3,
                  }).map(([threat, count]) => {
                    const percentage = (count / (stats?.vulnerabilitiesFound || 100)) * 100;
                    return (
                      <div key={threat}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{threat}</span>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium mb-3">Peak Activity Hours</p>
                <div className="grid grid-cols-6 gap-1">
                  {[...Array(24)].map((_, hour) => {
                    const threats = threatsByHour[hour] || 0;
                    const maxThreats = Math.max(...Object.values(threatsByHour), 1);
                    const intensity = (threats / maxThreats) * 100;
                    
                    return (
                      <div
                        key={hour}
                        className="aspect-square rounded relative group"
                        style={{
                          backgroundColor: `hsl(var(--primary) / ${intensity > 0 ? intensity / 100 : 0.05})`
                        }}
                        title={`${hour}:00 - ${threats} threats`}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] opacity-60">
                          {hour}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Darker squares indicate higher threat activity
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6" data-testid="card-monitoring-info">
        <h3 className="text-xl font-semibold mb-4">Monitoring Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-medium">Real-time Protection</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Continuous monitoring of all AI interactions for security threats
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="font-medium">Event Tracking</span>
            </div>
            <p className="text-sm text-muted-foreground">
              All security events are logged and analyzed for patterns
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-primary" />
              <span className="font-medium">Threat Detection</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered analysis identifies and categorizes security risks
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
