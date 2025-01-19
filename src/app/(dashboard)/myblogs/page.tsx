"use client";

import { useState } from "react";
import BlogGenerator from "./_components/BlogGenerator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [blog, setBlog] = useState<any>(null);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/v1/blog`);
      if (!response.ok) {
        throw new Error("Error fetching blog");
      }
      const blogData = await response.json();
      setBlog(blogData);
      console.log("Fetched Blog:", blogData);
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Blog Generator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Generate Blog</CardTitle>
          </CardHeader>
          <CardContent>
            <BlogGenerator />
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Fetched Blog</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchBlog} className="mb-4 w-full">
              Fetch Blog
            </Button>
            {blog ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">{blog.title}</h2>
                <p className="text-muted-foreground">{blog.description}</p>
                <div className="prose dark:prose-invert">{blog.content}</div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                No blog available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
