// src/app/blog/[slug]/[lang]/page.tsx
import { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Globe, Calendar, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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
  createdAt: string;
  translations: Translation[];
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

async function getBlogTranslation(slug: string, lang: string): Promise<{ blog: Blog; translation: Translation }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/blog/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Blog not found');
    }

    const blog: Blog = await response.json();
    const translation = blog.translations?.find(t => t.language.toLowerCase() === lang.toLowerCase());

    if (!translation) {
      throw new Error('Translation not found');
    }

    return { blog, translation };
  } catch (error) {
    console.error('Error fetching blog translation:', error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; lang: string };
}): Promise<Metadata> {
  const { blog, translation } = await getBlogTranslation(params.slug, params.lang);

  return {
    title: `${translation.title} (${languageLabels[translation.language]})`,
    description: translation.content.slice(0, 150) + '...',
  };
}

export default async function TranslatedBlogPage({ 
  params 
}: { 
  params: { slug: string; lang: string } 
}) {
  const { blog, translation } = await getBlogTranslation(params.slug, params.lang);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-primary">
              {translation.title}
            </CardTitle>
            <Link 
              href={`/blog/${params.slug}`}
              className="text-sm text-primary hover:text-primary/80 flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              View Original
            </Link>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Last updated: {new Date(translation.updatedAt).toLocaleString()}
            </span>
          </div>
          <div className="text-sm text-primary mt-2">
            {languageLabels[translation.language]} Translation
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed">{translation.content}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}