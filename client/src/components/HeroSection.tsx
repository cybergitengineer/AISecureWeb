import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Play } from "lucide-react";
import dashboardImage from "@assets/generated_images/AI_security_dashboard_mockup_ee6853e4.png";

export function HeroSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Enterprise-Grade AI Security</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                Secure Your AI
                <span className="block text-primary">Before It's Too Late</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Comprehensive security platform for AI applications. Detect vulnerabilities, prevent prompt injections, and ensure your models are protected against evolving threats.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="group" data-testid="button-start-scan">
                Start Security Scan
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="backdrop-blur-sm" data-testid="button-view-demo">
                <Play className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold">1,284</p>
                <p className="text-sm text-muted-foreground">Security Scans</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-3xl font-bold">47</p>
                <p className="text-sm text-muted-foreground">Models Protected</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-3xl font-bold">99.2%</p>
                <p className="text-sm text-muted-foreground">Threat Detection</p>
              </div>
            </div>
          </div>

          <div className="relative lg:block hidden">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border">
              <img
                src={dashboardImage}
                alt="AI Security Dashboard"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
