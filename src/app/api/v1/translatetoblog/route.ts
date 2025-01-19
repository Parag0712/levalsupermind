import { NextRequest, NextResponse } from "next/server";
import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate"; // AWS Translate client
import { client} from "@/lib/prisma"; // Import Prisma client and Prisma's enum
import { $Enums } from "@prisma/client";

// Set up AWS Translate client
const translateClient = new TranslateClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const languages: $Enums.Language[] = [
  $Enums.Language.ES,
  $Enums.Language.FR,
  $Enums.Language.DE,
  $Enums.Language.IT,
  $Enums.Language.JA,
  $Enums.Language.KO,
  $Enums.Language.PT,
  $Enums.Language.RU,
  $Enums.Language.ZH,
];

export async function POST(request: NextRequest) {
  try {
    const { blogId } = await request.json(); // Get the blog ID from the request body
    
    if(!blogId){
      return NextResponse.json({error:"Blog ID is required"},{status:400})
    }
    
    // Fetch the blog by ID from Prisma
    const blog = await client.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    // Start translation process for all languages
    const translationPromises = languages.map(async (language) => {
      const translatedContent = await translateText(blog.content, language);
      const translatedTitle = await translateText(blog.title, language);
      const translatedMetaDescription = blog.metaDescription
        ? await translateText(blog.metaDescription, language)
        : null;

      // Store the translation in the database using the enum value
      await client.translation.create({
        data: {
          blogId: blog.id,
          language: language, // Directly using Prisma's Language enum value
          title: translatedTitle!,
          content: translatedContent!,
          metaDescription: translatedMetaDescription!,
          slug: translatedTitle!,
        },
      });

      return {
        language,
        translatedContent,
        translatedTitle,
        translatedMetaDescription,
      };
    });

    // Wait for all translations to finish
    const translations = await Promise.all(translationPromises);

    // Return a detailed response with the translations
    return NextResponse.json({
      message: "Blog content translated and stored successfully",
      translations,
    });
  } catch (error) {
    console.error("Error translating blog content:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function translateText(text: string, targetLanguage: $Enums.Language) {
  const params = {
    Text: text,
    SourceLanguageCode: $Enums.Language.EN,
    TargetLanguageCode: targetLanguage,
  };

  try {
    const command = new TranslateTextCommand(params);
    const data = await translateClient.send(command);
    return data.TranslatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    throw new Error("Translation failed");
  }
}
