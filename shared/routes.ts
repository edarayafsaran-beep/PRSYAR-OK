
import { z } from 'zod';
import { insertRequestSchema, insertReplySchema, loginSchema, requests, users, replies, attachments } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: loginSchema,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.void(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  requests: {
    list: {
      method: 'GET' as const,
      path: '/api/requests',
      responses: {
        200: z.array(z.custom<typeof requests.$inferSelect & {
          user: typeof users.$inferSelect;
          attachments: typeof attachments.$inferSelect[];
          replies: typeof replies.$inferSelect[];
        }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/requests',
      input: z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        attachments: z.array(z.object({
          fileName: z.string(),
          fileUrl: z.string(),
          fileType: z.string(),
        })).optional(),
      }),
      responses: {
        201: z.custom<typeof requests.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/requests/:id',
      responses: {
        200: z.custom<typeof requests.$inferSelect & {
          user: typeof users.$inferSelect;
          attachments: typeof attachments.$inferSelect[];
          replies: (typeof replies.$inferSelect & { admin: typeof users.$inferSelect })[];
        }>(),
        404: errorSchemas.notFound,
      },
    },
    reply: {
      method: 'POST' as const,
      path: '/api/requests/:id/reply',
      input: z.object({
        content: z.string().min(1),
      }),
      responses: {
        201: z.custom<typeof replies.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type LoginInput = z.infer<typeof api.auth.login.input>;
export type RequestListResponse = z.infer<typeof api.requests.list.responses[200]>;
export type RequestDetailResponse = z.infer<typeof api.requests.get.responses[200]>;