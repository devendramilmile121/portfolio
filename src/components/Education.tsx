import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolioConfig } from "@/hooks/usePortfolioConfig";

export const Education = () => {
  const { config, loading } = usePortfolioConfig();

  if (loading || !config) return null;

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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Education & Certifications
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Continuous learning and professional development in modern technologies and best practices.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Education Section */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Education</h3>
            </div>
            
            <div className="space-y-6">
              {education.map((edu, index) => (
                <Card 
                  key={edu.degree}
                  className="bg-gradient-card border-border/40 shadow-card hover:shadow-glow/20 transition-all duration-500"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                        {edu.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{edu.period}</span>
                    </div>
                    <CardTitle className="text-lg text-primary">
                      {edu.degree}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{edu.institution}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Certifications Section */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Award className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Certifications</h3>
            </div>
            
            <div className="space-y-4">
              {sortedCertifications.map((cert, index) => (
                <Card 
                  key={cert.title}
                  className="bg-gradient-card border-border/40 shadow-card hover:shadow-glow/20 transition-all duration-500"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1 leading-tight">
                          {cert.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {cert.provider} • {cert.date}
                        </p>
                      </div>
                      {cert.link && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-primary hover:text-primary hover:bg-primary/10 ml-2"
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