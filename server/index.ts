index.ts
import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.ts"; // لێرە .js لادراوە بۆ ئەوەی کراش نەکات
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

// ڕێکخستنی سەرەتایی بۆ خوێندنەوەی JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// فانکشنی لۆگ بۆ نیشاندانی چالاکییەکان
export function log(message: string, source = "express") {
const formattedTime = new Date().toLocaleTimeString("en-US", {
hour: "numeric",
minute: "2-digit",
second: "2-digit",
hour12: true,
});
console.log(${formattedTime} [${source}] ${message});
}

(async () => {
try {
// ١. دەستپێکردنی ڕێگاکان (Routes)
await registerRoutes(httpServer, app);

// ٢. چارەسەری هەڵەکان (Error Handling)  
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {  
  const status = err.status || err.statusCode || 500;  
  const message = err.message || "Internal Server Error";  
  console.error("Server Error:", err);  
  if (res.headersSent) return next(err);  
  res.status(status).json({ message });  
});  

// ٣. بەشی فایلی ستاتیک بۆ Production  
if (process.env.NODE_ENV === "production") {  
  serveStatic(app);  
} else {  
  const { setupVite } = await import("./vite");  
  await setupVite(httpServer, app);  
}  

// ٤. ڕێکخستنی پۆرت و هۆست بە تایبەت بۆ Railway  
const port = Number(process.env.PORT) || 3000;  
const host = "0.0.0.0"; // زۆر گرنگە بۆ ئەوەی 502 نەمێنێت  

httpServer.listen(port, host, () => {  
  log(`Server is running on http://${host}:${port}`);  
});

} catch (error) {
console.error("Failed to start server:", error);
process.exit(1); // ئەگەر کێشەیەک هەبوو سێرڤەرەکە دەکوژێتەوە تا بزانیت کێشەکە چییە
}
})();