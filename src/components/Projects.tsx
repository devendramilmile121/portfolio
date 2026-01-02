import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Calendar } from "lucide-react";
import { usePortfolioConfig } from "@/hooks/usePortfolioConfig";

export const Projects = () => {
  const { config, loading } = usePortfolioConfig();

  // Render skeleton while loading
  if (!config) {
    if (loading) {
      return (
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="h-10 bg-gradient-primary/20 rounded-lg mx-auto w-40 mb-6"></div>
              <div className="h-6 bg-muted rounded-lg mx-auto w-96"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-gradient-card border-border/40">
                  <CardHeader>
                    <div className="space-y-2 mb-3">
                      <div className="h-6 bg-muted rounded w-32"></div>
                      <div className="h-20 bg-muted/30 rounded"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {[...Array(3)].map((_, j) => (
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

  const projects = config.projects;

  // Don't render if no projects exist
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent animate-fade-in-down">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animate-delay-100">
            Showcase of impactful projects spanning enterprise platforms, open source contributions, and innovative solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={project.title}
              className="bg-gradient-card border-border/40 shadow-card hover:shadow-glow/20 transition-all duration-500 transform hover:scale-[1.02] animate-bounce-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-4">
                  <Badge variant="outline" className="border-accent/30 text-accent bg-accent/5 text-xs px-2 py-1 w-fit hover:scale-110 transition-transform duration-300">
                    {project.type}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                    <Calendar className="h-4 w-4 animate-pulse" />
                    {project.period}
                  </div>
                </div>
                
                <CardTitle className="text-xl md:text-2xl text-primary mb-3 hover:text-accent transition-colors duration-300">
                  {project.title}
                </CardTitle>
                
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">Key Achievements:</h4>
                  <ul className="space-y-2">
                    {project.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-muted-foreground flex items-start gap-2 hover:translate-x-1 transition-transform duration-300">
                        <span className="text-primary mt-1 text-xs animate-pulse-slow">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge 
                        key={tech}
                        variant="secondary" 
                        className="bg-secondary/20 text-secondary-foreground border border-secondary/30 text-xs px-2 py-1 hover:scale-110 hover:shadow-glow/30 transition-all duration-300 cursor-pointer"
                        style={{ animationDelay: `${(index * 150) + (techIndex * 50)}ms` }}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {project.links && (
                  <div className="flex gap-3">
                    {project.links.github && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-primary/30 hover:border-primary hover:bg-primary/10"
                        asChild
                      >
                        <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {project.links.npm && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-primary/30 hover:border-primary hover:bg-primary/10"
                        asChild
                      >
                        <a href={project.links.npm} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          NPM
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};