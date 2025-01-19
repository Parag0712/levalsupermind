import Image from "next/image";

interface BlogPostProps {
  blog: {
    title: string;
    content: string;
    author: string;
    date: string;
    image?: string;
  };
}

export default function BlogPost({ blog }: BlogPostProps) {
  return (
    <article className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <div className="flex items-center mb-6 text-gray-600">
        <span className="mr-4">{blog.author}</span>
        <span>
          {new Date(blog.date).toLocaleString()}
        </span>
      </div>
      {blog.image && (
        <div className="mb-8">
          <Image
            src={blog.image || "/placeholder.svg"}
            alt={blog.title}
            width={800}
            height={400}
            className="rounded-lg object-cover"
          />
        </div>
      )}
      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </article>
  );
}
