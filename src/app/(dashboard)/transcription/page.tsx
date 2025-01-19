"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, X } from "lucide-react";
import VideoPlayer from "./_components/VideoPlayer";

export default function Home() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      console.log("File selected:", file.name, "Size:", file.size, "bytes");
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setIsUploading(false);
      await generateTranscript(file);
    }
  };

  const generateTranscript = async (file: File) => {
    setIsLoading(true);
    setTranscript("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/v1/video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("API Response:", response);

      if (response.data && response.data.transcript) {
        setTranscript(response.data.transcript);
      } else {
        console.error("Unexpected API response format:", response.data);
        setTranscript(
          "Failed to generate transcript: Unexpected response format."
        );
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      setTranscript(
        "Failed to generate transcript: " +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const removeVideo = () => {
    setVideoSrc(null);
    setTranscript("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Video Transcription App
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-2">
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
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || isLoading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Video
                    </>
                  )}
                </Button>
                {videoSrc && (
                  <Button
                    variant="destructive"
                    onClick={removeVideo}
                    disabled={isLoading}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remove Video
                  </Button>
                )}
              </div>
              {videoSrc && (
                <div className="mt-4">
                  <VideoPlayer src={videoSrc} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Generating transcript...</p>
              </div>
            ) : transcript ? (
              <div className="max-h-96 overflow-y-auto">
                <p className="whitespace-pre-wrap">
                  {transcript.startsWith("Failed to generate transcript") ? (
                    <span className="text-red-500">{transcript}</span>
                  ) : (
                    transcript
                  )}
                </p>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Upload a video to see its transcript
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
