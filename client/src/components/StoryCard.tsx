import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toggleFavorite, isFavorite } from "@/lib/favorites";
import type { Story } from "@shared/schema";

interface StoryCardProps {
  story: Story;
  index: number;
}

export function StoryCard({ story, index }: StoryCardProps) {
  const [isFav, setIsFav] = useState(isFavorite(story.id));

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleFavorite(story.id);
    setIsFav(newState);
  };
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min`;
  };

  const getPreview = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <Link href={`/story/${story.id}`} data-testid={`link-story-${story.id}`}>
        <div className="cursor-pointer">
          <Card className="group relative overflow-hidden h-full hover-elevate active-elevate-2 transition-all duration-300">
            <div className="aspect-[16/9] relative overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${story.coverImageUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold font-lora text-foreground mb-2 line-clamp-2" data-testid={`text-title-${story.id}`}>
                  {story.title}
                </h3>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground font-merriweather line-clamp-3 leading-relaxed" data-testid={`text-preview-${story.id}`}>
                {getPreview(story.content)}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground font-poppins">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(story.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{getReadingTime(story.content)}</span>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 shrink-0"
                  onClick={handleFavoriteClick}
                  data-testid={`button-favorite-${story.id}`}
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      isFav ? "fill-red-500 text-red-500" : "text-muted-foreground"
                    }`}
                  />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Link>
    </motion.div>
  );
}
