"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BlogGenerator() {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [generatedBlog, setGeneratedBlog] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement your blog generation logic here
    // For now, we'll just set a dummy response
    setGeneratedBlog(
      "This is a generated blog post based on your prompt or file."
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your blog prompt here..."
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="file">Upload File (optional)</Label>
        <Input
          id="file"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-1"
        />
      </div>
      <Button type="submit" className="w-full">
        Generate Blog
      </Button>
      {generatedBlog && (
        <div className="mt-4 p-4 bg-secondary rounded-md">
          <h3 className="text-lg font-semibold mb-2">Generated Blog:</h3>
          <p>{generatedBlog}</p>
        </div>
      )}
    </form>
  );
}
