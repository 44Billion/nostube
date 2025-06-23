import * as React from "react";
import { useRef, useEffect, useCallback, useState } from "react";
import "media-chrome";
import "hls-video-element";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface VideoPlayerProps {
  url: string;
  videoId: string;
  loop?: boolean;
  mime: string;
  poster?: string;
  onTimeUpdate?: (time: number) => void;
  className?: string;
}

export function VideoPlayer({
  url,
  videoId,
  mime,
  poster,
  loop = false,
  onTimeUpdate,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hlsEl, setHlsEl] = useState<HTMLVideoElement | null>(null);
  const { user } = useCurrentUser();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSaveRef = useRef<number>(0);

  const isHls = React.useMemo(
    () => mime === "application/vnd.apple.mpegurl" || url.endsWith(".m3u8"),
    [mime, url]
  );

  // Restore play position on mount
  useEffect(() => {
    if (!user || !videoId) return;
    const key = `playpos:${user.pubkey}:${videoId}`;
    const saved = localStorage.getItem(key);
    const el = isHls ? hlsEl : videoRef.current;
    if (saved && el) {
      const time = parseFloat(saved);
      if (!isNaN(time)) {
        el.currentTime = time;
      }
    }
  }, [user, videoId, isHls, hlsEl]);

  // Store play position on time update
  const handleTimeUpdate = useCallback(() => {
    const el = isHls ? hlsEl : videoRef.current;
    if (onTimeUpdate && el) {
      onTimeUpdate(el.currentTime);
    }
    if (user && videoId && el && el.duration > 60) {
      const now = Date.now();
      const key = `playpos:${user.pubkey}:${videoId}`;
      // If last save was more than 5s ago, save immediately
      if (now - lastSaveRef.current > 2000) {
        localStorage.setItem(key, String(el.currentTime));
        lastSaveRef.current = now;
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
          debounceRef.current = null;
        }
      } else {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
          localStorage.setItem(key, String(el.currentTime));
          lastSaveRef.current = Date.now();
        }, 2000 - (now - lastSaveRef.current));
      }
    }
  }, [onTimeUpdate, user, videoId, isHls, hlsEl]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Ref callback for hls-video custom element
  const hlsRef = useCallback((node: Element | null) => {
    setHlsEl(node && 'currentTime' in node ? (node as HTMLVideoElement) : null);
  }, []);

  return (
    <media-controller className={className}>
      {isHls ? (
        <hls-video
          src={url}
          slot="media"
          autoPlay
          loop={loop}
          poster={poster}
          crossorigin
          onTimeUpdate={handleTimeUpdate}
          ref={hlsRef}
        ></hls-video>
      ) : (
        <video
          src={url}
          ref={videoRef}
          slot="media"
          autoPlay
          loop={loop}
          poster={poster}
          onTimeUpdate={handleTimeUpdate}
        />
      )}
      <media-control-bar>
        <media-play-button />
        <media-mute-button />
        <media-volume-range />
        <media-time-display />
        <media-time-range />
        <media-playback-rate-button></media-playback-rate-button>
        <media-pip-button />
        <media-fullscreen-button />
      </media-control-bar>
    </media-controller>
  );
}
