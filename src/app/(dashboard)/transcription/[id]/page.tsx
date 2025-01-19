import { notFound } from "next/navigation";
import { getBlog } from "@/actions/getblog";
import BlogPost from "../_components/BlogPost";

export default async function BlogPage({ params }: { params: { id: string } }) {
  let blog;
  try {
    blog = await getBlog(params.id);
  } catch (error) {
    notFound();
  }

  if (!blog) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <BlogPost blog={blog as any} />
    </main>
  );
}
