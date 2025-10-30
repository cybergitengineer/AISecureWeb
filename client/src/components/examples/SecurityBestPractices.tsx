import { SecurityBestPractices } from '../SecurityBestPractices';

export default function SecurityBestPracticesExample() {
  const mockPractices = [
    {
      id: "practice-1",
      title: "Implement input validation and sanitization",
      description: "Always validate and sanitize user inputs before passing them to AI models to prevent injection attacks and malicious payloads.",
      importance: "critical" as const,
      implemented: true
    },
    {
      id: "practice-2",
      title: "Use rate limiting on AI API endpoints",
      description: "Implement rate limiting to prevent abuse, DoS attacks, and excessive API costs from malicious actors.",
      importance: "critical" as const,
      implemented: true
    },
    {
      id: "practice-3",
      title: "Monitor and log all AI interactions",
      description: "Maintain comprehensive logs of AI interactions for auditing, debugging, and detecting anomalous behavior patterns.",
      importance: "recommended" as const,
      implemented: false
    },
    {
      id: "practice-4",
      title: "Implement output filtering for sensitive data",
      description: "Scan AI outputs for PII, credentials, and other sensitive information before displaying to users.",
      importance: "critical" as const,
      implemented: true
    },
    {
      id: "practice-5",
      title: "Regular security assessments and penetration testing",
      description: "Conduct periodic security audits and red-team exercises to identify vulnerabilities in your AI systems.",
      importance: "recommended" as const,
      implemented: false
    },
    {
      id: "practice-6",
      title: "Use model versioning and rollback capabilities",
      description: "Maintain version control for AI models to quickly rollback if security issues are discovered.",
      importance: "optional" as const,
      implemented: true
    }
  ];

  return (
    <div className="p-6">
      <SecurityBestPractices practices={mockPractices} />
    </div>
  );
}
