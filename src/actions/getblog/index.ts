import { Language } from "@prisma/client";
import { client } from "../../lib/prisma";

export async function getBlog(id: string) {
  try {
    const blog = await client.blog.findUnique({
      where: {
        id: id,
      },
    });
    return blog;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw new Error("Blog not found");
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const blog = await client.blog.findFirst({
      where: {
        slug: slug,
      },
    });
    return blog;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw new Error("Blog not found");
  }
}

export async function getBlogByAuthorId(id: string) {
  try {
    const blogs = await client.blog.findMany({
      where: {
        authorId: id,
      },
    });
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs by author:", error);
    throw new Error("Blogs not found");
  }
}

export async function getBlogWithTranslations(id: string) {
  try {
    const blog = await client.blog.findUnique({
      where: {
        id: id,
      },
      include: {
        translations: true,
      },
    });
    return blog;
  } catch (error) {
    console.error("Error fetching blog with translations:", error);
    throw new Error("Blog with translations not found");
  }
}


export async function getBlogWithLanguageFilter(slug: string, language: Language) {
  try {
    const blog = await client.blog.findFirst({
      where: { slug: slug },
      include: {
        translations: {
          where: { language: language }, // Filtering translations by language
        },
      },
    });

    return blog;
  } catch (error) {
    console.error("Error fetching blog with language filter:", error);
    throw new Error("Blog not found or error in fetching translations.");
  }
}

