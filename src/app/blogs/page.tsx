"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Globe, ChevronDown, ChevronUp, Loader2, Calendar, Tag, Clock } from 'lucide-react';
import axios from 'axios';

// Language mapping for Indian languages
const languageToAWSCode = {
  EN: "en",
  HI: "hi",
  MR: "mr",
  GU: "gu",
  TA: "ta",
  KN: "kn",
  TE: "te",
  BN: "bn",
  ML: "ml",
  PA: "pa",
  OR: "or"
} as const;

type SupportedLanguage = keyof typeof languageToAWSCode;

const BlogDisplay = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBlogs, setExpandedBlogs] = useState<Record<string, boolean>>({});
  const [expandedTranslations, setExpandedTranslations] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/blog');
      console.log('Fetched Blogs:', response.data);
      setBlogs(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlog = (id: string) => {
    setExpandedBlogs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleTranslations = (id: string) => {
    setExpandedTranslations(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getLanguageLabel = (code: string) => {
    const languages = {
      EN: "English",
      HI: "Hindi",
      MR: "Marathi",
      GU: "Gujarati",
      TA: "Tamil",
      KN: "Kannada",
      TE: "Telugu",
      BN: "Bengali",
      ML: "Malayalam",
      PA: "Punjabi",
      OR: "Odia"
    };
    return languages[code as keyof typeof languages] || code;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        <p>{error}</p>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8">
        <p>No blogs available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Blog Posts</h1>
      
      <div className="grid gap-8">
        {blogs.map((blog: any) => (
          <Card key={blog.id} className="w-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <CardHeader 
              className="cursor-pointer hover:bg-primary/5 transition-colors duration-300" 
              onClick={() => toggleBlog(blog.id)}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-semibold text-primary">
                  {blog.title || 'Untitled Blog'}
                </CardTitle>
                {expandedBlogs[blog.id] ? 
                  <ChevronUp className="h-6 w-6 text-primary transition-transform duration-300" /> : 
                  <ChevronDown className="h-6 w-6 text-primary transition-transform duration-300" />
                }
              </div>
              <div className="flex items-center text-sm text-muted-foreground mt-2 space-x-4">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(blog.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </CardHeader>
            
            {expandedBlogs[blog.id] && (
              <CardContent className="space-y-6 transition-all duration-300 ease-in-out">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed">{blog.content}</p>
                  {blog.keywords && blog.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {blog.keywords.map((keyword: string, index: number) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium flex items-center"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {blog.translations?.length > 0 && (
                  <div className="mt-8">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTranslations(blog.id);
                      }}
                      className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-300"
                    >
                      <Globe className="h-5 w-5" />
                      {expandedTranslations[blog.id] ? 'Hide' : 'Show'} Translations ({blog.translations.length})
                    </button>
                    
                    {expandedTranslations[blog.id] && (
                      <div className="mt-6 grid gap-6 transition-all duration-300 ease-in-out">
                        {blog.translations.map((translation: any) => (
                          <Card 
                            key={translation.language} 
                            className="bg-secondary/10 border-l-4 border-primary overflow-hidden"
                          >
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg flex items-center gap-2 text-primary">
                                <Globe className="h-5 w-5" />
                                {getLanguageLabel(translation.language)} - {translation.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {translation.content}
                              </p>
                              <div className="text-xs text-muted-foreground mt-4 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Last updated: {new Date(translation.updatedAt).toLocaleString()}
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
        ))}
      </div>
    </div>
  );
};

export default BlogDisplay;

