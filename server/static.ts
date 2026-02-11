import express, { type Express } from "express";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function serveStatic(app: Express) {
  const distPath = resolve(__dirname, "..", "dist");
  
  app.use(express.static(distPath));
  
  // SPA fallback: ئەگەر فایلی پێویستی نەمدۆزی، بۆ index.html بگرە
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    // Check if file exists
    const filePath = resolve(distPath, req.path);
    fs.stat(filePath, (err) => {
      if (err) {
        // File not found, serve index.html for SPA routing
        res.sendFile(resolve(distPath, "index.html"));
      } else {
        next();
      }
    });
  });
}