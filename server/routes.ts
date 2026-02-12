import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { db } from "./firebaseAdmin";
import { insertStorySchema, ADMIN_PASSWORD } from "@shared/schema";
import { z } from "zod";
import session from "express-session";

// Session middleware
declare module 'express-session' {
  interface SessionData {
    isAdmin?: boolean;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'contos-para-dormir-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Admin middleware
  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.isAdmin) {
      return next();
    }
    return res.status(403).json({ error: "Admin access required" });
  };

  // Auth routes
  app.post("/api/auth/admin", async (req, res) => {
    try {
      const { password } = req.body;
      
      if (password === ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        return res.json({ success: true });
      }
      
      return res.status(401).json({ error: "Invalid password" });
    } catch (error) {
      console.error("Error in admin auth:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/check", async (req, res) => {
    res.json({ isAdmin: !!req.session.isAdmin });
  });

  // GET all stories
  app.get("/api/stories", async (req, res) => {
    try {
      const storiesRef = db.collection("stories");
      const snapshot = await storiesRef.get();
      
      const stories = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          content: data.content,
          coverImageUrl: data.coverImageUrl,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      });

      // Sort by createdAt descending
      stories.sort((a, b) => b.createdAt - a.createdAt);

      res.json(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ error: "Failed to fetch stories" });
    }
  });

  // GET single story
  app.get("/api/stories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const storyRef = db.collection("stories").doc(id);
      const storyDoc = await storyRef.get();

      if (!storyDoc.exists) {
        return res.status(404).json({ error: "Story not found" });
      }

      const data = storyDoc.data()!;
      const story = {
        id: storyDoc.id,
        title: data.title,
        content: data.content,
        coverImageUrl: data.coverImageUrl,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };

      res.json(story);
    } catch (error) {
      console.error("Error fetching story:", error);
      res.status(500).json({ error: "Failed to fetch story" });
    }
  });

  // POST create story (admin only)
  app.post("/api/stories", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertStorySchema.parse(req.body);

      const now = Date.now();
      const docRef = await db.collection("stories").add({
        ...validatedData,
        createdAt: now,
        updatedAt: now,
      });

      res.status(201).json({
        id: docRef.id,
        ...validatedData,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error creating story:", error);
      res.status(500).json({ error: "Failed to create story" });
    }
  });

  // PUT update story (admin only)
  app.put("/api/stories/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertStorySchema.parse(req.body);

      const storyRef = db.collection("stories").doc(id);
      const storyDoc = await storyRef.get();

      if (!storyDoc.exists) {
        return res.status(404).json({ error: "Story not found" });
      }

      const now = Date.now();
      await storyRef.update({
        ...validatedData,
        updatedAt: now,
      });

      const data = storyDoc.data()!;
      res.json({
        id,
        ...validatedData,
        createdAt: data.createdAt,
        updatedAt: now,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error updating story:", error);
      res.status(500).json({ error: "Failed to update story" });
    }
  });

  // DELETE story (admin only)
  app.delete("/api/stories/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const storyRef = db.collection("stories").doc(id);
      const storyDoc = await storyRef.get();

      if (!storyDoc.exists) {
        return res.status(404).json({ error: "Story not found" });
      }

      await storyRef.delete();
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting story:", error);
      res.status(500).json({ error: "Failed to delete story" });
    }
  });

  // GET all music
  app.get("/api/music", async (req, res) => {
    try {
      const musicRef = db.collection("music");
      const snapshot = await musicRef.get();
      
      const musicList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          url: data.url,
          uploadedAt: data.uploadedAt,
        };
      });

      // Sort by uploadedAt descending
      musicList.sort((a, b) => b.uploadedAt - a.uploadedAt);

      res.json(musicList);
    } catch (error) {
      console.error("Error fetching music:", error);
      res.status(500).json({ error: "Failed to fetch music" });
    }
  });

  // DELETE music (admin only)
  app.delete("/api/music/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const musicRef = db.collection("music").doc(id);
      const musicDoc = await musicRef.get();

      if (!musicDoc.exists) {
        return res.status(404).json({ error: "Music not found" });
      }

      await musicRef.delete();
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting music:", error);
      res.status(500).json({ error: "Failed to delete music" });
    }
  });

  // GET site config
  app.get("/api/site-config", async (req, res) => {
    try {
      const configRef = db.collection("site").doc("config");
      const configDoc = await configRef.get();
      
      if (configDoc.exists) {
        res.json(configDoc.data());
      } else {
        res.json({
          primaryColor: "270 70% 55%",
          accentColor: "300 35% 90%",
          secondaryColor: "280 25% 85%",
          backgroundColor: "240 25% 97%",
          foregroundColor: "240 20% 15%",
          heroTitle: "Histórias Mágicas",
          heroSubtitle: "Embarque em uma jornada através de contos encantadores, embalados por músicas suaves e uma atmosfera de noite estrelada.",
        });
      }
    } catch (error) {
      console.error("Error fetching site config:", error);
      res.status(500).json({ error: "Failed to fetch site config" });
    }
  });

  // PUT update site config (admin only)
  app.put("/api/site-config", requireAdmin, async (req, res) => {
    try {
      const config = req.body;
      const configRef = db.collection("site").doc("config");
      
      await configRef.set({
        ...config,
        updatedAt: Date.now(),
      }, { merge: true });

      res.json({ success: true, data: config });
    } catch (error) {
      console.error("Error updating site config:", error);
      res.status(500).json({ error: "Failed to update site config" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
