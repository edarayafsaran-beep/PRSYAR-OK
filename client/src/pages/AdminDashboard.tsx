import { useState } from "react";
import { useRequests } from "@/hooks/use-requests";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/StatusBadge";
import { Link } from "wouter";
import { Search, Filter, Loader2, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { data: requests, isLoading } = useRequests();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const filteredRequests = requests?.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.user.militaryId.includes(search);
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && r.status === activeTab;
  }) || [];

  return (
    <Layout>
      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">بەڕێوەبەرایەتی</h1>
          <p className="text-muted-foreground mt-1">بەڕێوەبردنی هەموو داواکاریەکان</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="گەڕان بەپێی ناو، ID، یان بابەت..." 
              className="pr-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="bg-slate-100">
              <TabsTrigger value="all">هەمووی</TabsTrigger>
              <TabsTrigger value="pending">چاوەڕوان</TabsTrigger>
              <TabsTrigger value="answered">وەڵامدراوە</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">ناو / ID</th>
                <th className="px-6 py-4">بابەت</th>
                <th className="px-6 py-4">رێکەوت</th>
                <th className="px-6 py-4">دۆخ</th>
                <th className="px-6 py-4">کردار</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    هیچ داواکاریەک نەدۆزرایەوە
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request, i) => (
                  <motion.tr 
                    key={request.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{request.user.fullName}</div>
                      <div className="text-xs text-muted-foreground font-mono">{request.user.militaryId}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={request.title}>
                      {request.title}
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {format(new Date(request.createdAt!), "yyyy/MM/dd")}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={request.status as any} />
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/requests/${request.id}`}>
                        <Button variant="outline" size="sm" className="gap-2 hover:bg-white hover:border-primary hover:text-primary transition-all">
                          بینین
                          <ChevronLeft className="w-3 h-3" />
                        </Button>
                      </Link>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
