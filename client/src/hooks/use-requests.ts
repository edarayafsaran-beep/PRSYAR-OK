import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type RequestListResponse, type RequestDetailResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Fetch all requests (for admin or user depending on role handled by backend)
export function useRequests() {
  return useQuery({
    queryKey: [api.requests.list.path],
    queryFn: async () => {
      const res = await fetch(api.requests.list.path);
      if (!res.ok) throw new Error("Failed to fetch requests");
      return api.requests.list.responses[200].parse(await res.json());
    },
  });
}

// Fetch single request
export function useRequest(id: number) {
  return useQuery({
    queryKey: [api.requests.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.requests.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch request details");
      return api.requests.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// Create new request
export function useCreateRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: z.infer<typeof api.requests.create.input>) => {
      const res = await fetch(api.requests.create.path, {
        method: api.requests.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create request");
      }

      return api.requests.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.requests.list.path] });
      toast({
        title: "نێردرا",
        description: "داواکاریەکەت بە سەرکەوتوویی نێردرا",
        className: "bg-green-600 text-white border-none",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "هەڵە",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Reply to request (Admin only)
export function useReplyRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      const url = buildUrl(api.requests.reply.path, { id });
      const res = await fetch(url, {
        method: api.requests.reply.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to send reply");
      }

      return api.requests.reply.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.requests.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.requests.get.path, variables.id] });
      toast({
        title: "نێردرا",
        description: "وەڵامەکەت بە سەرکەوتوویی تۆمارکرا",
        className: "bg-green-600 text-white border-none",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "هەڵە",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
