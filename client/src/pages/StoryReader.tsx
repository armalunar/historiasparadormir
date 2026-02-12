import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import type { Story } from "@shared/schema";

interface StoryReaderProps {
  settings: {
    font: "lora" | "merriweather" | "poppins";
    textSize: "small" | "medium" | "large";
    theme: "light" | "dark";
  };
  onSettingsClick: () => void;
}

export default function StoryReader({ settings, onSettingsClick }: StoryReaderProps) {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const { data: story, isLoading } = useQuery<Story>({
    queryKey: [`/api/stories/${id}`],
    enabled: !!id,
  });

  const fontClass = {
    lora: "font-lora",
    merriweather: "font-merriweather",
    poppins: "font-poppins",
  }[settings.font];

  const textSizeClass = {
    small: "text-base md:text-lg",
    medium: "text-lg md:text-xl",
    large: "text-xl md:text-2xl",
  }[settings.textSize];

  if (isLoading) {
    return (
      <div className="min-h-screen pb-24">
        <div className="relative h-96">
          <Skeleton className="absolute inset-0" />
        </div>
        <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
          <Skeleton className="h-12 w-3/4 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground font-merriweather mb-6">
            História não encontrada
          </p>
          <Button onClick={() => setLocation("/")} data-testid="button-back-home">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-96 overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${story.coverImageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        
        <div className="relative h-full container mx-auto px-4 md:px-6 flex flex-col justify-between pt-6 pb-12">
          <Button
            onClick={() => setLocation("/")}
            variant="ghost"
            className="w-fit backdrop-blur-md bg-background/30"
            data-testid="button-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-lora text-foreground max-w-4xl"
            data-testid="text-story-title"
          >
            {story.title}
          </motion.h1>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={`prose prose-lg max-w-none ${fontClass} ${textSizeClass}`}
        >
          <div
            className="whitespace-pre-wrap leading-relaxed text-foreground"
            style={{ lineHeight: "1.8" }}
            data-testid="text-story-content"
          >
            {story.content}
          </div>
        </motion.article>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t text-center"
        >
          <p className="text-sm text-muted-foreground font-poppins">
            Publicado em {new Date(story.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
        className="fixed bottom-24 right-6 md:right-12 z-30"
      >
        <Button
          onClick={onSettingsClick}
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          data-testid="button-floating-settings"
        >
          <Settings className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
}
