import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolioConfig } from "@/hooks/usePortfolioConfig";

export const Education = () => {
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {[...Array(2)].map((_, i) => (
                <div key={i}>
                  <div className="h-6 bg-muted rounded w-32 mb-8"></div>
                  <div className="space-y-6">
                    {[...Array(2)].map((_, j) => (
                      <Card key={j} className="bg-gradient-card border-border/40">
                        <CardContent className="pt-6">
                          <div className="space-y-2">
                            <div className="h-6 bg-muted rounded w-40"></div>
                            <div className="h-4 bg-muted/50 rounded w-32"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    return null;
  }

  const education = config.education.degrees;
  const certifications = config.education.certifications;

  const sortedCertifications = [...certifications].sort((a, b) => {
    const parseDate = (dateStr: string) => {
      const [month, year] = dateStr.split(' ');
      const monthMap: { [key: string]: number } = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      return new Date(parseInt(year), monthMap[month]);
    };
    
    return parseDate(b.date).getTime() - parseDate(a.date).getTime();
  });

  return (
    <section className="py-20 px-6 bg-secondary/5">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent animate-fade-in-down">
            Education & Certifications
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animate-delay-100">
            Continuous learning and professional development in modern technologies and best practices.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Education Section */}
          <div>
            <div className="flex items-center gap-3 mb-8 animate-fade-in-left animate-delay-200">
              <GraduationCap className="h-6 w-6 text-primary animate-float" />
              <h3 className="text-2xl font-bold text-foreground">Education</h3>
            </div>
            
            <div className="space-y-6">
              {education.map((edu, index) => (
                <Card 
                  key={edu.degree}
                  className="bg-gradient-card border-border/40 shadow-card hover:shadow-glow/20 transition-all duration-500 animate-slide-up hover:translate-x-1"
                  style={{ animationDelay: `${(index + 2) * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 hover:scale-110 transition-transform duration-300">
                        {edu.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">{edu.period}</span>
                    </div>
                    <CardTitle className="text-lg text-primary hover:text-accent transition-colors duration-300">
                      {edu.degree}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground hover:text-foreground transition-colors duration-300">{edu.institution}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Certifications Section */}
          <div>
            <div className="flex items-center gap-3 mb-8 animate-fade-in-right animate-delay-200">
              <Award className="h-6 w-6 text-primary animate-float" style={{ animationDelay: '0.5s' }} />
              <h3 className="text-2xl font-bold text-foreground">Certifications</h3>
            </div>
            
            <div className="space-y-4">
              {sortedCertifications.map((cert, index) => (
                <Card 
                  key={cert.title}
                  className="bg-gradient-card border-border/40 shadow-card hover:shadow-glow/20 transition-all duration-500 animate-slide-up hover:translate-x-1"
                  style={{ animationDelay: `${(index + 2) * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1 leading-tight hover:text-primary transition-colors duration-300">
                          {cert.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2 hover:text-foreground transition-colors duration-300">
                          {cert.provider} • {cert.date}
                        </p>
                      </div>
                      {cert.link && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-primary hover:text-primary hover:bg-primary/10 ml-2 hover:scale-110 transition-transform duration-300"
                          asChild
                        >
                          <a href={cert.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};