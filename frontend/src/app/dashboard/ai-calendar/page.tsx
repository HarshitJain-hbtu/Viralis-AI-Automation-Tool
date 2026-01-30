"use client";

import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarResponse, DayPost } from "@/lib/types/aiContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { RocketIcon, AlertCircle, Sparkles } from "lucide-react";

// Schema for form validation
const formSchema = z.object({
  niche: z.string().min(3, "Niche is required"),
  city: z.string().min(2, "City is required"),
  platform: z.enum(["Instagram", "Instagram Reels", "Facebook", "LinkedIn"]),
  brandName: z.string().optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// --- Components ---

function PostCard({ post }: { post: DayPost }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here to confirm copy
  };

  const handleCopyFullPost = () => {
    const fullPost = `${post.hook}\n\n${post.caption}\n\n${post.hashtags.map(h => `#${h}`).join(' ')}`;
    copyToClipboard(fullPost);
  };

  const handleCopyHashtags = () => {
    const allHashtags = post.hashtags.map(h => `#${h}`).join(' ');
    copyToClipboard(allHashtags);
  };

  const postTypeColors: { [key: string]: string } = {
    reel: "bg-purple-600",
    carousel: "bg-blue-600",
    story: "bg-pink-600",
    static: "bg-green-600",
  };

  return (
    <Card className="flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-gray-900">Day {post.day}</CardTitle>
          <Badge className={`text-white ${postTypeColors[post.post_type] || 'bg-gray-500'}`}>{post.post_type}</Badge>
        </div>
        <CardDescription className="font-bold text-gray-800 pt-2">{post.hook}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <p className="text-sm text-gray-700 mb-4 flex-grow">
          {isExpanded ? post.caption : `${post.caption.substring(0, 100)}...`}
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-blue-600 font-semibold ml-1">
            {isExpanded ? "Show less" : "Show more"}
          </button>
        </p>
        <div className="text-sm text-gray-600 mb-4">
          {post.hashtags.slice(0, 5).map(tag => `#${tag}`).join(' ')}
          {post.hashtags.length > 5 && (
            <span className="text-gray-500 ml-1">+{post.hashtags.length - 5} more</span>
          )}
        </div>
        <div className="text-xs text-gray-500 space-y-1 mb-6">
          <p><strong>Best Time:</strong> {post.best_time}</p>
          <p><strong>CTA:</strong> {post.cta}</p>
        </div>
        <div className="flex gap-2 mt-auto">
          <Button size="sm" onClick={handleCopyFullPost}>Copy Post</Button>
          <Button size="sm" variant="outline" onClick={handleCopyHashtags}>Copy Hashtags</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="w-full h-full flex items-center justify-center bg-white border border-gray-100 shadow-sm">
      <div className="text-center p-8">
        <RocketIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-base font-medium text-gray-900">Your Content Plan Awaits</h3>
        <p className="mt-2 text-sm text-gray-600">Fill in the form to generate your 30-day calendar.</p>
      </div>
    </Card>
  );
}


export default function AiCalendarPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calendarData, setCalendarData] = useState<CalendarResponse | null>(null);

  const { register, handleSubmit, formState: { errors }, control } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: "Instagram"
    }
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setCalendarData(null);

    try {
      const response = await fetch("http://localhost:5000/api/ai-content/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate calendar. Please try again.");
      }

      const result: CalendarResponse = await response.json();

      if (result.calendar.length !== 30) {
        setError("Warning: The generated plan does not contain 30 days of content. The AI might be having trouble.");
      }

      setCalendarData(result);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-full flex flex-col lg:flex-row gap-8 px-8 py-6">
      <aside className="lg:w-1/3 lg:max-w-sm">
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 text-xl">AI Content Engine</CardTitle>
            <CardDescription className="text-gray-600">Generate 30 days of hooks, captions, and hashtags in one click.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="niche" className="text-gray-700">Niche</Label>
                <Input id="niche" {...register("niche")} placeholder="e.g., Sustainable Fashion" className="bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500" />
                {errors.niche && <p className="text-red-500 text-sm mt-1">{errors.niche.message}</p>}
              </div>
              
              <div>
                <Label htmlFor="city" className="text-gray-700">City</Label>
                <Input id="city" {...register("city")} placeholder="e.g., New York" className="bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500" />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
              </div>
              
              <div>
                <Label htmlFor="platform" className="text-gray-700">Platform</Label>
                <Controller
                  name="platform"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="bg-gray-100 border-gray-300 text-gray-900"><SelectValue className="text-gray-900" /></SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                            <SelectItem value="Instagram" className="text-gray-900">Instagram</SelectItem>
                            <SelectItem value="Instagram Reels" className="text-gray-900">Instagram Reels</SelectItem>
                            <SelectItem value="Facebook" className="text-gray-900">Facebook</SelectItem>
                            <SelectItem value="LinkedIn" className="text-gray-900">LinkedIn</SelectItem>
                        </SelectContent>
                    </Select>
                  )}
                />
                {errors.platform && <p className="text-red-500 text-sm mt-1">{errors.platform.message}</p>}
              </div>

              <div>
                <Label htmlFor="brandName" className="text-gray-700">Brand Name (Optional)</Label>
                <Input id="brandName" {...register("brandName")} placeholder="e.g., EcoThreads" className="bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500" />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-700">Description (Optional)</Label>
                <Textarea id="description" {...register("description")} placeholder="Extra info about your brand, audience, tone..." className="bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500" />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-[#1C1C1C] text-white hover:bg-gray-800 h-10 gap-2 font-medium shadow-sm">
                {isLoading ? "Generating..." : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate 30-Day Calendar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </aside>

      <main className="flex-1">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!calendarData && !isLoading && <EmptyState />}
        
        {isLoading && (
            <div className="w-full h-full flex items-center justify-center bg-white border border-gray-100 shadow-sm rounded-2xl">
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-800">Generating your amazing content plan...</p>
                    <p className="text-gray-500 mt-2">This can take up to 30 seconds.</p>
                </div>
            </div>
        )}

        {calendarData && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {calendarData.calendar.map(post => (
              <PostCard key={post.day} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
