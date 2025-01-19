"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BlogGenerator from "../(dashboard)/myblogs/_components/BlogGenerator";
import axios from "axios";

export default function Home() {
  const [blog, setBlog] = useState<any>(null);

  // Fetch the blog data when the component mounts
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/v1/blog`);

        console.log("Fetched Blog:", response.data);

        // Update the state with the fetched blog data
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    // Call the function to fetch the blog when the page loads
    fetchBlog();
  }, []);

  return (
    <main className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blog ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{blog.content}</h2>
            <p className="text-muted-foreground">{blog.description}</p>
            <div className="prose dark:prose-invert">{blog.content}</div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No blog available</p>
        )}
      </div>
    </main>
  );
}
