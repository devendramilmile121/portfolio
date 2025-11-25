import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, ArrowRight } from "lucide-react";
import { loadBlogs, BlogPost } from "@/data/blogs";
import { useScrollToTop } from "@/hooks/useScrollToTop";

export default function BlogList() {
  useScrollToTop();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogs().then((loadedBlogs) => {
      setBlogs(loadedBlogs);
      setFilteredBlogs(loadedBlogs);

      // Extract all unique tags
      const tags = new Set<string>();
      loadedBlogs.forEach((blog) => {
        blog.tags.forEach((tag) => tags.add(tag));
      });
      setAllTags(Array.from(tags).sort());
      setLoading(false);
    });
  }, []);

  // Filter blogs based on search query and selected tags
  useEffect(() => {
    let filtered = blogs;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          blog.summary.toLowerCase().includes(query) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by selected tags
    if (selectedTags.size > 0) {
      filtered = filtered.filter((blog) =>
        Array.from(selectedTags).some((tag) => blog.tags.includes(tag))
      );
    }

    setFilteredBlogs(filtered);
  }, [searchQuery, selectedTags, blogs]);

  const toggleTag = (tag: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setSelectedTags(newTags);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-primary-subtle">
      <Navigation />
      
      <div className="flex-1 py-20 px-6 pt-24">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent animate-fade-in-down pb-3">
              Blogs
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl animate-fade-in-up animate-delay-100">
              Insights on React, TypeScript, Full Stack Development, and Web Performance. Tips, tutorials, and best practices.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 animate-fade-in-up animate-delay-200">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search blogs by title, content, or tags..."
                className="pl-10 py-6 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tag Filters */}
          <div className="mb-8 animate-fade-in-up animate-delay-300">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Filter by tags:</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.has(tag) ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1.5 hover:scale-110 transition-transform duration-200"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog, index) => (
                <Card
                  key={blog.slug}
                  className="bg-card border-border/40 shadow-card hover:shadow-glow/20 hover:scale-[1.02] transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
                    </div>
                    <CardTitle className="text-xl hover:text-primary transition-colors duration-300">
                      {blog.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {blog.summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {blog.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Link to={`/blogs/${blog.slug}`}>
                      <Button variant="outline" size="sm" className="w-full group">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-muted-foreground text-lg">
                  No blogs found. Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-12 text-center text-muted-foreground">
            <p>
              Showing {filteredBlogs.length} of {blogs.length} blog
              {blogs.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
