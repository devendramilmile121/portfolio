import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend",
      skills: ["Angular", "TypeScript", "HTML5", "CSS/SCSS", "React JS", "Angular Material", "PrimeNG"]
    },
    {
      title: "Backend", 
      skills: [".NET Core", "C#", "Entity Framework", "YARP", "Microservices", "RESTful APIs"]
    },
    {
      title: "Database",
      skills: ["SQL Server", "Database Design", "Performance Optimization"]
    },
    {
      title: "Cloud & DevOps",
      skills: ["Azure", "AWS", "CI/CD", "GitHub Actions", "Docker"]
    },
    {
      title: "Tools & Libraries",
      skills: ["AmCharts5", "Survey.js", "Angular Gridster2", "JWT Authentication", "Swagger"]
    },
    {
      title: "Methodologies",
      skills: ["Agile", "Scrum", "Code Reviews", "Team Leadership", "Client Communication"]
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Technical Skills
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive expertise across the full development stack with modern technologies and best practices.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <Card 
              key={category.title}
              className="bg-gradient-card border-border/40 shadow-card hover:shadow-glow/20 transition-all duration-500 transform hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-primary">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <Badge 
                      key={skill}
                      variant="secondary" 
                      className="bg-secondary/20 text-secondary-foreground border border-secondary/30 hover:bg-secondary/30 transition-colors duration-300"
                    >
                      {skill}
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