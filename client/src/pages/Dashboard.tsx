import { SecurityScoreCard } from "@/components/SecurityScoreCard";
import { StatCard } from "@/components/StatCard";
import { VulnerabilityTable } from "@/components/VulnerabilityTable";
import { Shield, AlertTriangle, CheckCircle, Activity } from "lucide-react";

export default function Dashboard() {
  const mockVulnerabilities = [
    {
      id: "vuln-1",
      title: "Prompt injection vulnerability detected",
      severity: "critical" as const,
      category: "Prompt Security",
      model: "gpt-4",
      timestamp: "2 hours ago"
    },
    {
      id: "vuln-2",
      title: "PII exposure in model responses",
      severity: "high" as const,
      category: "Data Privacy",
      model: "claude-3",
      timestamp: "5 hours ago"
    },
    {
      id: "vuln-3",
      title: "Insufficient input validation",
      severity: "medium" as const,
      category: "Input Security",
      model: "gpt-3.5",
      timestamp: "1 day ago"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage your AI security posture
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SecurityScoreCard score={92} status="excellent" trend={5} />
        <StatCard
          title="Total Scans"
          value="1,284"
          icon={Activity}
          trend={{ value: 12, label: 'from last month' }}
        />
        <StatCard
          title="Vulnerabilities"
          value="23"
          icon={AlertTriangle}
          trend={{ value: -18, label: 'from last month' }}
        />
        <StatCard
          title="Models Protected"
          value="47"
          icon={Shield}
          trend={{ value: 8, label: 'from last month' }}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Vulnerabilities</h2>
        <VulnerabilityTable
          vulnerabilities={mockVulnerabilities}
          onViewDetails={(id) => console.log('View details:', id)}
        />
      </div>
    </div>
  );
}
