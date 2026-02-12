import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Music } from "@shared/schema";

interface MusicPlayerProps {
  music: Music | null;
  enabled: boolean;
}

export function MusicPlayer({ music, enabled }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!music || !enabled) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(music.url);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    } else {
      audioRef.current.src = music.url;
    }

    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch((error) => {
      console.error("Error playing music:", error);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [music, enabled]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!music || !enabled) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-lg bg-card/90"
        data-testid="music-player"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={togglePlay}
              className="shrink-0"
              data-testid="button-play-pause"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium font-poppins truncate" data-testid="text-music-name">
                {music.name}
              </p>
              <p className="text-xs text-muted-foreground font-poppins">
                Música de Fundo
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsMuted(!isMuted)}
                data-testid="button-mute"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <div className="w-24 hidden sm:block">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={(value) => {
                    setVolume(value[0] / 100);
                    setIsMuted(false);
                  }}
                  max={100}
                  step={1}
                  data-testid="slider-volume"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
