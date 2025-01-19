import { notFound } from "next/navigation";
import { getBlogBySlug } from "@/actions/getblog";
type BlogPostParams = {
  params: {
    username: string;
    postname: string;
  };
};

export default async function BlogPost({ params }: BlogPostParams) {
  const { username, postname } = params;

  try {
    // Fetch the blog data
    const post = await getBlogBySlug(postname);

    if (!post) {
      notFound(); // If the post is not found, show the 404 page
    }

    // Set dynamic meta tags
    const metaTitle = `${post.title} | Blog by ${username}`;
    const metaDescription = post.content.substring(0, 150) + "...";

    return (
      <>
        <head>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDescription} />
        </head>
        <div className="container mx-auto p-4">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-lg">{post.content}</p>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching blog post:", error);
    notFound(); // If an error occurs, show the 404 page
  }
}
