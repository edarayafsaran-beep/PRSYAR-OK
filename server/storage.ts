import { db } from "./db";
import {
  users,
  requests,
  attachments,
  replies,
  type User,
  type InsertUser,
  type Request,
  type InsertRequest,
  type CreateRequestInput,
  type Reply,
  type InsertReply,
  type RequestWithDetails,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByMilitaryId(militaryId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Requests
  getRequestsByUser(userId: number): Promise<RequestWithDetails[]>;
  getAllRequests(): Promise<RequestWithDetails[]>;
  getRequest(id: number): Promise<RequestWithDetails | undefined>;
  createRequest(
    userId: number,
    input: CreateRequestInput
  ): Promise<Request>;
  updateRequestStatus(
    id: number,
    status: "pending" | "answered"
  ): Promise<void>;

  // Replies
  createReply(reply: InsertReply): Promise<Reply>;
}

export class DatabaseStorage implements IStorage {
  // ================= USER =================

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByMilitaryId(
    militaryId: string
  ): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.militaryId, militaryId));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // ================= REQUESTS =================

  async getRequestsByUser(
    userId: number
  ): Promise<RequestWithDetails[]> {
    return await db.query.requests.findMany({
      where: eq(requests.userId, userId),
      orderBy: [desc(requests.createdAt)],
      with: {
        user: true,
        attachments: true,
        replies: {
          with: {
            admin: true,
          },
        },
      },
    });
  }

  async getAllRequests(): Promise<RequestWithDetails[]> {
    return await db.query.requests.findMany({
      orderBy: [desc(requests.createdAt)],
      with: {
        user: true,
        attachments: true,
        replies: {
          with: {
            admin: true,
          },
        },
      },
    });
  }

  async getRequest(
    id: number
  ): Promise<RequestWithDetails | undefined> {
    return await db.query.requests.findFirst({
      where: eq(requests.id, id),
      with: {
        user: true,
        attachments: true,
        replies: {
          with: {
            admin: true,
          },
        },
      },
    });
  }

  async createRequest(
    userId: number,
    input: CreateRequestInput
  ): Promise<Request> {
    return await db.transaction(async (tx) => {
      const [newRequest] = await tx
        .insert(requests)
        .values({
          userId,
          title: input.title,
          content: input.content,
          status: "pending",
        })
        .returning();

      if (input.attachments?.length) {
        await tx.insert(attachments).values(
          input.attachments.map((att) => ({
            requestId: newRequest.id,
            fileName: att.fileName,
            fileUrl: att.fileUrl,
            fileType: att.fileType,
          }))
        );
      }

      return newRequest;
    });
  }

  async updateRequestStatus(
    id: number,
    status: "pending" | "answered"
  ): Promise<void> {
    await db.update(requests).set({ status }).where(eq(requests.id, id));
  }

  // ================= REPLIES =================

  async createReply(reply: InsertReply): Promise<Reply> {
    return await db.transaction(async (tx) => {
      const [newReply] = await tx
        .insert(replies)
        .values(reply)
        .returning();

      // Auto update status
      await tx
        .update(requests)
        .set({ status: "answered" })
        .where(eq(requests.id, reply.requestId));

      return newReply;
    });
  }
}

export const storage = new DatabaseStorage();