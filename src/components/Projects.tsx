import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Calendar } from "lucide-react";

export const Projects = () => {
  const projects = [
    {
      title: "CLARIO - Public API Platform",
      period: "Dec 2024 - Present",
      description: "Developed a Public API using .NET 8 with YARP reverse proxy, enabling efficient routing and service composition. Built notification rule engine and Expression Designer Library for dynamic trigger creation.",
      highlights: [
        "Custom Swagger UI for improved API documentation",
        "Notification rule engine with micro frontend architecture",
        "Expression Designer Library with visual editor",
        "YARP reverse proxy implementation"
      ],
      technologies: [".NET 8", "YARP", "Micro Frontend", "Swagger", "API Design"],
      type: "Enterprise Platform"
    },
    {
      title: "UNIDO DIPS",
      period: "Sep 2021 - Nov 2024",
      description: "Full-stack web application with comprehensive features including multi-language support, external surveys, and JWT authentication. Led a team of 3 developers and 1 QA.",
      highlights: [
        "Multi-language support implementation",
        "Survey.js integration for external surveys",
        "JWT authentication in web APIs",
        "Team leadership and project delivery"
      ],
      technologies: ["Angular", ".NET Core", "Survey.js", "JWT", "Multi-language"],
      type: "Enterprise Application"
    },
    {
      title: "SymphonyAI Platform",
      period: "Jan 2022 - Oct 2024",
      description: "Angular library project for reusable components and navigation system across SymphonyAI products. Built drag-and-drop dashboard with configurable charts.",
      highlights: [
        "25% increase in customer engagement",
        "Drag-and-drop dashboard using Angular Gridster2",
        "Configurable charts with AmCharts5",
        "Dynamic menu system with JSON configuration"
      ],
      technologies: ["Angular", "Angular Gridster2", "AmCharts5", "TypeScript", "Library Development"],
      type: "Product Platform"
    },
    {
      title: "ngx-custom-carousel",
      period: "Apr 2024 - Present",
      description: "Open source Angular carousel component with custom template rendering. Features semantic versioning and automated CI/CD pipeline.",
      highlights: [
        "Published to NPM repository",
        "Semantic versioning implementation",
        "CI/CD with GitHub Actions",
        "Custom Angular template rendering"
      ],
      technologies: ["Angular", "NPM", "GitHub Actions", "TypeScript", "Open Source"],
      type: "Open Source",
      links: {
        npm: "https://www.npmjs.com/package/ngx-custom-carousel",
        github: "https://github.com/devendramilmile/ngx-custom-carousel"
      }
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Showcase of impactful projects spanning enterprise platforms, open source contributions, and innovative solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={project.title}
              className="bg-gradient-card border-border/40 shadow-card hover:shadow-glow/20 transition-all duration-500 transform hover:scale-[1.02]"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className="border-accent/30 text-accent bg-accent/5">
                    {project.type}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {project.period}
                  </div>
                </div>
                
                <CardTitle className="text-xl md:text-2xl text-primary mb-3">
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
                      <li key={idx} className="text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-2 text-xs">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <Badge 
                      key={tech}
                      variant="secondary" 
                      className="bg-secondary/20 text-secondary-foreground border border-secondary/30"
                    >
                      {tech}
                    </Badge>
                  ))}
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