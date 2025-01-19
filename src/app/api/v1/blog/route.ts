import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { client } from "../../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }
    const blogs = await client.blog.findMany({
      where: {
        author: {
          id: user.id,
        },
      },
      orderBy:{
        createdAt:"desc"
      }
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
