"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Globe, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import axios from "axios";
import BlogPost from "./_components/blog-post";

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
  OR: "or",
} as const;

type SupportedLanguage = keyof typeof languageToAWSCode;

const BlogDisplay = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/blog");
      console.log("Fetched Blogs:", response.data);
      setBlogs(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
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
      OR: "Odia",
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

      <div className="space-y-12">
        {blogs.map((blog: any) => (
          <BlogPost
            key={blog.id}
            blog={blog}
            getLanguageLabel={getLanguageLabel}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogDisplay;
