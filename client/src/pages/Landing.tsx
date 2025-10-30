import { HeroSection } from "@/components/HeroSection";
import { FeatureCard } from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, FileText, Activity, Lock, Search, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import conceptImage from "@assets/generated_images/AI_security_concept_visualization_130fb464.png";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <HeroSection />

      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Comprehensive AI Security Suite</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Protect your AI applications with our complete security platform covering all attack vectors and vulnerabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src={conceptImage}
                alt="AI Security Visualization"
                className="w-full h-auto rounded-xl shadow-lg border border-border"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="text-4xl font-bold">Advanced Threat Protection</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our platform uses cutting-edge techniques to identify and mitigate AI-specific security threats before they impact your applications.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time prompt injection detection",
                  "Automated vulnerability scanning",
                  "PII and sensitive data filtering",
                  "Comprehensive security reporting"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/">
                <Button size="lg" className="group">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to Secure Your AI?</h2>
          <p className="text-xl text-muted-foreground">
            Start protecting your AI applications today with our comprehensive security platform
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/">
              <Button size="lg" data-testid="button-cta-start">
                Start Free Scan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/best-practices">
              <Button size="lg" variant="outline" data-testid="button-cta-learn">
                Learn Best Practices
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
