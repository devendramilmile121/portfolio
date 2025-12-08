import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin } from "lucide-react";
import { usePortfolioConfig } from "@/hooks/usePortfolioConfig";

export const Experience = () => {
  const { config, loading } = usePortfolioConfig();

  // Render skeleton while loading
  if (!config) {
    if (loading) {
      return (
        <section className="py-20 px-6 bg-secondary/5">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="h-10 bg-gradient-primary/20 rounded-lg mx-auto w-40 mb-6"></div>
              <div className="h-6 bg-muted rounded-lg mx-auto w-96"></div>
            </div>
            <div className="space-y-8">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="bg-gradient-card border-border/40">
                  <CardHeader>
                    <div className="space-y-2">
                      <div className="h-6 bg-muted rounded w-40"></div>
                      <div className="h-5 bg-muted/50 rounded w-32"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-4 bg-muted/30 rounded"></div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="h-6 bg-muted/50 rounded px-3"></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      );
    }
    return null;
  }

  const experiences = config.experience;

  return (
    <section className="py-20 px-6 bg-secondary/5">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent animate-fade-in-down">
            Professional Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animate-delay-100">
            6 years of professional growth across leading technology companies, delivering scalable solutions.
          </p>
        </div>
        
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <Card 
              key={exp.company}
              className="bg-gradient-card border-border/40 shadow-card hover:shadow-glow/20 transition-all duration-500 animate-slide-up hover:translate-x-1"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl md:text-2xl text-primary mb-2">
                      {exp.role}
                    </CardTitle>
                    <h3 className="text-lg font-semibold text-foreground">
                      {exp.company}
                    </h3>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      {exp.period}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {exp.location}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {exp.description.map((item, idx) => (
                    <li key={idx} className="text-muted-foreground flex items-start gap-2 hover:translate-x-1 transition-transform duration-300">
                      <span className="text-primary mt-1 text-xs animate-pulse-slow">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, techIndex) => (
                    <Badge 
                      key={tech}
                      variant="outline" 
                      className="border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-all duration-300 hover:scale-110 hover:shadow-glow/30 cursor-pointer"
                      style={{ animationDelay: `${(index * 200) + (techIndex * 50)}ms` }}
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};