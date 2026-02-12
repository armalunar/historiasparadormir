import { useQuery } from "@tanstack/react-query";
import { StoryCard } from "@/components/StoryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useSiteConfig } from "@/lib/useSiteConfig";
import type { Story } from "@shared/schema";

export default function Home() {
  const config = useSiteConfig();
  const { data: stories, isLoading } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
  });

  return (
    <div className="min-h-screen pb-24">
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-background pointer-events-none" />
        
        <div className="container relative mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-6">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="text-6xl md:text-7xl"
              >
                ✨
              </motion.div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold font-lora mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {config?.heroTitle || "Histórias Mágicas"}
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground font-merriweather max-w-2xl mx-auto leading-relaxed">
              {config?.heroSubtitle || "Embarque em uma jornada através de contos encantadores, embalados por músicas suaves e uma atmosfera de noite estrelada."}
            </p>

            {config?.customHTML && (
              <div 
                className="mt-8"
                dangerouslySetInnerHTML={{ __html: config.customHTML }}
              />
            )}
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 mb-8"
        >
          <BookOpen className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold font-lora">Nossas Histórias</h3>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[16/9] w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : stories && stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, index) => (
              <StoryCard key={story.id} story={story} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">📚</div>
            <p className="text-lg text-muted-foreground font-merriweather">
              Ainda não há histórias publicadas. Em breve novos contos mágicos!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
