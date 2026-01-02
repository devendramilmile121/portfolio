import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePortfolioConfig } from "@/hooks/usePortfolioConfig";

export const Skills = () => {
  const { config, loading } = usePortfolioConfig();

  // Render skeleton while loading to prevent layout shift
  if (!config) {
    if (loading) {
      return (
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <div className="h-10 bg-gradient-primary/20 rounded-lg mx-auto w-40 mb-6"></div>
              <div className="h-6 bg-muted rounded-lg mx-auto w-96"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-gradient-card border-border/40">
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded w-20 mb-4"></div>
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

  const skillCategories = config.skills.categories;
  const skillsDescription = config.skills.description;

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent animate-fade-in-down">
            Technical Skills
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animate-delay-100">
            {skillsDescription}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <Card 
              key={category.title}
              className="bg-gradient-card border-border/40 shadow-card hover:shadow-glow/20 transition-all duration-500 transform hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-primary">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <Badge 
                      key={skill}
                      variant="secondary" 
                      className="bg-secondary/20 text-secondary-foreground border border-secondary/30 hover:bg-secondary/30 transition-all duration-300 hover:scale-110 hover:shadow-glow/30"
                      style={{ animationDelay: `${(index * 100) + (skillIndex * 30)}ms` }}
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