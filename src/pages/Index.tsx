
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileBox, Shield, Sparkles, BarChart4, Package, Bot, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingNav from "@/components/layout/LandingNav";
import { cn } from "@/lib/utils";
import FloatingChatButton from "@/components/ai/FloatingChatButton";

// Aceternity UI inspired components
const AnimatedBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-50 via-transparent to-blue-50 dark:from-blue-900/20 dark:via-transparent dark:to-blue-900/20" />
      <div className="absolute inset-0 h-full w-full bg-grid-black/[0.2] dark:bg-grid-white/[0.2]" />
      <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
      {children}
    </div>
  );
};

const SparkleBadge = ({ text }: { text: string }) => {
  return (
    <div className="relative inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-600 dark:text-blue-400 overflow-hidden">
      <span className="relative z-20 whitespace-nowrap">{text}</span>
      <span className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_30%_50%,rgba(129,140,248,0.2),transparent_50%)]" />
      <span className="absolute z-10 -left-2 -top-10 h-[400%] aspect-square rounded-full bg-gradient-to-tr from-blue-600 to-transparent opacity-30 blur-lg" />
    </div>
  );
};

const HoverGlowCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn(
      "group relative rounded-xl border border-white/20 bg-white/5 backdrop-blur-xl px-8 py-10 shadow-lg transition-all duration-500 hover:border-white/40 hover:shadow-blue-500/20",
      className
    )}>
      <div className="absolute inset-0 -z-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20 blur-xl" />
      {children}
    </div>
  );
};

const ScrollRevealContainer = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => {
  return (
    <div 
      className={cn("opacity-0", className)} 
      style={{ 
        transform: "translateY(20px)",
        animation: `fadeInUp 0.8s ease forwards ${delay}s` 
      }}
    >
      {children}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const Index = () => {
  return (
    <div className="font-sans">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        :root {
          --font-sans: 'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif;
        }
        
        html {
          font-family: var(--font-sans);
        }
      `}</style>
      
      <LandingNav />
      <FloatingChatButton />
      
      {/* Hero Section with Aceternity UI Inspired Animation */}
      <AnimatedBackground>
        <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
            <div className="flex-1">
              <SparkleBadge text="AI-Powered Pharmacy Management" />
              
              <ScrollRevealContainer delay={0.2}>
                <h1 className="text-5xl md:text-6xl font-bold mt-6 mb-6 leading-tight">
                  <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                    Next-Gen Pharmacy
                  </span>
                  <br />
                  <span className="text-foreground">
                    Inventory System
                  </span>
                </h1>
              </ScrollRevealContainer>
              
              <ScrollRevealContainer delay={0.4}>
                <p className="text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
                  Revolutionize your pharmacy operations with our AI-powered inventory management platform. 
                  Increase efficiency, reduce waste, and stay ahead with smart analytics and predictive insights.
                </p>
              </ScrollRevealContainer>
              
              <ScrollRevealContainer delay={0.6} className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-medium px-8 py-6 text-lg shadow-lg hover:shadow-xl">
                    Get started for free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="bg-white/5 backdrop-blur-sm font-medium border-white/10 hover:bg-white/10 px-8 py-6 text-lg">
                    Demo Login
                  </Button>
                </Link>
              </ScrollRevealContainer>
            </div>
            
            <ScrollRevealContainer delay={0.8} className="flex-1 relative">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl opacity-70 blur-lg"></div>
                <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-background/80 backdrop-blur-sm">
                  <img 
                    src="/lovable-uploads/21206511-7c47-44cf-893b-2a6de7d893fc.png" 
                    alt="PharmaLink Dashboard" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-medium">AI-Powered Insights</span>
                  </div>
                </div>
              </div>
            </ScrollRevealContainer>
          </div>

          {/* Features Section */}
          <ScrollRevealContainer className="mb-20" delay={1.0}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">Modern solutions</span> for modern pharmacies
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our comprehensive set of features helps you manage your inventory with intelligence and precision
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Package,
                  title: "Smart Inventory",
                  description: "AI-powered inventory tracking with automated reordering suggestions based on historical data and trends"
                },
                {
                  icon: Shield,
                  title: "Expiry Prevention",
                  description: "Proactively identify expiring products and optimize inventory to reduce waste and financial loss"
                },
                {
                  icon: BarChart4,
                  title: "Real-time Analytics",
                  description: "Live monitoring and predictive analytics that optimize stock levels across multiple locations"
                },
                {
                  icon: Bot,
                  title: "AI Assistant",
                  description: "Intelligent chatbot that provides insights, answers questions, and suggests optimization strategies"
                },
                {
                  icon: Sparkles,
                  title: "Smart Reports",
                  description: "Generate detailed business intelligence reports with actionable insights based on your inventory data"
                },
                {
                  icon: FileBox,
                  title: "Transfer Management",
                  description: "Seamlessly transfer inventory between locations with full tracking and audit capabilities"
                }
              ].map((feature, index) => (
                <HoverGlowCard key={index}>
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-600/20 to-violet-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </HoverGlowCard>
              ))}
            </div>
          </ScrollRevealContainer>
          
          {/* CTA Section */}
          <ScrollRevealContainer className="flex flex-col items-center mt-16" delay={1.2}>
            <div className="w-full max-w-5xl p-12 rounded-2xl bg-gradient-to-br from-blue-600/10 via-violet-500/5 to-transparent border border-white/10 backdrop-blur-md">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                  <h2 className="text-4xl font-bold mb-6">
                    Experience the future of pharmacy management
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                    Join innovative pharmacies using PharmaLink to streamline operations, reduce costs, and provide better customer service.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/signup">
                      <Button size="lg" className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-medium">
                        Try It Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" size="lg" className="bg-white/5 backdrop-blur-sm font-medium border-white/10 hover:bg-white/10">
                        Book a Demo
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Full-featured 30-day trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>AI-powered features included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Data migration assistance</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollRevealContainer>
          
          {/* Footer */}
          <div className="mt-20 pt-12 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <FileBox className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span className="text-xl font-bold">
                  PharmaLink
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} PharmaLink. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </AnimatedBackground>
    </div>
  );
};

export default Index;
