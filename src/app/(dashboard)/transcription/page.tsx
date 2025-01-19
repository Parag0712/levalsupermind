"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, X, Download, Copy } from "lucide-react";
import VideoPlayer from "./_components/VideoPlayer";

export default function MinimalTranscriptionApp() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
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

      if (response.data && response.data.transcript) {
        setTranscript(response.data.transcript);
        response;
      } else {
        setTranscript(
          "Failed to generate transcript: Unexpected response format."
        );
      }
    } catch (error) {
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

  const copyTranscript = () => {
    navigator.clipboard.writeText(transcript);
    alert("Transcript copied to clipboard");
  };

  const downloadTranscript = () => {
    const element = document.createElement("a");
    const file = new Blob([transcript], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "transcript.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const redirectToTranscript = (blogId:string) => {
    router.push(`/transcription/${blogId}`);
  };

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Video Transcription
      </h1>
      <div className="">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Upload Video</CardTitle>
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
        <Card>
          <CardHeader>
            <CardTitle>Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2 py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Generating transcript...</p>
              </div>
            ) : transcript ? (
              <div className="space-y-4">
                <div className="flex justify-end space-x-2">
                  <Button onClick={copyTranscript} variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    onClick={downloadTranscript}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
                <div className="max-h-96 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">
                    {transcript.startsWith("Failed to generate transcript") ? (
                      <span className="text-red-500">{transcript}</span>
                    ) : (
                      transcript
                    )}
                  </p>
                </div>
                <div className="flex justify-center">
                  <Button onClick={redirectToTranscript} variant="default">
                    Go to Transcript
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Upload a video to see its transcript
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
