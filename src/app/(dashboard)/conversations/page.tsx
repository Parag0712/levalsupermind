"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoPlayer from "./_components/VideoPlayer";

export default function Home() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      generateTranscript(file);
    }
  };

  const generateTranscript = async (file: File) => {
    setIsLoading(true);
    // Simulating transcript generation
    // In a real application, you would send the file to a speech-to-text API
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setTranscript(
      "This is a simulated transcript of the uploaded video. In a real application, you would integrate with a speech-to-text API to generate an actual transcript of the video content."
    );
    setIsLoading(false);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Video Transcription App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Video Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                Upload Video
              </Button>
              {videoSrc && <VideoPlayer src={videoSrc} />}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Generating transcript...</p>
            ) : transcript ? (
              <p className="whitespace-pre-wrap">{transcript}</p>
            ) : (
              <p>Upload a video to see its transcript</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
