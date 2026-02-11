import express, { type Express, type Request, type Response } from "express";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function serveStatic(app: Express) {
  const distPath = resolve(__dirname, "..", "dist");
  
  console.log(`Serving static files from: ${distPath}`);
  console.log(`Dist folder exists: ${fs.existsSync(distPath)}`);
  
  // Serve static files
  app.use(express.static(distPath));
  
  // SPA fallback - middleware for all non-API routes
  app.use((req: Request, res: Response, next: Function) => {
    // Skip API routes
    if (req.path.startsWith("/api")) {
      return next();
    }
    
    const indexPath = resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Frontend build not found. Run: npm run build");
    }
  });
}