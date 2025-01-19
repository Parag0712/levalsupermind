// src/app/blogs/[slug]/page.tsx
import { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Blog {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  createdAt: string;
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/blog/${slug}`, {
      cache: 'no-store', // Ensures the data is fetched server-side and not cached
    });

    if (!response.ok) {
      throw new Error('Blog not found');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const blog = await getBlog(params.slug);

  return {
    title: blog?.title || 'Untitled Blog',
    description: blog?.content.slice(0, 150) || 'Read our latest blog.',
    keywords: blog?.keywords.join(', ') || '',
  };
}

const BlogPage = async ({ params }: { params: { slug: string } }) => {
  const blog = await getBlog(params.slug);

  if (!blog) {
    return <div className="container mx-auto p-4">Blog not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{blog.title || 'Untitled Blog'}</CardTitle>
          <div className="text-gray-500 text-sm">Created: {new Date(blog.createdAt).toLocaleDateString()}</div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">{blog.content}</div>
          {blog.keywords?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {blog.keywords.map((keyword, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-100 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPage;
