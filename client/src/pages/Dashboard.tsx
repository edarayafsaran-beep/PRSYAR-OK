import { useAuth } from "@/hooks/use-auth";
import { useRequests } from "@/hooks/use-requests";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Search, FileText, ChevronLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: requests, isLoading } = useRequests();
  const [search, setSearch] = useState("");

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const filteredRequests = requests?.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.content.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">داواکاریەکانی من</h1>
          <p className="text-muted-foreground mt-1">سەرجەم پرسیار و داواکاریەکانت لێرە ببینە</p>
        </div>
        <Link href="/requests/new">
          <Button className="h-12 px-6 bg-accent text-accent-foreground hover:bg-accent/90 font-bold shadow-lg hover:shadow-xl transition-all">
            <Plus className="w-5 h-5 ml-2" />
            داواکاری نوێ
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-muted-foreground text-sm font-medium mb-1">کۆی گشتی</div>
          <div className="text-3xl font-bold text-slate-900">{requests?.length || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-muted-foreground text-sm font-medium mb-1">چاوەڕوان</div>
          <div className="text-3xl font-bold text-yellow-600">
            {requests?.filter(r => r.status === 'pending').length || 0}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-muted-foreground text-sm font-medium mb-1">وەڵامدراوەتەوە</div>
          <div className="text-3xl font-bold text-green-600">
            {requests?.filter(r => r.status === 'answered').length || 0}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="گەڕان لە داواکاریەکان..." 
              className="pr-9 bg-white border-slate-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100">
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <FileText className="w-16 h-16 mx-auto mb-4 text-slate-200" />
              <p>هیچ داواکاریەک نەدۆزرایەوە</p>
            </div>
          ) : (
            filteredRequests.map((request, i) => (
              <motion.div 
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/requests/${request.id}`} className="block group hover:bg-slate-50 transition-colors">
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <StatusBadge status={request.status as "pending" | "answered"} />
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(request.createdAt!), "yyyy/MM/dd HH:mm")}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                        {request.title}
                      </h3>
                      <p className="text-sm text-gray-500 truncate max-w-2xl mt-1">
                        {request.content}
                      </p>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
