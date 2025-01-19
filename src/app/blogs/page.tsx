"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Globe, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
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
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
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
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      
      <div className="grid gap-6">
        {blogs.map((blog: any) => (
          <Card key={blog.id} className="w-full shadow-md hover:shadow-lg transition-shadow">
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" 
              onClick={() => toggleBlog(blog.id)}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">
                  {blog.title || 'Untitled Blog'}
                </CardTitle>
                {expandedBlogs[blog.id] ? 
                  <ChevronUp className="h-6 w-6 text-gray-500" /> : 
                  <ChevronDown className="h-6 w-6 text-gray-500" />
                }
              </div>
              <div className="text-sm text-gray-500">
                Created: {new Date(blog.createdAt).toLocaleDateString()}
              </div>
            </CardHeader>
            
            {expandedBlogs[blog.id] && (
              <CardContent className="space-y-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p>{blog.content}</p>
                  {blog.keywords && blog.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {blog.keywords.map((keyword: string, index: number) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {blog.translations?.length > 0 && (
                  <div className="mt-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTranslations(blog.id);
                      }}
                      className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      {expandedTranslations[blog.id] ? 'Hide' : 'Show'} Translations ({blog.translations.length})
                    </button>
                    
                    {expandedTranslations[blog.id] && (
                      <div className="mt-4 grid gap-4">
                        {blog.translations.map((translation: any) => (
                          <Card 
                            key={translation.language} 
                            className="bg-gray-50 dark:bg-gray-800 border-l-4 border-blue-500"
                          >
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                {getLanguageLabel(translation.language)} - {translation.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {translation.content}
                              </p>
                              <div className="text-xs text-gray-500 mt-2">
                                Last updated: {new Date(translation.updatedAt).toLocaleDateString()}
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