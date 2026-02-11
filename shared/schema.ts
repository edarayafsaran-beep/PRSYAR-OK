
import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Users (Officers and Admins)
// For this system, "login" is just entering name and military ID.
// We store them to track history.
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  militaryId: varchar("military_id", { length: 50 }).notNull().unique(), // Scanned ID
  role: text("role", { enum: ["officer", "admin"] }).default("officer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Requests/Questions
export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(), // Who asked
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: text("status", { enum: ["pending", "answered"] }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Attachments (Files)
export const attachments = pgTable("attachments", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").references(() => requests.id).notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(), // image, pdf, doc, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Replies (Answers from Ministry)
export const replies = pgTable("replies", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").references(() => requests.id).notNull(),
  adminId: integer("admin_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===
export const usersRelations = relations(users, ({ many }) => ({
  requests: many(requests),
  replies: many(replies),
}));

export const requestsRelations = relations(requests, ({ one, many }) => ({
  user: one(users, {
    fields: [requests.userId],
    references: [users.id],
  }),
  attachments: many(attachments),
  replies: many(replies),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  request: one(requests, {
    fields: [attachments.requestId],
    references: [requests.id],
  }),
}));

export const repliesRelations = relations(replies, ({ one }) => ({
  request: one(requests, {
    fields: [replies.requestId],
    references: [requests.id],
  }),
  admin: one(users, {
    fields: [replies.adminId],
    references: [users.id],
  }),
}));

// === BASE SCHEMAS ===
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertRequestSchema = createInsertSchema(requests).omit({ id: true, status: true, createdAt: true, updatedAt: true });
export const insertAttachmentSchema = createInsertSchema(attachments).omit({ id: true, createdAt: true });
export const insertReplySchema = createInsertSchema(replies).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===

// Login
export const loginSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  militaryId: z.string().min(1, "Military ID is required"),
});
export type LoginRequest = z.infer<typeof loginSchema>;

// Users
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Requests
export type Request = typeof requests.$inferSelect;
export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type CreateRequestInput = {
  title: string;
  content: string;
  attachments?: { fileName: string; fileUrl: string; fileType: string }[];
};

// Attachments
export type Attachment = typeof attachments.$inferSelect;

// Replies
export type Reply = typeof replies.$inferSelect;
export type InsertReply = z.infer<typeof insertReplySchema>;

// Responses with relations
export type RequestWithDetails = Request & {
  user: User;
  attachments: Attachment[];
  replies: (Reply & { admin: User })[];
};