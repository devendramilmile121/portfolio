import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from "lucide-react";
import { usePortfolioConfig } from "@/hooks/usePortfolioConfig";

export const Contact = () => {
  const { config, loading } = usePortfolioConfig();

  if (loading || !config) return null;

  const contactData = config.contact;

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'mail':
        return Mail;
      case 'phone':
        return Phone;
      case 'mapPin':
        return MapPin;
      case 'github':
        return Github;
      case 'linkedin':
        return Linkedin;
      case 'externalLink':
        return ExternalLink;
      default:
        return Mail;
    }
  };

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            {contactData.heading}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {contactData.description}
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-8">Get In Touch</h3>
              
              <div className="space-y-6">
                {contactData.info.map((contact) => {
                  const IconComponent = getIconComponent(contact.icon);
                  const content = (
                    <Card className="bg-gradient-card border-border/40 shadow-card hover:shadow-glow/20 transition-all duration-500 transform hover:scale-105">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 p-3 rounded-lg">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{contact.label}</p>
                            <p className="font-semibold text-foreground">{contact.value}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                  
                  return contact.link ? (
                    <a key={contact.label} href={contact.link} className="block">
                      {content}
                    </a>
                  ) : (
                    <div key={contact.label}>
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Social Links & Professional Profiles */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-8">Professional Profiles</h3>
              
              <div className="space-y-6">
                {contactData.social.map((social) => {
                  const IconComponent = getIconComponent(social.icon);
                  return (
                    <Card 
                      key={social.label}
                      className="bg-gradient-card border-border/40 shadow-card hover:shadow-glow/20 transition-all duration-500 transform hover:scale-105"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{social.label}</p>
                              <p className="text-sm text-muted-foreground">@{social.username}</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-primary/30 hover:border-primary hover:bg-primary/10"
                            asChild
                          >
                            <a href={social.url} target="_blank" rel="noopener noreferrer">
                              Visit
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {/* CTA Button */}
              <div className="mt-8">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-primary border-0 shadow-glow hover:shadow-glow/50 transition-all duration-300"
                  asChild
                >
                  <a href="mailto:milmiledh@gmail.com">
                    <Mail className="mr-2 h-5 w-5" />
                    Send Message
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};