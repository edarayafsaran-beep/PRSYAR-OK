import express, { type Express } from "express";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function serveStatic(app: Express) {
  const distPath = resolve(__dirname, "..", "public"); 
  
  app.use(express.static(distPath));
  
  // لێرە کێشەکە هەبوو، پێویستە (.*) بێت نەک تەنها *
  app.get("(.*)", (_req, res) => {
    res.sendFile(resolve(distPath, "index.html"));
  });
}