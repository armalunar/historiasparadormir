// server/index-prod.ts
import fs from "node:fs";
import path from "node:path";
import express2 from "express";

// server/app.ts
import express from "express";

// server/routes.ts
import { createServer } from "http";

// server/firebaseAdmin.ts
import admin from "firebase-admin";
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")
    }),
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET
  });
}
var db = admin.firestore();
var storage = admin.storage();

// shared/schema.ts
import { z } from "zod";
var storySchema = z.object({
  id: z.string(),
  title: z.string().min(1, "T\xEDtulo \xE9 obrigat\xF3rio"),
  content: z.string().min(1, "Conte\xFAdo \xE9 obrigat\xF3rio"),
  coverImageUrl: z.string().min(1, "Imagem \xE9 obrigat\xF3ria"),
  createdAt: z.number(),
  updatedAt: z.number()
});
var insertStorySchema = storySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var musicSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome \xE9 obrigat\xF3rio"),
  url: z.string().url("URL do arquivo inv\xE1lida"),
  uploadedAt: z.number()
});
var insertMusicSchema = musicSchema.omit({
  id: true,
  uploadedAt: true
});
var userSettingsSchema = z.object({
  font: z.enum(["lora", "merriweather", "poppins"]).default("merriweather"),
  theme: z.enum(["light", "dark"]).default("dark"),
  textSize: z.enum(["small", "medium", "large"]).default("medium"),
  particlesEnabled: z.boolean().default(true),
  musicEnabled: z.boolean().default(true)
});
var siteConfigSchema = z.object({
  id: z.string().optional(),
  primaryColor: z.string().default("270 70% 55%"),
  accentColor: z.string().default("300 35% 90%"),
  secondaryColor: z.string().default("280 25% 85%"),
  backgroundColor: z.string().default("240 25% 97%"),
  foregroundColor: z.string().default("240 20% 15%"),
  heroTitle: z.string().default("Hist\xF3rias M\xE1gicas"),
  heroSubtitle: z.string().default("Embarque em uma jornada atrav\xE9s de contos encantadores, embalados por m\xFAsicas suaves e uma atmosfera de noite estrelada."),
  customHTML: z.string().default(""),
  updatedAt: z.number().optional()
});
var insertSiteConfigSchema = siteConfigSchema.omit({
  id: true,
  updatedAt: true
});
var ADMIN_PASSWORD = "jem1505";

// server/routes.ts
import { z as z2 } from "zod";
import session from "express-session";
async function registerRoutes(app2) {
  app2.use(
    session({
      secret: process.env.SESSION_SECRET || "contos-para-dormir-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1e3
        // 24 hours
      }
    })
  );
  const requireAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
      return next();
    }
    return res.status(403).json({ error: "Admin access required" });
  };
  app2.post("/api/auth/admin", async (req, res) => {
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
  app2.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });
  app2.get("/api/auth/check", async (req, res) => {
    res.json({ isAdmin: !!req.session.isAdmin });
  });
  app2.get("/api/stories", async (req, res) => {
    try {
      const storiesRef = db.collection("stories");
      const snapshot = await storiesRef.get();
      const stories = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          content: data.content,
          coverImageUrl: data.coverImageUrl,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        };
      });
      stories.sort((a, b) => b.createdAt - a.createdAt);
      res.json(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ error: "Failed to fetch stories" });
    }
  });
  app2.get("/api/stories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const storyRef = db.collection("stories").doc(id);
      const storyDoc = await storyRef.get();
      if (!storyDoc.exists) {
        return res.status(404).json({ error: "Story not found" });
      }
      const data = storyDoc.data();
      const story = {
        id: storyDoc.id,
        title: data.title,
        content: data.content,
        coverImageUrl: data.coverImageUrl,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
      res.json(story);
    } catch (error) {
      console.error("Error fetching story:", error);
      res.status(500).json({ error: "Failed to fetch story" });
    }
  });
  app2.post("/api/stories", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertStorySchema.parse(req.body);
      const now = Date.now();
      const docRef = await db.collection("stories").add({
        ...validatedData,
        createdAt: now,
        updatedAt: now
      });
      res.status(201).json({
        id: docRef.id,
        ...validatedData,
        createdAt: now,
        updatedAt: now
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error creating story:", error);
      res.status(500).json({ error: "Failed to create story" });
    }
  });
  app2.put("/api/stories/:id", requireAdmin, async (req, res) => {
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
        updatedAt: now
      });
      const data = storyDoc.data();
      res.json({
        id,
        ...validatedData,
        createdAt: data.createdAt,
        updatedAt: now
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error updating story:", error);
      res.status(500).json({ error: "Failed to update story" });
    }
  });
  app2.delete("/api/stories/:id", requireAdmin, async (req, res) => {
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
  app2.get("/api/music", async (req, res) => {
    try {
      const musicRef = db.collection("music");
      const snapshot = await musicRef.get();
      const musicList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          url: data.url,
          uploadedAt: data.uploadedAt
        };
      });
      musicList.sort((a, b) => b.uploadedAt - a.uploadedAt);
      res.json(musicList);
    } catch (error) {
      console.error("Error fetching music:", error);
      res.status(500).json({ error: "Failed to fetch music" });
    }
  });
  app2.delete("/api/music/:id", requireAdmin, async (req, res) => {
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
  app2.get("/api/site-config", async (req, res) => {
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
          heroTitle: "Hist\xF3rias M\xE1gicas",
          heroSubtitle: "Embarque em uma jornada atrav\xE9s de contos encantadores, embalados por m\xFAsicas suaves e uma atmosfera de noite estrelada."
        });
      }
    } catch (error) {
      console.error("Error fetching site config:", error);
      res.status(500).json({ error: "Failed to fetch site config" });
    }
  });
  app2.put("/api/site-config", requireAdmin, async (req, res) => {
    try {
      const config = req.body;
      const configRef = db.collection("site").doc("config");
      await configRef.set({
        ...config,
        updatedAt: Date.now()
      }, { merge: true });
      res.json({ success: true, data: config });
    } catch (error) {
      console.error("Error updating site config:", error);
      res.status(500).json({ error: "Failed to update site config" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/app.ts
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
var app = express();
app.use(express.json({
  limit: "50mb",
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
async function runApp(setup) {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  await setup(app, server);
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
}

// server/index-prod.ts
async function serveStatic(app2, _server) {
  const distPath = path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
(async () => {
  await runApp(serveStatic);
})();
export {
  serveStatic
};
