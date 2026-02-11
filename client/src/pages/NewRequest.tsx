import { useState } from "react";
import { useCreateRequest } from "@/hooks/use-requests";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Paperclip, Send, X, File as FileIcon } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

export default function NewRequest() {
  const [, setLocation] = useLocation();
  const { mutate: createRequest, isPending } = useCreateRequest();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  // Mock file attachments for UI demo
  const [attachments, setAttachments] = useState<{name: string, type: string}[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAttachments([...attachments, { name: file.name, type: file.type }]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRequest({
      title,
      content,
      attachments: attachments.map(f => ({
        fileName: f.name,
        fileUrl: "https://example.com/mock-url", // Mock URL in this demo
        fileType: f.type
      }))
    }, {
      onSuccess: () => setLocation("/dashboard")
    });
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowRight className="w-4 h-4 ml-1" />
          گەڕانەوە
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-t-4 border-t-accent shadow-lg">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-2xl">داواکاری نوێ</CardTitle>
              <p className="text-muted-foreground text-sm">تکایە وردەکاری داواکاریەکەت بە ڕوونی بنووسە</p>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-semibold">بابەت / نیشان</Label>
                  <Input
                    id="title"
                    placeholder="سەردێڕی داواکاری..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="h-12 text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-base font-semibold">ناوەڕۆک</Label>
                  <Textarea
                    id="content"
                    placeholder="وردەکاری داواکاریەکەت بنووسە..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="min-h-[200px] text-base resize-y"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">هاوپێچکردنی فایل</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        <FileIcon className="w-4 h-4 ml-2 text-primary" />
                        <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                        <button type="button" onClick={() => removeAttachment(idx)} className="mr-2 text-slate-400 hover:text-red-500">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="file" 
                      id="file-upload" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                    <Label htmlFor="file-upload" className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 hover:border-primary text-slate-600 transition-all w-full h-24 flex-col gap-2">
                      <Paperclip className="w-6 h-6" />
                      <span className="text-sm">کلیک بکە بۆ هەڵبژاردنی فایل (PDF, Word, Wêne)</span>
                    </Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 bg-slate-50 p-6 border-t">
                <Link href="/dashboard">
                  <Button type="button" variant="outline" className="h-11 px-6">هەڵوەشاندنەوە</Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="h-11 px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                >
                  {isPending ? (
                    "ناردن..."
                  ) : (
                    <>
                      ناردن
                      <Send className="w-4 h-4 mr-2 rtl-flip" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}