import * as React from "react";
import { useRef, useEffect, useCallback, useState } from "react";
import "media-chrome";
import "hls-video-element";

interface VideoPlayerProps {
  url: string;
  loop?: boolean;
  mime: string;
  poster?: string;
  onTimeUpdate?: (time: number) => void;
  className?: string;
  /**
   * Initial play position in seconds
   */
  initialPlayPos?: number;
}

export function VideoPlayer({
  url,
  mime,
  poster,
  loop = false,
  onTimeUpdate,
  className,
  initialPlayPos = 0,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hlsEl, setHlsEl] = useState<HTMLVideoElement | null>(null);

  const isHls = React.useMemo(
    () => mime === "application/vnd.apple.mpegurl" || url.endsWith(".m3u8"),
    [mime, url]
  );

  // Set initial play position on mount
  useEffect(() => {
    if (initialPlayPos > 0) {
      const el = isHls ? hlsEl : videoRef.current;
      if (el) {
        el.currentTime = initialPlayPos;
      }
    }
    // Only run on mount or when initialPlayPos changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPlayPos, isHls, hlsEl]);

  // Frame-by-frame navigation with . and , keys (global listener)
  useEffect(() => {
    const el = isHls ? hlsEl : videoRef.current;
    if (!el) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (!el) return;
      // Only step if video is paused and present
      if (!el.paused) return;
      // Assume 30fps for frame step
      const frameStep = 1 / 30;
      if (e.key === ".") {
        el.currentTime = Math.min(el.duration, el.currentTime + frameStep);
        e.preventDefault();
      } else if (e.key === ",") {
        el.currentTime = Math.max(0, el.currentTime - frameStep);
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isHls, hlsEl]);

  // Ref callback for hls-video custom element
  const hlsRef = useCallback((node: Element | null) => {
    setHlsEl(node && "currentTime" in node ? (node as HTMLVideoElement) : null);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const el = isHls ? hlsEl : videoRef.current;
    if (onTimeUpdate && el) {
      onTimeUpdate(el.currentTime);
    }
  }, [onTimeUpdate, isHls, hlsEl]);

  return (
    <media-controller className={className}>
      {isHls ? (
        <hls-video
          className="rounded-lg"
          src={url}
          slot="media"
          autoPlay
          loop={loop}
          poster={poster}
          crossorigin
          onTimeUpdate={handleTimeUpdate}
          ref={hlsRef}
          tabIndex={0}
        ></hls-video>
      ) : (
        <video
          src={url}
          ref={videoRef}
          slot="media"
          autoPlay
          loop={loop}
          poster={poster}
          className="rounded-lg "
          onTimeUpdate={handleTimeUpdate}
          tabIndex={0}
        >
          {/* TODO: add captions <track kind="captions" /> */}
          {/* TODO: add fallback sources <source src={url} type={mime} /> */}
        </video>
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
