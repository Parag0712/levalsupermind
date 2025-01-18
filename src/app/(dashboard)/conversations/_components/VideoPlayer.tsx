import { useRef, useEffect } from "react";

interface VideoPlayerProps {
  src: string;
}

export default function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = src;
    }
  }, [src]);

  return (
    <video ref={videoRef} controls className="w-full">
      Your browser does not support the video tag.
    </video>
  );
}
