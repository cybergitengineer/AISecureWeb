import { StatCard } from '../StatCard';
import { Shield, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      <StatCard
        title="Total Scans"
        value="1,284"
        icon={Activity}
        trend={{ value: 12, label: 'from last month' }}
      />
      <StatCard
        title="Vulnerabilities Found"
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
      <StatCard
        title="Issues Resolved"
        value="156"
        icon={CheckCircle}
        description="This month"
      />
    </div>
  );
}
