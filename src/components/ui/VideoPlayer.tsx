import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type CSSProperties,
  type MouseEvent,
} from 'react';
import { Maximize2, Pause, Play } from 'lucide-react';

import { cn } from '@/lib/utils';

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

type VideoPlayerProps = {
  src: string;
  className?: string;
  poster?: string;
  style?: CSSProperties;
};

export default function VideoPlayer({ src, className, poster, style }: Readonly<VideoPlayerProps>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const clearHideTimer = useCallback(() => {
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
      hideControlsTimerRef.current = null;
    }
  }, []);

  const scheduleHideControls = useCallback(() => {
    clearHideTimer();
    hideControlsTimerRef.current = setTimeout(() => setShowControls(false), 2500);
  }, [clearHideTimer]);

  const revealControls = useCallback(() => {
    setShowControls(true);
    scheduleHideControls();
  }, [scheduleHideControls]);

  const play = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    setHasStarted(true);
    try {
      await video.play();
      setIsPlaying(true);
      revealControls();
    } catch {
      setIsPlaying(false);
    }
  }, [revealControls]);

  const pause = useCallback(() => {
    videoRef.current?.pause();
    setIsPlaying(false);
    clearHideTimer();
    setShowControls(true);
  }, [clearHideTimer]);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else void play();
  }, [isPlaying, pause, play]);

  const seek = (e: MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    video.currentTime = ratio * duration;
  };

  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;

    const doc = document as Document & {
      webkitFullscreenElement?: Element | null;
      webkitExitFullscreen?: () => Promise<void>;
    };
    const container = el as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
    };

    const fullscreenElement = doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;

    if (fullscreenElement) {
      await (doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.());
    } else {
      await (container.requestFullscreen?.() ?? container.webkitRequestFullscreen?.());
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setDuration(0);
    setCurrentTime(0);

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const syncDuration = () => {
      const nextDuration = video.duration;
      if (Number.isFinite(nextDuration) && nextDuration > 0) {
        setDuration(nextDuration);
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
      clearHideTimer();
    };

    syncDuration();

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', syncDuration);
    video.addEventListener('durationchange', syncDuration);
    video.addEventListener('loadeddata', syncDuration);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', syncDuration);
      video.removeEventListener('durationchange', syncDuration);
      video.removeEventListener('loadeddata', syncDuration);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
    };
  }, [clearHideTimer, src]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onFullscreenChange = () => {
      const doc = document as Document & { webkitFullscreenElement?: Element | null };
      const fullscreenElement = doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      setIsFullscreen(fullscreenElement === container);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    };
  }, []);

  useEffect(() => () => clearHideTimer(), [clearHideTimer]);

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const showOverlay = !hasStarted || !isPlaying;
  const controlsVisible = hasStarted && (showControls || !isPlaying);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative inline-block max-h-full max-w-full group overflow-hidden',
        isFullscreen && 'flex h-screen w-screen items-center justify-center bg-black',
        className,
      )}
      style={style}
      onMouseEnter={() => hasStarted && isPlaying && revealControls()}
      onMouseMove={() => hasStarted && isPlaying && revealControls()}
      onMouseLeave={() => hasStarted && isPlaying && scheduleHideControls()}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        className={cn(
          'block max-h-full max-w-full h-auto w-auto cursor-pointer',
          isFullscreen && 'max-h-full max-w-full object-contain',
        )}
        onClick={() => hasStarted && togglePlay()}
      />

      {showOverlay && (
        <button
          type="button"
          onClick={() => void play()}
          className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/35 cursor-pointer"
          aria-label={hasStarted ? 'Resume video' : 'Play video'}
        >
          <span className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-lg transition-transform hover:scale-105">
            <Play size={28} className="ml-1 text-[#111827]" fill="#111827" />
          </span>
        </button>
      )}

      {controlsVisible && (
        <div
          className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-8 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
            className="relative h-1 mb-3 rounded-full bg-white/30 cursor-pointer group/progress"
            onClick={seek}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover/progress:opacity-100 transition-opacity"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                className="text-white/90 hover:text-white transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" />}
              </button>
              <span className="text-[11px] text-white/80 tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => void toggleFullscreen()}
              className="text-white/90 hover:text-white transition-colors"
              aria-label="Fullscreen"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
