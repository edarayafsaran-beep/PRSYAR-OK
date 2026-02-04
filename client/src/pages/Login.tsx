import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Shield, ScanLine } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const { login, isLoggingIn } = useAuth();
  const [fullName, setFullName] = useState("");
  const [militaryId, setMilitaryId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ fullName, militaryId });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-2xl shadow-xl flex items-center justify-center mb-4 rotate-3 border-4 border-white">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary text-center">وەزارەتی پێشمەرگە</h1>
          <p className="text-slate-500 mt-2 text-center text-sm">سیستەمی پەیوەندی و پرسیارکردنی ئەفسەران</p>
        </div>

        <Card className="border-t-4 border-t-primary shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-2 text-center">
            <CardTitle className="text-2xl">چوونەژوورەوە</CardTitle>
            <CardDescription className="text-base">
              تکایە زانیاریەکانت بنووسە یان ناسنامەکەت سکان بکە
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-right block">ناوی تەواو</Label>
                <Input
                  id="fullName"
                  placeholder="ناوی سیانی بنووسە"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-slate-50 h-12 text-lg text-right"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="militaryId" className="text-right block">ژمارەی ناسنامەی سەربازی</Label>
                <div className="relative">
                  <Input
                    id="militaryId"
                    placeholder="ID سکان بکە یان بنووسە"
                    value={militaryId}
                    onChange={(e) => setMilitaryId(e.target.value)}
                    className="bg-slate-50 h-12 text-lg text-right pl-10 font-mono"
                    required
                  />
                  <ScanLine className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full h-12 text-lg bg-primary hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "جێبەجێکردن..." : "چوونەژوورەوە"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          ئەم سیستەمە پارێزراوە و تەنها بۆ بەکارهێنانی فەرمی ڕێگەپێدراوە.
        </p>
      </motion.div>
    </div>
  );
}
