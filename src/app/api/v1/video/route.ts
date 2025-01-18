import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client
} from "@aws-sdk/client-s3";
import {
    GetTranscriptionJobCommand,
    LanguageCode,
    MediaFormat,
    StartTranscriptionJobCommand,
    TranscribeClient,
} from "@aws-sdk/client-transcribe";
import { NextRequest, NextResponse } from "next/server";

// Constants
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const POLL_INTERVAL = 5000; // 5 seconds
const MAX_POLL_ATTEMPTS = 60; // 5 minutes maximum waiting time
// const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/x-msvideo"];
const ALLOWED_FILE_TYPES = [
    // Video formats
    "video/mp4", 
    "video/quicktime", 
    "video/x-msvideo",
    // Document formats
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/pdf", // .pdf
];

// AWS Client configuration with error handling
const createAWSClient = () => {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing required AWS credentials");
  }

  const config = {
    region,
    credentials: { accessKeyId, secretAccessKey },
    maxAttempts: 3,
  };

  return {
    s3: new S3Client(config),
    transcribe: new TranscribeClient(config),
  };
};

const { s3: s3Client, transcribe: transcribeClient } = createAWSClient();

// Improved job name generation with prefix for better tracking
const generateJobName = (prefix = "transcription"): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${random}`;
};


// Updated file validation
const validateFile = (file: File) => {
    if (!file) throw new Error("No file provided");
    if (file.size === 0) throw new Error("File is empty");
    if (file.size > MAX_FILE_SIZE)
        throw new Error("File size exceeds maximum limit");
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        throw new Error(
            "Invalid file type. Only MP4, MOV, AVI, DOC, DOCX, and PDF files are allowed"
        );
    }
};

// Improved S3 upload with progress tracking
async function uploadToS3(file: File, fileName: string, bucketName: string) {
  const buffer = Buffer.from(await file.arrayBuffer());

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
    ContentDisposition: "attachment",
    CacheControl: "max-age=31536000",
  };

  await s3Client.send(new PutObjectCommand(params));
  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}

// Enhanced transcription job handling with timeouts
async function handleTranscriptionJob(fileUrl: string, fileName: string) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  if (!bucketName) throw new Error("S3 bucket not configured");

  const jobName = generateJobName();
  const startCommand = new StartTranscriptionJobCommand({
    TranscriptionJobName: jobName,
    LanguageCode: LanguageCode.EN_US,
    MediaFormat: MediaFormat.MP4,
    Media: { MediaFileUri: fileUrl },
    OutputBucketName: bucketName,
    Settings: {
      ShowSpeakerLabels: true,
      MaxSpeakerLabels: 2,
      VocabularyName: process.env.CUSTOM_VOCABULARY_NAME, // Optional
    },
  });

  await transcribeClient.send(startCommand);
  return { jobName, bucketName };
}

// ... (previous constants and AWS client setup remain the same)

// Modified: Function to fetch and parse transcription content from S3
async function getTranscriptionContent(
  bucketName: string,
  jobName: string
): Promise<any> {
  try {
    // The transcription output is stored in the S3 bucket with a specific naming pattern
    const key = `${jobName}.json`;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      throw new Error("No content found in transcription file");
    }

    // Convert the readable stream to text
    const bodyContents = await response.Body.transformToString();

    // Parse the JSON content
    const data = JSON.parse(bodyContents);

    return {
      jobName: data.jobName,
      accountId: data.accountId,
      status: data.status,
      results: {
        transcripts: data.results.transcripts,
        speaker_labels: data.results.speaker_labels,
        items: data.results.items,
      },
    };
  } catch (error) {
    console.error("Error fetching transcription from S3:", error);
    throw new Error("Failed to process transcription content");
  }
}

// Modified polling function to handle S3 content
async function pollTranscriptionStatus(
  jobName: string
): Promise<{ transcriptionUrl: string; content: any }> {
  let attempts = 0;
  let delay = POLL_INTERVAL;
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("S3 bucket not configured");
  }

  while (attempts < MAX_POLL_ATTEMPTS) {
    const command = new GetTranscriptionJobCommand({
      TranscriptionJobName: jobName,
    });
    const response = await transcribeClient.send(command);
    const status = response.TranscriptionJob?.TranscriptionJobStatus;

    if (status === "COMPLETED") {
      // Wait a short time to ensure the file is available in S3
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        const content = await getTranscriptionContent(bucketName, jobName);
        const transcriptionUrl =
          response.TranscriptionJob?.Transcript?.TranscriptFileUri || "";
        return { transcriptionUrl, content };
      } catch (error) {
        // If content isn't available yet, continue polling
        console.log("Waiting for content to be available in S3...");
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * 1.5, 30000);
        continue;
      }
    }

    if (status === "FAILED") {
      throw new Error("Transcription job failed");
    }

    attempts++;
    await new Promise((resolve) => setTimeout(resolve, delay));
    delay = Math.min(delay * 1.5, 30000);
  }

  throw new Error("Transcription timeout exceeded");
}

// Modified POST handler
export async function POST(request: NextRequest) {
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
  
      validateFile(file);
  
      const fileName = `uploads/${Date.now()}-${file.name}`;
      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      
      if (!bucketName) {
        return NextResponse.json({ error: 'S3 bucket not configured' }, { status: 500 });
      }
  
      const fileUrl = await uploadToS3(file, fileName, bucketName);
      const { jobName } = await handleTranscriptionJob(fileUrl, fileName);
      const { transcriptionUrl, content } = await pollTranscriptionStatus(jobName);
  
      return NextResponse.json({
        success: true,
        message: 'Transcription completed successfully',
        fileUrl,
        transcriptionUrl,
        jobName,
        transcriptionContent: content
      });
  
    } catch (error) {
      console.error('Transcription error:', error);
      return NextResponse.json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      }, { status: error instanceof Error && error.message.includes('validation') ? 400 : 500 });
    }
  }