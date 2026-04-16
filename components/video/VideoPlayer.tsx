"use client";

import { useRef, useState } from "react";

interface VideoPlayerProps {
  src: string | null;
  poster?: string;
  title?: string;
}

export default function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * video.duration;
    setProgress(percent * 100);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    const val = parseFloat(e.target.value);
    if (video) {
      video.volume = val;
      setVolume(val);
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      video.volume = volume || 1;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;
    if (!isFullscreen) {
      container.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  if (!src) {
    return (
      <div className="aspect-video rounded-xl bg-charcoal/5 border border-border flex items-center justify-center">
        <p className="text-muted text-sm">No video available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-charcoal">
      <div className="relative aspect-video group">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          title={title}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-contain"
          onClick={togglePlay}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center gap-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={togglePlay}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            )}
          </button>
          <div
            className="flex-1 h-1.5 bg-white/30 rounded-full cursor-pointer overflow-hidden"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-orange rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M11.293 4.707a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 accent-orange"
            />
          </div>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
