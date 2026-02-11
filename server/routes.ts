import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage as db } from "./storage"; 
import { api } from "@shared/routes";
import session from "express-session";
import MemoryStore from "memorystore";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

// فۆڵدەر uploads خۆکار دروست دەکرێت
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: uploadStorage });

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // session configuration
  const SessionStore = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "default_secret",
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({ checkPeriod: 86400000 }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "lax",
      },
    })
  );

  app.use("/uploads", express.static(uploadDir));

  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });
    next();
  };

  // Auth routes
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      let user = await db.getUserByMilitaryId(input.militaryId);
      if (!user) {
        user = await db.createUser({
          fullName: input.fullName,
          militaryId: input.militaryId,
          role: input.militaryId === "ADMIN123" ? "admin" : "officer",
        });
      }
      req.session.userId = user.id;
      res.json(user);
    } catch {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => res.sendStatus(200));
  });

  app.get(api.auth.me.path, async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "Not logged in" });
    const user = await db.getUser(req.session.userId);
    res.json(user);
  });

  // Upload route
  app.post("/api/upload", requireAuth, upload.single("file"), (req: any, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });
    res.json({
      fileName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      fileType: file.mimetype,
    });
  });

  // Requests
  app.get(api.requests.list.path, requireAuth, async (req: any, res) => {
    const user = await db.getUser(req.session.userId!);
    if (!user) return res.sendStatus(401);
    const requests = user.role === "admin" ? await db.getAllRequests() : await db.getRequestsByUser(user.id);
    res.json(requests);
  });

  app.post(api.requests.create.path, requireAuth, async (req: any, res) => {
    try {
      const input = api.requests.create.input.parse(req.body);
      const request = await db.createRequest(req.session.userId!, input);
      res.status(201).json(request);
    } catch {
      res.status(400).json({ message: "Validation error" });
    }
  });

  app.get(api.requests.get.path, requireAuth, async (req: any, res) => {
    const id = parseInt(req.params.id as string);
    const request = await db.getRequest(id);
    if (!request) return res.status(404).json({ message: "Not found" });
    const user = await db.getUser(req.session.userId!);
    if (user?.role !== "admin" && request.userId !== user?.id) return res.status(403).json({ message: "Forbidden" });
    res.json(request);
  });

  app.post(api.requests.reply.path, requireAuth, async (req: any, res) => {
    const user = await db.getUser(req.session.userId!);
    if (user?.role !== "admin") return res.status(403).json({ message: "Admin only" });
    try {
      const input = api.requests.reply.input.parse(req.body);
      const reply = await db.createReply({
        requestId: parseInt(req.params.id as string),
        adminId: user.id,
        content: input.content,
      });
      res.status(201).json(reply);
    } catch {
      res.status(400).json({ message: "Error creating reply" });
    }
  });

  await seed();
  return httpServer;
}

// Seed database if empty
async function seed() {
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const existing = await db.getAllRequests();
  if (existing.length === 0) {
    console.log("Seeding database...");
    const admin = await db.createUser({ fullName: "Admin Officer", militaryId: "ADMIN123", role: "admin" });
    const officer = await db.createUser({ fullName: "Sarbaz Ahmed", militaryId: "987654321", role: "officer" });
    await db.createRequest(officer.id, { title: "Dawakarî molet", content: "Tkaya moletm dawet.", attachments: [] });
  }
}