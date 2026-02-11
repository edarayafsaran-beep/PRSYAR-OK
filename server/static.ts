import express, { type Express } from "express";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function serveStatic(app: Express) {
  const distPath = resolve(__dirname, "..", "public"); 
  
  app.use(express.static(distPath));
  
  // لێرەدا لەبری نیشانەی ئەستێرە یان (.*)، ئەم شێوازە بەکار دێنین:
  app.get("*", (_req, res, next) => {
    // ئەگەر داواکارییەکە بۆ API نەبوو، ئینجا index.html بنێرە
    if (_req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(resolve(distPath, "index.html"));
  });
}