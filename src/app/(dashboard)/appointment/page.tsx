import { Metadata } from "next";
import { useState } from "react";
import BlogGenerator from "./_components/BlogGenerator";
import { getBlogWithLanguageFilter } from "@/actions/getblog";
import { Language } from "@prisma/client";

export const metadata: Metadata = {
  title: "Blog Generator",
  description: "Generate blog posts from prompts or uploaded files",
};

export default function Home() {
  const [language, setLanguage] = useState<Language>("EN"); // Default language set to English

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as Language); // Set language based on user selection
  };

  const fetchBlog = async () => {
    try {
      const slug = "some-post-slug"; // Replace with actual slug
      const blog = await getBlogWithLanguageFilter(slug, language as Language);
      console.log("Fetched Blog:", blog);
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Blog Generator</h1>
      
      {/* Language Selector */}
      <select onChange={handleLanguageChange} className="mb-4">
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        {/* Add more languages as needed */}
      </select>

      {/* Call fetchBlog when needed */}
      <button onClick={fetchBlog} className="mb-4 p-2 bg-blue-500 text-white rounded">
        Fetch Blog
      </button>

      <BlogGenerator />
    </main>
  );
}
