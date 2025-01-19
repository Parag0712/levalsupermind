import { client } from "../../lib/prisma";

export async function getBlog(id: string) {
  const blog = await client.blog.findUnique({
    where: {
      id: id,
    },
  });
  return blog;
}

export async function getBlogByAuthorId(id: string) {
  const blog = await client.blog.findMany({
    where: {
      authorId: id,
    },
  });
  return blog;
}
  
export async function getBlogWithTranslations(id: string) {
  const blog = await client.blog.findUnique({
    where: {
      id: id,
    },
    include: {
      translations: true,
    },
  });
  return blog;
}
