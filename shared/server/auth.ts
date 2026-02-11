import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { Express } from "express";
import session from "express-session";
import MemoryStore from "memorystore";

export function setupAuth(app: Express) {
  const SessionStore = MemoryStore(session);
  
  app.use(session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: new SessionStore({ checkPeriod: 86400000 })
  }));

  // فەنکشنی لۆگین و دروستکردنی ئەدمین
  app.post("/api/login", async (req, res) => {
    const { fullName, militaryId } = req.body;

    try {
      // ١. گەڕان بەدوای بەکارهێنەر
      let user = await db.query.users.findFirst({
        where: eq(users.militaryId, militaryId)
      });

      // ٢. ئەگەر نەبوو، دروستی بکە و لێرەدا دیاری بکە کێ ئەدمین بێت
      if (!user) {
        // لێرەدا دەتوانیت ژمارە سەربازییەکەی خۆت بنووسیت بۆ ئەوەی ببیتە ئەدمین
        const role = (militaryId === "123456" || fullName === "admin") ? "admin" : "officer";

        const [newUser] = await db.insert(users).values({
          fullName,
          militaryId,
          role
        }).returning();
        user = newUser;
      }

      // ٣. پاشەکەوتکردن لە سێشن
      (req.session as any).userId = user.id;
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("هەڵەیەک ڕوویدا لە کاتی لۆگین");
    }
  });

  app.get("/api/user", async (req, res) => {
    const userId = (req.session as any).userId;
    if (!userId) return res.status(401).send("چوونەژوورەوە پێویستە");
    
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });
    res.json(user);
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy(() => res.sendStatus(200));
  });
}