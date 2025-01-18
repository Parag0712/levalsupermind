import { client } from "@/lib/prisma";

export const fetchBlogs = async (userId: string) => {
    try {
      const blogs = await client.blog.findMany({
        where: { authorId: userId },
        include: { translations: true },
      });
  
      return blogs || [];
    } catch (error) {
      console.error("Error fetching blogs:", error);
      throw new Error("Unable to fetch blogs");
    }
  };
  