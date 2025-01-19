// src/app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Globe, Tag, Calendar, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';

interface Translation {
  language: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  createdAt: string;
  translations?: Translation[];
}

const languageLabels: Record<string, string> = {
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

async function getBlog(slug: string): Promise<Blog> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/blog/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Blog not found');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching blog:', error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const blog = await getBlog(params.slug);

  return {
    title: blog?.title || 'Blog Post',
    description: blog?.content?.slice(0, 150) + '...' || 'Read our latest blog post.',
    keywords: blog?.keywords?.join(', ') || '',
  };
}

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">{blog.title}</CardTitle>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {new Date(blog.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed">{blog.content}</p>
          </div>

          {blog.keywords?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {blog.keywords.map((keyword, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium flex items-center"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {keyword}
                </span>
              ))}
            </div>
          )}

          {blog.translations && blog.translations.length > 0 && (
            <div className="mt-8 space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Translations
              </h2>
              <div className="grid gap-6">
                {blog.translations.map((translation) => (
                  <Card 
                    key={translation.language}
                    className="bg-secondary/10 border-l-4 border-primary"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Globe className="h-5 w-5" />
                        {languageLabels[translation.language] || translation.language} - {translation.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {translation.content}
                      </p>
                      <div className="text-xs text-muted-foreground mt-4 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Last updated: {new Date(translation.updatedAt).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}