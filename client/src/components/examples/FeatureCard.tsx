import { FeatureCard } from '../FeatureCard';
import { Shield, AlertTriangle, FileText, Activity, Lock, Search } from 'lucide-react';

export default function FeatureCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <FeatureCard
        icon={Shield}
        title="Vulnerability Detection"
        description="Automatically scan AI models for common security vulnerabilities and exploitation vectors."
      />
      <FeatureCard
        icon={AlertTriangle}
        title="Prompt Injection Analysis"
        description="Detect and prevent prompt injection attacks that could compromise your AI systems."
      />
      <FeatureCard
        icon={Lock}
        title="Model Security Testing"
        description="Comprehensive testing for jailbreaks, data extraction, and unauthorized access attempts."
      />
      <FeatureCard
        icon={FileText}
        title="Best Practices Guide"
        description="Access detailed guidelines and recommendations for securing AI deployments."
      />
      <FeatureCard
        icon={Activity}
        title="Real-time Monitoring"
        description="Continuous monitoring of AI interactions with instant threat detection and alerts."
      />
      <FeatureCard
        icon={Search}
        title="Output Safety Checker"
        description="Scan model outputs for harmful content, bias, and personally identifiable information."
      />
    </div>
  );
}
