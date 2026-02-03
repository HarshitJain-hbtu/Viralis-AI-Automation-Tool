"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DayPost } from "@/lib/types/aiContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { RocketIcon, AlertCircle, Sparkles, Calendar as CalendarIcon, Save, Copy, BarChart3, Zap, Target } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Schema for form validation
const formSchema = z.object({
  niche: z.string().min(3, "Niche is required"),
  city: z.string().min(2, "City is required"),
  platform: z.enum(["Instagram", "Instagram Reels", "Facebook", "LinkedIn"]),
  brandName: z.string().optional(),
  description: z.string().optional(),
  date: z.date({
    message: "A date is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface PostVariations {
  viral: DayPost;
  reach: DayPost;
  niche: DayPost;
}

// --- Components ---

function PostCard({ post, type, onSave, isSaving }: { post: DayPost; type: 'viral' | 'reach' | 'niche'; onSave: () => void; isSaving: boolean }) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleCopyFullPost = () => {
    const fullPost = `${post.hook}\n\n${post.caption}\n\n${post.hashtags.map(h => `#${h}`).join(' ')}`;
    copyToClipboard(fullPost);
  };

  const typeConfig = {
    viral: { icon: Zap, color: "text-amber-600", bg: "bg-amber-50/50", border: "border-amber-100", label: "Viral Factor", button: "hover:bg-amber-50 text-amber-700" },
    reach: { icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50/50", border: "border-blue-100", label: "Most Reach", button: "hover:bg-blue-50 text-blue-700" },
    niche: { icon: Target, color: "text-purple-600", bg: "bg-purple-50/50", border: "border-purple-100", label: "Niche Special", button: "hover:bg-purple-50 text-purple-700" },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Card className="flex flex-col h-full bg-white border border-gray-100 shadow-sm transition-all duration-200">
      <CardHeader className="pb-3 border-b border-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full ${config.bg} ${config.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className={`text-sm font-semibold ${config.color}`}>{config.label}</span>
          </div>
          <Badge variant="secondary" className="bg-gray-50 text-gray-500 font-normal border-0">
            {post.post_type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4 flex-1">
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-snug mb-3">"{post.hook}"</h3>
          <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
            {post.caption}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100/50">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Visual Prompt</span>
          <p className="text-xs text-gray-600 italic leading-relaxed">
            {post.visual_prompt}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {post.hashtags.map(tag => (
            <span key={tag} className="text-xs text-blue-600/80 bg-blue-50 px-2 py-1 rounded-md">#{tag}</span>
          ))}
        </div>

        <div className="text-xs text-gray-400 font-medium">
          Best Time: <span className="text-gray-600">{post.best_time}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-3 pb-4 border-t border-gray-50 flex gap-3 justify-between">
        <Button variant="ghost" size="sm" onClick={handleCopyFullPost} className="text-gray-500 hover:text-gray-900 h-9">
          <Copy className="w-3.5 h-3.5 mr-2" />
          Copy
        </Button>
        <Button onClick={onSave} disabled={isSaving} size="sm" className={cn("text-white shadow-none transition-all h-9 font-medium px-4", isSaving ? "opacity-70" : "opacity-100", type === 'viral' ? "bg-amber-600 hover:bg-amber-700" : type === 'reach' ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700")}>
          {isSaving ? "Saving..." : (
            <>
              <Save className="w-3.5 h-3.5 mr-2" />
              Save to Board
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-xl border border-gray-100/50 shadow-sm min-h-[500px]">
      <div className="bg-gray-50 p-4 rounded-full mb-6">
        <RocketIcon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Ready to Create?</h3>
      <p className="mt-2 text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
        Configure your strategy on the left and generate 3 unique content variations.
      </p>
    </div>
  );
}


export default function AiCalendarPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variations, setVariations] = useState<PostVariations | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const { user } = useAuthStore();

  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: "Instagram",
      date: new Date()
    }
  });

  useEffect(() => {
    if (user && typeof user.businessId === 'object' && user.businessId?.industryMode) {
      if (user.businessId.industryMode.toLowerCase() !== 'other') {
        setValue("niche", user.businessId.industryMode);
      }
    }
  }, [user, setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setVariations(null);

    const formattedDate = format(data.date, "yyyy-MM-dd");
    setSelectedDate(formattedDate);

    try {
      const response = await fetch("http://localhost:5000/api/ai/generate-daily", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...data,
          date: formattedDate
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate content.");
      }

      const result = await response.json();
      setVariations(result.variations);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePost = async (post: DayPost, type: 'viral' | 'reach' | 'niche') => {
    setIsSaving(true);
    try {
      const response = await fetch("http://localhost:5000/api/ai/save-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          post,
          date: selectedDate,
          type
        }),
      });

      if (!response.ok) throw new Error("Failed to save post");
      toast.success("Saved to Content Board");
    } catch (err) {
      toast.error("Failed to save post");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* Sidebar - Controls */}
      <aside className="w-full lg:w-[400px] border-r border-gray-100 bg-white p-6 lg:p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900">Content Studio</h1>
          <p className="text-sm text-gray-500 mt-1">AI-powered content generation.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal h-11 !bg-white border-gray-200 hover:!bg-gray-50 transition-colors rounded-lg !text-gray-900",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="niche" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Niche</Label>
              <Input id="niche" {...register("niche")} placeholder="SaaS, Fitness..." className="!bg-white border-gray-200 h-11 rounded-lg !text-gray-900" />
              {errors.niche && <p className="text-red-500 text-xs">{errors.niche.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">City</Label>
              <Input id="city" {...register("city")} placeholder="New York..." className="!bg-white border-gray-200 h-11 rounded-lg !text-gray-900" />
              {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Platform</Label>
            <Controller
              name="platform"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="!bg-white border-gray-200 !text-gray-900 h-11 rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Instagram Reels">Instagram Reels</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Context (Optional)</Label>
            <Textarea id="description" {...register("description")} placeholder="Specific topic or focus..." className="!bg-white border-gray-200 min-h-[100px] resize-none rounded-lg p-3 !text-gray-900" />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white hover:bg-slate-800 h-12 shadow-sm transition-all font-medium rounded-lg text-sm mt-2">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Thinking...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </form>
      </aside>

      {/* Main Content - Results */}
      <main className="flex-1 overflow-y-auto bg-gray-50/30 p-6 lg:p-10">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!variations && !isLoading && <EmptyState />}

          {isLoading && (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-12 ">
              <div className="w-16 h-16 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin mb-6" />
              <h3 className="text-lg font-medium text-gray-900">Crafting Strategy</h3>
              <p className="mt-2 text-gray-500 text-sm">Our AI is analyzing your niche trends...</p>
            </div>
          )}

          {variations && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Generated Strategy</h2>
                <Badge variant="outline" className="text-gray-500 border-gray-200 px-3 py-1 text-sm font-normal">
                  {selectedDate}
                </Badge>
              </div>

              <Tabs defaultValue="viral" className="w-full">
                <TabsList className="grid w-full grid-cols-3 p-1 bg-gray-100/50 rounded-xl mb-8">
                  <TabsTrigger value="viral" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-2.5 text-sm font-medium text-gray-500 data-[state=active]:text-gray-900">
                    Viral Factor
                  </TabsTrigger>
                  <TabsTrigger value="reach" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-2.5 text-sm font-medium text-gray-500 data-[state=active]:text-gray-900">
                    Most Reach
                  </TabsTrigger>
                  <TabsTrigger value="niche" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-2.5 text-sm font-medium text-gray-500 data-[state=active]:text-gray-900">
                    Niche Special
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="viral" className="mt-0 focus-visible:outline-none">
                    <PostCard post={variations.viral} type="viral" onSave={() => handleSavePost(variations.viral, 'viral')} isSaving={isSaving} />
                  </TabsContent>
                  <TabsContent value="reach" className="mt-0 focus-visible:outline-none">
                    <PostCard post={variations.reach} type="reach" onSave={() => handleSavePost(variations.reach, 'reach')} isSaving={isSaving} />
                  </TabsContent>
                  <TabsContent value="niche" className="mt-0 focus-visible:outline-none">
                    <PostCard post={variations.niche} type="niche" onSave={() => handleSavePost(variations.niche, 'niche')} isSaving={isSaving} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
