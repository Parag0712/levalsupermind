import { NextRequest, NextResponse } from "next/server";
import {
  TranslateClient,
  TranslateTextCommand,
} from "@aws-sdk/client-translate"; // AWS Translate client

// Set up AWS Translate client
const translateClient = new TranslateClient({
  region: process.env.AWS_REGION, // Use environment variable for region, fallback to default
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "", // Use environment variable for AWS Access Key
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "", // Use environment variable for AWS Secret Access Key
  },
});

const languages = ["es", "fr", "de", "it", "ja", "ko", "pt", "ru", "zh", "hi"];

export async function POST(request: NextRequest) {
  try {
    // Dummy blog data (adjusted to match your schema)
    const blogData = {
      title: "Dummy Blog Title",
      content: "This is the content of the dummy blog post.",
      metaDescription: "Meta description of the dummy blog post",
    };

    // Start translation process for all languages
    const translationPromises = languages.map(async (language) => {
      const translatedContent = await translateText(blogData.content, language);
      const translatedTitle = await translateText(blogData.title, language);
      const translatedMetaDescription = blogData.metaDescription
        ? await translateText(blogData.metaDescription, language)
        : null;

      // Return the translated data for each language
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
      message: "Blog content translated successfully",
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

async function translateText(text: string, targetLanguage: string) {
  const params = {
    Text: text, // Use 'Text' instead of 'TextList'
    SourceLanguageCode: "en",
    TargetLanguageCode: targetLanguage,
  };

  try {
    const command = new TranslateTextCommand(params); // Using the corrected params
    const data = await translateClient.send(command);
    return data.TranslatedText; // Return the translated text
  } catch (error) {
    console.error("Error translating text:", error);
    throw new Error("Translation failed");
  }
}
