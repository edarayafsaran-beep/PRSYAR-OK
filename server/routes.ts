
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";

// Session type augmentation
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

// Multer setup
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = "uploads";
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  })
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session middleware
  const SessionStore = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "default_secret",
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({
        checkPeriod: 86400000,
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Serve uploaded files
  app.use("/uploads", express.static("uploads"));

  // Auth Middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // === Auth Routes ===
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);

      let user = await storage.getUserByMilitaryId(input.militaryId);

      if (!user) {
        // Auto-register for MVP
        user = await storage.createUser({
          fullName: input.fullName,
          militaryId: input.militaryId,
          role: input.militaryId === "ADMIN123" ? "admin" : "officer",
        });
      }

      req.session.userId = user.id;
      res.json(user);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.sendStatus(200);
    });
  });

  app.get(api.auth.me.path, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not logged in" });
    }
    const user = await storage.getUser(req.session.userId);
    res.json(user);
  });

  // === Upload Route ===
  app.post("/api/upload", requireAuth, upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      fileName: req.file.originalname,
      fileUrl: fileUrl,
      fileType: req.file.mimetype
    });
  });

  // === Request Routes ===
  app.get(api.requests.list.path, requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) return res.sendStatus(401);

    if (user.role === "admin") {
      const allRequests = await storage.getAllRequests();
      res.json(allRequests);
    } else {
      const myRequests = await storage.getRequestsByUser(user.id);
      res.json(myRequests);
    }
  });

  app.post(api.requests.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.requests.create.input.parse(req.body);
      const request = await storage.createRequest(req.session.userId!, input);
      res.status(201).json(request);
    } catch (err) {
      res.status(400).json({ message: "Validation error" });
    }
  });

  app.get(api.requests.get.path, requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const request = await storage.getRequest(id);
    if (!request) return res.status(404).json({ message: "Not found" });

    // Access control
    const user = await storage.getUser(req.session.userId!);
    if (user?.role !== "admin" && request.userId !== user?.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(request);
  });

  app.post(api.requests.reply.path, requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId!);
    if (user?.role !== "admin") return res.status(403).json({ message: "Admin only" });

    try {
      const input = api.requests.reply.input.parse(req.body);
      const requestId = parseInt(req.params.id);

      const reply = await storage.createReply({
        requestId,
        adminId: user.id,
        content: input.content,
      });

      res.status(201).json(reply);
    } catch (err) {
      res.status(400).json({ message: "Error creating reply" });
    }
  });

  // Seed Data
  await seed();

  return httpServer;
}

async function seed() {
  const existing = await storage.getAllRequests();
  if (existing.length === 0) {
    console.log("Seeding database...");
    // Create Admin
    await storage.createUser({
      fullName: "Admin Officer",
      militaryId: "ADMIN123",
      role: "admin",
    });

    // Create User
    const user = await storage.createUser({
      fullName: "Sarbaz Ahmed",
      militaryId: "987654321",
      role: "officer",
    });

    // Create Request
    await storage.createRequest(user.id, {
      title: "Dawakarî molet",
      content: "Tkaya moletm dawet bo mawey 3 rozh.",
      attachments: [],
    });
  }
}