import { notFound } from "next/navigation";

type BlogPostParams = {
  params: {
    username: string;
    postname: string;
  };
};

export default function BlogPost({ params }: BlogPostParams) {
  const post = {
    title: `Blog Post ${params.postname}`,
    content: `This is the content of the blog post by ${params.username}.`,
  };

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-lg">{post.content}</p>
    </div>
  );
}
