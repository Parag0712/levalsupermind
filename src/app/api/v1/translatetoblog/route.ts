import { client } from "@/lib/prisma";
import {
  TranslateClient,
  TranslateTextCommand,
} from "@aws-sdk/client-translate";
import { NextRequest, NextResponse } from "next/server";
import { generateSlug } from "../video/route";

const translateClient = new TranslateClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// AWS language code mapping for Indian languages
const languageToAWSCode = {
  EN: "en",
  HI: "hi",
  MR: "mr",
  GU: "gu",
  TA: "ta",
  KN: "kn",
  TE: "te",
  BN: "bn",
  ML: "ml",
  PA: "pa",
} as const;

// Define type for supported languages
type SupportedLanguage = keyof typeof languageToAWSCode;

const languages: SupportedLanguage[] = [
  "HI",
  "MR",
  "GU",
  "TA",
  "KN",
  "TE",
  "BN",
  "ML",
  "PA",
];

export async function POST(request: NextRequest) {
  try {
    const { blogId } = await request.json();
    console.log("Blog ID:", blogId);
    if (!blogId) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    const blog = await client.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const translationPromises = languages.map(async (language) => {
      const translatedContent = await translateText(blog.content, language);
      const translatedSlug = await translateText(blog.slug, language);
      const translatedTitle = await translateText(blog.title, language);
      const translatedMetaDescription = blog.metaDescription
        ? await translateText(blog.metaDescription, language)
        : null;

      console.log("Translated Content:", translatedContent);
      console.log("Translated Title:", translatedTitle);
      console.log("Translated Meta Description:", translatedMetaDescription);

      // Check if translation already exists
      const existingTranslation = await client.translation.findUnique({
        where: {
          blogId_language: {
            blogId: blog.id,
            language: language,
          },
        },
      });

      if (existingTranslation) {
        // Update existing translation
        await client.translation.update({
          where: {
            blogId_language: {
              blogId: blog.id,
              language: language,
            },
          },
          data: {
            title: translatedTitle!,
            content: translatedContent!,
            metaDescription: translatedMetaDescription || "",
            slug: generateSlug(translatedSlug!),
            keywords:blog.keywords,
          },
        });
      } else {
        // Create new translation
        await client.translation.create({
          data: {
            blogId: blog.id,
            language: language,
            title: translatedTitle!,
            content: translatedContent!,
            metaDescription: translatedMetaDescription || "",
            slug:generateSlug(translatedSlug!),
          },
        });
      }

      return {
        language,
        translatedContent,
        translatedTitle,
        translatedMetaDescription,
      };
    });

    const translations = await Promise.all(translationPromises);

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

async function translateText(text: string, targetLanguage: SupportedLanguage) {
  const params = {
    Text: text,
    SourceLanguageCode: "en",
    TargetLanguageCode: languageToAWSCode[targetLanguage].toLowerCase(),
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
