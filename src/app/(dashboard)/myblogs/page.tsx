import { Metadata } from "next";
import { useState } from "react";
import BlogGenerator from "./_components/BlogGenerator";

export const metadata: Metadata = {
  title: "Blog Generator",
  description: "Generate blog posts from prompts or uploaded files",
};

export default function Home() {
  const [blog, setBlog] = useState<any>(null); // State to store the fetched blog

  const fetchBlog = async () => {
    try {
      // Call the /blog API endpoint without any filters
      const response = await fetch(`/api/v1/blog`);

      if (!response.ok) {
        throw new Error("Error fetching blog");
      }

      // Parse the response and set the blog data
      const blogData = await response.json();
      setBlog(blogData);
      console.log("Fetched Blog:", blogData);
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Blog Generator</h1>

      {/* Button to fetch blog */}
      <button
        onClick={fetchBlog}g
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Fetch Blog
      </button>

      {/* Display Blog Generator and fetched blog content */}
      <BlogGenerator />
      <div className="mt-8">
        {blog ? (
          <div>
            <h2 className="text-2xl font-semibold">{blog.title}</h2>
            <p>{blog.description}</p>
            <div>{blog.content}</div>
          </div>
        ) : (
          <p>No blog available</p>
        )}
      </div>
    </main>
  );
}
