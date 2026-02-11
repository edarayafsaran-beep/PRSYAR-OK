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
  interface SessionData { userId: number; }
}

const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: uploadStorage });

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  const SessionStore = MemoryStore(session);
  app.use(session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    store: new SessionStore({ checkPeriod: 86400000 }),
    cookie: { secure: process.env.NODE_ENV === "production", maxAge: 24*60*60*1000, sameSite: "lax" }
  }));

  app.use("/uploads", express.static("uploads"));

  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });
    next();
  };

  // Login route
  app.post(api.auth.login.path, async (req: Request, res: Response) => {
    const { militaryId, fullName } = req.body;
    if (!militaryId || !fullName) return res.status(400).json({ message: "Invalid input" });

    let user = await db.getUserByMilitaryId(militaryId);
    if (!user) {
      user = await db.createUser({ fullName, militaryId, role: militaryId === "ADMIN123" ? "admin" : "officer" });
      // Auto-create sample request for new officer
      if (user.role === "officer") {
        await db.createRequest(user.id, { title: "Sample Request", content: "This request was auto-created.", attachments: [] });
      }
    }
    req.session.userId = user.id;
    res.json(user);
  });

  app.post(api.auth.logout.path, (req, res) => req.session.destroy(() => res.sendStatus(200)));

  app.get(api.auth.me.path, async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "Not logged in" });
    const user = await db.getUser(req.session.userId);
    res.json(user);
  });

  // Upload route
  app.post("/api/upload", requireAuth, upload.single("file"), (req: any, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });
    res.json({ fileName: file.originalname, fileUrl: `/uploads/${file.filename}`, fileType: file.mimetype });
  });

  // Requests routes
  app.get(api.requests.list.path, requireAuth, async (req: any, res) => {
    const user = await db.getUser(req.session.userId!);
    if (!user) return res.sendStatus(401);
    if (user.role === "admin") res.json(await db.getAllRequests());
    else res.json(await db.getRequestsByUser(user.id));
  });

  app.post(api.requests.create.path, requireAuth, async (req: any, res) => {
    const user = await db.getUser(req.session.userId!);
    const input = req.body;
    const request = await db.createRequest(user!.id, { title: input.title, content: input.content, attachments: input.attachments || [] });
    res.status(201).json(request);
  });

  app.post(api.requests.reply.path, requireAuth, async (req: any, res) => {
    const user = await db.getUser(req.session.userId!);
    if (user?.role !== "admin") return res.status(403).json({ message: "Admin only" });
    const reply = await db.createReply({ requestId: parseInt(req.params.id), adminId: user.id, content: req.body.content });
    res.status(201).json(reply);
  });

  await seed();
  return httpServer;
}

async function seed() {
  const existing = await db.getAllRequests();
  if (existing.length === 0) {
    console.log("Seeding database...");
    const admin = await db.createUser({ fullName: "Admin Officer", militaryId: "ADMIN123", role: "admin" });
    const officer = await db.createUser({ fullName: "Sarbaz Ahmed", militaryId: "987654321", role: "officer" });
    await db.createRequest(officer.id, { title: "Initial Request", content: "Auto-created request.", attachments: [] });
  }
}