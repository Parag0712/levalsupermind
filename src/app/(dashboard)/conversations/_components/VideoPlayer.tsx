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
    <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
      <video ref={videoRef} controls className="w-full h-full object-cover">
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
