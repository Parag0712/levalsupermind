import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { client } from "../../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    console.log("User ID:", user);
    const userdata = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    const blogs = await client.blog.findMany({
      where: {
        author: {
          id: userdata?.id,
        },
      },
      include: {
        translations: true,
      },
      orderBy: {
        createdAt: "desc",
      },
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
