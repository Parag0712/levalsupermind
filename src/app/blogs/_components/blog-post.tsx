import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, ChevronDown, ChevronUp, Calendar, Tag } from "lucide-react";

interface BlogPostProps {
  blog: any;
  getLanguageLabel: (code: string) => string;
}

const BlogPost = ({ blog, getLanguageLabel }: BlogPostProps) => {
  const [expanded, setExpanded] = useState(false);
  const [expandedTranslations, setExpandedTranslations] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);
  const toggleTranslations = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTranslations(!expandedTranslations);
  };

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
      <CardHeader
        className="cursor-pointer bg-gradient-to-r from-primary to-primary-foreground text-white p-6"
        onClick={toggleExpanded}
      >
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            {blog.title || "Untitled Blog"}
          </CardTitle>
          {expanded ? (
            <ChevronUp className="h-6 w-6" />
          ) : (
            <ChevronDown className="h-6 w-6" />
          )}
        </div>
        <div className="flex items-center mt-2 text-sm opacity-80">
          <Calendar className="h-4 w-4 mr-2" />
          {new Date(blog.createdAt).toLocaleDateString()}
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="p-6 space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed">{blog.content}</p>
            {blog.keywords && blog.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {blog.keywords.map((keyword: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm flex items-center"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>

          {blog.translations?.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <Button
                onClick={toggleTranslations}
                variant="outline"
                className="w-full justify-between"
              >
                <span className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  {expandedTranslations ? "Hide" : "Show"} Translations
                </span>
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                  {blog.translations.length}
                </span>
              </Button>

              {expandedTranslations && (
                <div className="mt-4 space-y-4">
                  {blog.translations.map((translation: any) => (
                    <Card
                      key={translation.language}
                      className="bg-secondary/10 border-l-4 border-primary"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Globe className="h-4 w-4 mr-2" />
                          {getLanguageLabel(translation.language)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-semibold mb-2">
                          {translation.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {translation.content}
                        </p>
                        <div className="text-xs text-muted-foreground mt-2 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Last updated:{" "}
                          {new Date(translation.updatedAt).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default BlogPost;
