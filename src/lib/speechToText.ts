import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Initialize AWS Transcribe
const transcribeService = new AWS.TranscribeService({
  region: process.env.AWS_REGION || 'us-east-1',
});

export async function transcribeVideo(videoFileUrl: string): Promise<string> {
  const jobName = `transcription-${uuidv4()}`; // Unique name for the transcription job

  try {
    // Start Transcription Job
    await transcribeService
      .startTranscriptionJob({
        TranscriptionJobName: jobName,
        LanguageCode: 'en-US',
        MediaFormat: 'mp4', // Adjust format if needed (e.g., mp3, wav)
        Media: {
          MediaFileUri: videoFileUrl, // URL to video file in S3
        },
        OutputBucketName: process.env.AWS_OUTPUT_BUCKET, // Bucket for transcription output
      })
      .promise();

    // Polling for job completion
    let transcriptionCompleted = false;
    let transcriptText = '';

    while (!transcriptionCompleted) {
      const { TranscriptionJob } = await transcribeService
        .getTranscriptionJob({ TranscriptionJobName: jobName })
        .promise();

      if (TranscriptionJob?.TranscriptionJobStatus === 'COMPLETED') {
        const transcriptUrl = TranscriptionJob.Transcript?.TranscriptFileUri;
        const transcriptResponse = await fetch(transcriptUrl!);
        const transcriptData = await transcriptResponse.json();
        transcriptText = transcriptData.results.transcripts.map((t: any) => t.transcript).join('\n');
        transcriptionCompleted = true;
      } else if (TranscriptionJob?.TranscriptionJobStatus === 'FAILED') {
        throw new Error('Transcription job failed.');
      }

      // Wait for 5 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    return transcriptText;
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe video');
  }
}
