// server/index.ts
import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { testConnection } from "./db";

const app = express();
const httpServer = createServer(app);

// JSON parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  console.log(`${new Date().toLocaleTimeString()} [${source}] ${message}`);
}

(async () => {
  try {
    await testConnection();
    await registerRoutes(httpServer, app);

    app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("Server Error:", err);
      if (res.headersSent) return next(err);
      res.status(status).json({ message });
    });

    if (process.env.NODE_ENV === "production") serveStatic(app);
    else { const { setupVite } = await import("./vite"); await setupVite(httpServer, app); }

    const port = Number(process.env.PORT) || 3000;
    const host = "0.0.0.0";
    httpServer.listen(port, host, () => log(`Server running at http://${host}:${port}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();