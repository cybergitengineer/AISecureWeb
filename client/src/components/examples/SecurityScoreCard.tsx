import { SecurityScoreCard } from '../SecurityScoreCard';

export default function SecurityScoreCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      <SecurityScoreCard score={92} status="excellent" trend={5} />
      <SecurityScoreCard score={78} status="good" trend={2} label="Model Safety" />
      <SecurityScoreCard score={65} status="warning" trend={-3} label="Prompt Security" />
      <SecurityScoreCard score={42} status="critical" trend={-8} label="Vulnerability Score" />
    </div>
  );
}
