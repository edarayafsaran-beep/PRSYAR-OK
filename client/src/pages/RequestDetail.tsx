import { useRoute, Link } from "wouter";
import { useRequest, useReplyRequest } from "@/hooks/use-requests";
import { useAuth } from "@/hooks/use-auth";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ArrowRight, User, Paperclip, Send, Loader2, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { motion } from "framer-motion";

export default function RequestDetail() {
  const [, params] = useRoute("/requests/:id");
  const id = Number(params?.id);
  
  const { user } = useAuth();
  const { data: request, isLoading } = useRequest(id);
  const { mutate: reply, isPending: isReplying } = useReplyRequest();
  
  const [replyContent, setReplyContent] = useState("");

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!request) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">داواکاری نەدۆزرایەوە</h2>
          <Link href="/dashboard">
            <Button className="mt-4">گەڕانەوە بۆ سەرەکی</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const isAdmin = user?.role === 'admin';

  const handleReply = () => {
    if (!replyContent.trim()) return;
    reply({ id, content: replyContent }, {
      onSuccess: () => setReplyContent("")
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Link href={isAdmin ? "/admin" : "/dashboard"} className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowRight className="w-4 h-4 ml-1" />
          گەڕانەوە
        </Link>

        {/* Request Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{request.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{request.user.fullName}</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-xs ml-1">{request.user.militaryId}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(request.createdAt!), "yyyy/MM/dd HH:mm")}</span>
                    </div>
                  </div>
                </div>
                <StatusBadge status={request.status as any} className="self-start text-sm px-4 py-1.5" />
              </div>

              <div className="prose prose-slate max-w-none mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
                <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-800">{request.content}</p>
              </div>

              {request.attachments && request.attachments.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">هاوپێچەکان</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {request.attachments.map((file) => (
                      <a 
                        key={file.id} 
                        href={file.fileUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center p-3 bg-white border border-slate-200 rounded-lg hover:border-primary hover:shadow-md transition-all group"
                      >
                        <div className="p-2 bg-slate-100 rounded group-hover:bg-primary/10 transition-colors">
                          <Paperclip className="w-5 h-5 text-gray-500 group-hover:text-primary" />
                        </div>
                        <div className="mr-3 flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.fileName}</p>
                          <p className="text-xs text-muted-foreground uppercase">{file.fileType}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Replies Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            وەڵامەکان
          </h2>

          {request.replies && request.replies.length > 0 ? (
            <div className="space-y-4">
              {request.replies.map((reply) => (
                <motion.div 
                  key={reply.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border-r-4 border-r-primary rounded-l-xl shadow-sm p-6 ml-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-bold text-sm block">بەڕێوەبەرایەتی</span>
                        <span className="text-xs text-muted-foreground">{format(new Date(reply.createdAt!), "yyyy/MM/dd HH:mm")}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap">{reply.content}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-muted-foreground">هیچ وەڵامێک نییە تا ئێستا</p>
            </div>
          )}

          {/* Admin Reply Form */}
          {isAdmin && request.status === 'pending' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-slate-200"
            >
              <h3 className="text-lg font-semibold mb-4 text-primary">نووسینی وەڵام</h3>
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="وەڵامەکەت لێرە بنووسە..."
                className="min-h-[150px] mb-4 text-base"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleReply} 
                  disabled={isReplying || !replyContent.trim()}
                  className="bg-primary hover:bg-primary/90 min-w-[120px]"
                >
                  {isReplying ? "ناردن..." : (
                    <>
                      ناردنی وەڵام
                      <Send className="w-4 h-4 mr-2 rtl-flip" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}