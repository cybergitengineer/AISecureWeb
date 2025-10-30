import { SecurityScoreCard } from "@/components/SecurityScoreCard";
import { StatCard } from "@/components/StatCard";
import { VulnerabilityTable } from "@/components/VulnerabilityTable";
import { Shield, AlertTriangle, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Vulnerability {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  model?: string;
  timestamp: string;
}

interface SecurityStats {
  totalScans: number;
  vulnerabilitiesFound: number;
  modelsProtected: number;
  issuesResolved: number;
}

export default function Dashboard() {
  const { toast } = useToast();

  const { data: stats, isLoading: statsLoading } = useQuery<SecurityStats>({
    queryKey: ["/api/security/stats"],
  });

  const { data: vulnerabilities = [], isLoading: vulnsLoading } = useQuery<Vulnerability[]>({
    queryKey: ["/api/vulnerabilities"],
  });

  const handleDeleteVulnerability = async (id: string) => {
    try {
      await apiRequest<{ success: boolean }>(`/api/vulnerabilities/${id}`, {
        method: "DELETE",
      });
      
      await queryClient.invalidateQueries({ queryKey: ["/api/vulnerabilities"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/security/stats"] });
      
      toast({
        title: "Success",
        description: "Vulnerability marked as resolved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete vulnerability",
        variant: "destructive"
      });
    }
  };

  // Calculate security score based on vulnerabilities
  const calculateSecurityScore = () => {
    if (!vulnerabilities.length) return { score: 92, status: "excellent" as const };
    
    const criticalCount = vulnerabilities.filter(v => v.severity === "critical").length;
    const highCount = vulnerabilities.filter(v => v.severity === "high").length;
    
    if (criticalCount > 2) return { score: 42, status: "critical" as const };
    if (criticalCount > 0 || highCount > 3) return { score: 65, status: "warning" as const };
    if (highCount > 0) return { score: 78, status: "good" as const };
    return { score: 92, status: "excellent" as const };
  };

  const { score, status } = calculateSecurityScore();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage your AI security posture
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SecurityScoreCard score={score} status={status} trend={5} />
        <StatCard
          title="Total Scans"
          value={statsLoading ? "..." : stats?.totalScans.toLocaleString() || "0"}
          icon={Activity}
          trend={{ value: 12, label: 'from last month' }}
        />
        <StatCard
          title="Vulnerabilities"
          value={statsLoading ? "..." : stats?.vulnerabilitiesFound.toString() || "0"}
          icon={AlertTriangle}
          trend={{ value: -18, label: 'from last month' }}
        />
        <StatCard
          title="Models Protected"
          value={statsLoading ? "..." : stats?.modelsProtected.toString() || "0"}
          icon={Shield}
          trend={{ value: 8, label: 'from last month' }}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Vulnerabilities</h2>
        {vulnsLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <VulnerabilityTable
            vulnerabilities={vulnerabilities}
            onDelete={handleDeleteVulnerability}
          />
        )}
      </div>
    </div>
  );
}
