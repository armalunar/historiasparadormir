import { z } from "zod";

// Story schema - preserves exact formatting
export const storySchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  coverImageUrl: z.string().min(1, "Imagem é obrigatória"),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const insertStorySchema = storySchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type Story = z.infer<typeof storySchema>;
export type InsertStory = z.infer<typeof insertStorySchema>;

// Music schema
export const musicSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório"),
  url: z.string().url("URL do arquivo inválida"),
  uploadedAt: z.number(),
});

export const insertMusicSchema = musicSchema.omit({ 
  id: true, 
  uploadedAt: true 
});

export type Music = z.infer<typeof musicSchema>;
export type InsertMusic = z.infer<typeof insertMusicSchema>;

// User settings (stored in localStorage)
export const userSettingsSchema = z.object({
  font: z.enum(["lora", "merriweather", "poppins"]).default("merriweather"),
  theme: z.enum(["light", "dark"]).default("dark"),
  textSize: z.enum(["small", "medium", "large"]).default("medium"),
  particlesEnabled: z.boolean().default(true),
  musicEnabled: z.boolean().default(true),
});

export type UserSettings = z.infer<typeof userSettingsSchema>;

// Site configuration schema (stored in Firestore)
export const siteConfigSchema = z.object({
  id: z.string().optional(),
  primaryColor: z.string().default("270 70% 55%"),
  accentColor: z.string().default("300 35% 90%"),
  secondaryColor: z.string().default("280 25% 85%"),
  backgroundColor: z.string().default("240 25% 97%"),
  foregroundColor: z.string().default("240 20% 15%"),
  heroTitle: z.string().default("Histórias Mágicas"),
  heroSubtitle: z.string().default("Embarque em uma jornada através de contos encantadores, embalados por músicas suaves e uma atmosfera de noite estrelada."),
  customHTML: z.string().default(""),
  updatedAt: z.number().optional(),
});

export const insertSiteConfigSchema = siteConfigSchema.omit({
  id: true,
  updatedAt: true,
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type InsertSiteConfig = z.infer<typeof insertSiteConfigSchema>;

// Admin credentials
export const ADMIN_PASSWORD = "jem1505";
