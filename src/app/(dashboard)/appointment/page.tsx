import { Metadata } from "next";
import BlogGenerator from "./_components/BlogGenerator";

export const metadata: Metadata = {
  title: "Blog Generator",
  description: "Generate blog posts from prompts or uploaded files",
};

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Blog Generator</h1>
      <BlogGenerator />
    </main>
  );
}
