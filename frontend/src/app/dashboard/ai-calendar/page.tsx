"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { DayPost, PostVariations, SupportedPlatform, SceneItem } from "@/lib/types/aiContent";
import api from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  RocketIcon,
  AlertCircle,
  Sparkles,
  Calendar as CalendarIcon,
  Save,
  Copy,
  BarChart3,
  Zap,
  Target,
  RefreshCw,
  Download,
  Edit3,
  Check,
  Film,
  Video,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
  ExternalLink,
  Clock,
  Hash,
  Type,
  FileText,
  HelpCircle,
  Layers
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Image from "next/image";

const PLATFORMS: { value: SupportedPlatform; label: string; icon: any; color: string }[] = [
  { value: "Instagram Post", label: "Instagram Post", icon: Instagram, color: "text-pink-600" },
  { value: "Instagram Reel", label: "Instagram Reel", icon: Film, color: "text-purple-600" },
  { value: "Facebook", label: "Facebook", icon: Facebook, color: "text-blue-600" },
  { value: "YouTube Video", label: "YouTube Video", icon: Youtube, color: "text-red-600" },
  { value: "YouTube Shorts", label: "YouTube Shorts", icon: Video, color: "text-red-500" },
  { value: "LinkedIn", label: "LinkedIn", icon: Linkedin, color: "text-sky-700" },
];

interface PostCardProps {
  post: DayPost;
  type: 'viral' | 'reach' | 'niche';
  platform: SupportedPlatform;
  onSave: (updatedPost: DayPost) => void;
  isSaving: boolean;
}

function PostCard({ post, type, platform, onSave, isSaving }: PostCardProps) {
  const [currentPost, setCurrentPost] = useState<DayPost>(post);
  const [isEditing, setIsEditing] = useState(false);
  const [editedHook, setEditedHook] = useState(post.hook);
  const [editedCaption, setEditedCaption] = useState(post.caption);
  const [editedCta, setEditedCta] = useState(post.cta);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);

  // Helper to ensure an image URL always exists
  const getEffectiveImageUrl = (p: DayPost) => {
    if (p.imageUrl && p.imageUrl.trim().length > 0) return p.imageUrl;
    const prompt = p.visualPrompt || p.visual_prompt || p.hook || "modern business commercial visual";
    const cleanPlatform = platform.toLowerCase();
    const width = (cleanPlatform.includes('reel') || cleanPlatform.includes('short')) ? 576 : (cleanPlatform.includes('video') ? 1024 : 1024);
    const height = (cleanPlatform.includes('reel') || cleanPlatform.includes('short')) ? 1024 : (cleanPlatform.includes('video') ? 576 : 1024);
    const encoded = encodeURIComponent(`${prompt}, commercial advertising photography, studio lighting, hyper-realistic, 8k, sharp focus, vibrant colors, professional grade`);
    return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&model=flux&nologo=true&seed=${Date.now() % 1000000}`;
  };

  useEffect(() => {
    const postWithImage = {
      ...post,
      imageUrl: post.imageUrl || getEffectiveImageUrl(post)
    };
    setCurrentPost(postWithImage);
    setEditedHook(post.hook);
    setEditedCaption(post.caption);
    setEditedCta(post.cta);
    setIsEditing(false);
  }, [post]);

  const copyToClipboard = (text: string, label = "Copied to clipboard!") => {
    navigator.clipboard.writeText(text);
    toast.success(label);
  };

  const handleCopyFullPost = () => {
    let fullText = `HOOK:\n${editedHook}\n\n`;

    if (currentPost.voiceoverScript) {
      fullText += `VOICEOVER SCRIPT:\n${currentPost.voiceoverScript}\n\n`;
    }

    if (currentPost.storyboard && currentPost.storyboard.length > 0) {
      fullText += `SCENE BREAKDOWN:\n` +
        currentPost.storyboard.map((s, i) =>
          `[Scene ${i + 1} (${s.time}) - ${s.type}]\nSpoken: "${s.text}"\nOn-Screen: ${s.onScreenText}\nVisual: ${s.visual}`
        ).join('\n\n') + '\n\n';
    }

    if (currentPost.youtubeTitles && currentPost.youtubeTitles.length > 0) {
      fullText += `TITLE OPTIONS:\n` + currentPost.youtubeTitles.map((t, i) => `${i + 1}. ${t}`).join('\n') + '\n\n';
    }

    fullText += `CAPTION:\n${editedCaption}\n\n`;
    fullText += `CALL TO ACTION:\n${editedCta}\n\n`;

    if (currentPost.hashtags && currentPost.hashtags.length > 0) {
      fullText += `HASHTAGS:\n${currentPost.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ')}\n\n`;
    }

    if (currentPost.bestTime || currentPost.best_time) {
      fullText += `BEST POSTING TIME: ${currentPost.bestTime || currentPost.best_time}`;
    }

    copyToClipboard(fullText, "Complete publication-ready content copied!");
  };

  const handleDownloadImage = async () => {
    const imgUrl = currentPost.imageUrl || getEffectiveImageUrl(currentPost);
    if (!imgUrl) {
      toast.error("No visual available to download.");
      return;
    }

    const cleanPlatform = platform.toLowerCase().replace(/\s+/g, '-');
    const filename = `viralis-${cleanPlatform}-${type}-${Date.now()}.jpg`;

    toast.info("Downloading AI visual...");

    // 1. Try downloading via the backend proxy to bypass CORS
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const cleanApiUrl = apiUrl.replace(/\/+$/, '').endsWith('/api') ? apiUrl : `${apiUrl.replace(/\/+$/, '')}/api`;
      const proxyDownloadUrl = `${cleanApiUrl}/ai/download-image?url=${encodeURIComponent(imgUrl)}&filename=${encodeURIComponent(filename)}`;

      const res = await fetch(proxyDownloadUrl);
      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
        toast.success("Visual downloaded to your device!");
        return;
      }
    } catch (proxyErr) {
      console.warn("Proxy download failed, trying direct blob fetch:", proxyErr);
    }

    // 2. Fallback: Direct fetch with blob
    try {
      const response = await fetch(imgUrl, { mode: 'cors' });
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
        toast.success("Visual downloaded to your device!");
        return;
      }
    } catch (directErr) {
      console.warn("Direct blob fetch failed:", directErr);
    }

    // 3. Fallback: Open in new window/tab for user to save
    window.open(imgUrl, '_blank');
    toast.success("Image opened in a new tab. Right-click or long-press to save.");
  };

  const handleRegenerateImage = async () => {
    setIsRegeneratingImage(true);
    const effectivePrompt = currentPost.visualPrompt || currentPost.visual_prompt || currentPost.hook || "modern business commercial advertising";
    const seed = Math.floor(Math.random() * 10000000);
    const cleanPlatform = platform.toLowerCase();
    const width = (cleanPlatform.includes('reel') || cleanPlatform.includes('short')) ? 576 : (cleanPlatform.includes('video') ? 1024 : 1024);
    const height = (cleanPlatform.includes('reel') || cleanPlatform.includes('short')) ? 1024 : (cleanPlatform.includes('video') ? 576 : 1024);

    try {
      // 1. Attempt backend regenerate endpoint
      const res = await api.post('/ai/regenerate-image', {
        prompt: effectivePrompt,
        platform,
        seed
      });

      if (res.data?.imageUrl) {
        setCurrentPost(prev => ({
          ...prev,
          imageUrl: res.data.imageUrl
        }));
        toast.success("New AI visual generated!");
        return;
      }
    } catch (e) {
      console.warn("Backend regenerate image attempt failed, falling back to direct client generation:", e);
    }

    // 2. Direct client fallback with Pollinations Flux - guaranteed to succeed
    try {
      const encoded = encodeURIComponent(`${effectivePrompt}, commercial advertising photography, studio lighting, hyper-realistic, 8k, sharp focus, vibrant colors, professional grade`);
      const directUrl = `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&model=flux&nologo=true&seed=${seed}`;
      setCurrentPost(prev => ({
        ...prev,
        imageUrl: directUrl
      }));
      toast.success("New AI visual generated!");
    } catch (fallbackErr) {
      console.error("Image regeneration failed:", fallbackErr);
      toast.error("Failed to regenerate visual. Please try again.");
    } finally {
      setIsRegeneratingImage(false);
    }
  };

  const handleSaveEdits = () => {
    setCurrentPost(prev => ({
      ...prev,
      hook: editedHook,
      caption: editedCaption,
      cta: editedCta
    }));
    setIsEditing(false);
    toast.success("Edits saved locally.");
  };

  const handleSaveToBoard = () => {
    const updated = {
      ...currentPost,
      hook: editedHook,
      caption: editedCaption,
      cta: editedCta,
      platform
    };
    onSave(updated);
  };

  const typeConfig = {
    viral: { icon: Zap, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "Viral Factor", btn: "bg-amber-600 hover:bg-amber-700" },
    reach: { icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", label: "Most Reach", btn: "bg-blue-600 hover:bg-blue-700" },
    niche: { icon: Target, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", label: "Niche Special", btn: "bg-purple-600 hover:bg-purple-700" },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  // Determine image aspect ratio container
  const isVerticalVideo = platform === 'Instagram Reel' || platform === 'YouTube Shorts';
  const isLandscapeVideo = platform === 'YouTube Video';

  return (
    <Card className="flex flex-col bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden transition-all duration-200">
      {/* Header */}
      <CardHeader className="pb-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${config.bg} ${config.color} border ${config.border}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className={`text-sm font-bold ${config.color}`}>{config.label}</span>
              <p className="text-xs text-gray-500 font-medium">{platform}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white text-gray-600 border-gray-200 text-xs px-2.5 py-1">
              Best Time: {currentPost.bestTime || currentPost.best_time || '18:00'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="h-8 text-xs text-gray-600 hover:text-gray-900 gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6 flex-1">
        {/* Visual Preview Banner & Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              AI Generated Visual ({isVerticalVideo ? '9:16 Vertical' : isLandscapeVideo ? '16:9 Thumbnail' : '1:1 Square'})
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerateImage}
                disabled={isRegeneratingImage}
                className="h-7 text-xs px-2.5 border-gray-200 text-gray-700 hover:bg-gray-100 gap-1.5"
              >
                <RefreshCw className={cn("w-3 h-3", isRegeneratingImage && "animate-spin")} />
                Regenerate Image
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadImage}
                className="h-7 text-xs px-2.5 border-gray-200 text-gray-700 hover:bg-gray-100 gap-1.5"
              >
                <Download className="w-3 h-3" />
                Download
              </Button>
            </div>
          </div>

          {/* Visual Preview Box */}
          <div className={cn(
            "relative rounded-xl overflow-hidden border border-gray-200/80 bg-slate-950 shadow-inner group",
            isVerticalVideo ? "w-full max-w-[280px] mx-auto aspect-[9/16] max-h-[440px]" :
              isLandscapeVideo ? "w-full aspect-[16/9] max-h-[360px]" :
                "w-full max-w-[420px] mx-auto aspect-square"
          )}>
            {/* Shimmer loading overlay during regeneration */}
            {isRegeneratingImage && (
              <div className="absolute inset-0 z-20 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mb-3" />
                <p className="text-sm font-semibold text-white">Generating New AI Visual...</p>
                <p className="text-xs text-purple-300 mt-1">Applying Flux render engine with studio lighting</p>
              </div>
            )}

            <img
              src={currentPost.imageUrl || getEffectiveImageUrl(currentPost)}
              alt="AI Generated Visual"
              className={cn(
                "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                isRegeneratingImage && "opacity-30 filter blur-xs"
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <p className="text-xs text-white/90 line-clamp-2 italic font-medium">
                {currentPost.visualPrompt || currentPost.visual_prompt || currentPost.hook}
              </p>
            </div>
          </div>
        </div>

        {/* Primary Hook */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Scroll-Stopping Hook
          </Label>
          {isEditing ? (
            <Input
              value={editedHook}
              onChange={(e) => setEditedHook(e.target.value)}
              className="text-base font-bold text-gray-900 border-purple-200 focus:border-purple-500"
            />
          ) : (
            <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-100">
              <h3 className="font-extrabold text-gray-900 text-lg leading-snug">
                "{editedHook}"
              </h3>
            </div>
          )}
        </div>

        {/* Hook Alternatives (If applicable) */}
        {currentPost.hookAlternatives && currentPost.hookAlternatives.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Alternate Hooks to Test
            </span>
            <div className="grid grid-cols-1 gap-2">
              {currentPost.hookAlternatives.map((alt, idx) => (
                <div
                  key={idx}
                  onClick={() => { setEditedHook(alt); toast.success("Hook selected!"); }}
                  className="p-2.5 rounded-lg bg-gray-50 hover:bg-purple-50/60 border border-gray-100 hover:border-purple-200 text-xs text-gray-700 cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <span className="font-medium">"{alt}"</span>
                  <span className="text-[10px] text-purple-600 opacity-0 group-hover:opacity-100 font-semibold uppercase">Use This</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* YouTube Video Title Variations */}
        {currentPost.youtubeTitles && currentPost.youtubeTitles.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Youtube className="w-3.5 h-3.5 text-red-600" />
              High-CTR YouTube Title Options
            </span>
            <div className="space-y-1.5">
              {currentPost.youtubeTitles.map((t, idx) => (
                <div
                  key={idx}
                  onClick={() => copyToClipboard(t, "Title copied!")}
                  className="p-2.5 rounded-lg bg-red-50/40 border border-red-100 text-xs font-bold text-gray-900 cursor-pointer hover:bg-red-50 transition-colors flex justify-between items-center"
                >
                  <span>{idx + 1}. {t}</span>
                  <Copy className="w-3 h-3 text-red-500 opacity-60" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reel / Shorts Storyboard Breakdown */}
        {currentPost.storyboard && currentPost.storyboard.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-purple-600" />
                Scene-by-Scene Video Storyboard
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[11px] text-purple-600 hover:text-purple-700 p-0"
                onClick={() => {
                  const sbText = currentPost.storyboard!.map((s, i) =>
                    `Scene ${i + 1} (${s.time}) - ${s.type}\nDialogue: "${s.text}"\nOn-Screen: ${s.onScreenText}\nVisual: ${s.visual}`
                  ).join('\n\n');
                  copyToClipboard(sbText, "Storyboard copied!");
                }}
              >
                Copy Storyboard
              </Button>
            </div>

            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {currentPost.storyboard.map((scene, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-white hover:border-purple-200 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] font-mono bg-white text-purple-700 border-purple-200">
                      {scene.time}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 text-[10px] font-semibold">
                      {scene.type}
                    </Badge>
                  </div>
                  <p className="text-xs font-semibold text-gray-900 leading-relaxed">
                    "{scene.text}"
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-gray-100">
                    <div className="text-gray-600">
                      <span className="font-bold text-gray-400 uppercase text-[9px] block">On-Screen Text</span>
                      {scene.onScreenText}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-bold text-gray-400 uppercase text-[9px] block">Visual Direction</span>
                      {scene.visual}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Voiceover Script */}
        {currentPost.voiceoverScript && (
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Full Voiceover Script</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 text-[11px] text-gray-500 hover:text-gray-900 p-0"
                onClick={() => copyToClipboard(currentPost.voiceoverScript!, "Voiceover script copied!")}
              >
                Copy Script
              </Button>
            </span>
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700 leading-relaxed font-mono">
              "{currentPost.voiceoverScript}"
            </div>
          </div>
        )}

        {/* YouTube Video SEO Description */}
        {currentPost.youtubeDescription && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              YouTube Video Description & Timestamps
            </span>
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700 whitespace-pre-line leading-relaxed font-mono">
              {currentPost.youtubeDescription}
            </div>
          </div>
        )}

        {/* LinkedIn Takeaways */}
        {currentPost.linkedinTakeaways && currentPost.linkedinTakeaways.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-sky-700" />
              Strategic Business Takeaways
            </span>
            <ul className="space-y-1.5 list-disc list-inside text-xs text-gray-700 bg-sky-50/40 p-3.5 rounded-xl border border-sky-100">
              {currentPost.linkedinTakeaways.map((point, idx) => (
                <li key={idx} className="leading-relaxed font-medium">{point}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Caption */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Caption & Body Copy
          </Label>
          {isEditing ? (
            <Textarea
              value={editedCaption}
              onChange={(e) => setEditedCaption(e.target.value)}
              className="text-xs leading-relaxed text-gray-900 min-h-[140px] font-sans border-purple-200"
            />
          ) : (
            <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 text-xs text-gray-800 whitespace-pre-line leading-relaxed">
              {editedCaption}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Call to Action (CTA)</span>
          {isEditing ? (
            <Input
              value={editedCta}
              onChange={(e) => setEditedCta(e.target.value)}
              className="text-xs text-gray-900 font-semibold"
            />
          ) : (
            <div className="text-xs font-bold text-purple-700 bg-purple-50/60 p-2.5 rounded-lg border border-purple-100">
              👉 {editedCta}
            </div>
          )}
        </div>

        {/* Hashtags */}
        {currentPost.hashtags && currentPost.hashtags.length > 0 && (
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hashtags</span>
            <div className="flex flex-wrap gap-1.5">
              {currentPost.hashtags.map((tag) => {
                const formatted = tag.startsWith('#') ? tag : `#${tag}`;
                return (
                  <span
                    key={tag}
                    onClick={() => copyToClipboard(formatted, `Copied ${formatted}`)}
                    className="text-xs text-blue-600 bg-blue-50/80 hover:bg-blue-100 px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors"
                  >
                    {formatted}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {isEditing && (
          <Button onClick={handleSaveEdits} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium text-xs h-9 gap-1.5">
            <Check className="w-3.5 h-3.5" />
            Apply Changes
          </Button>
        )}
      </CardContent>

      <CardFooter className="pt-4 pb-5 px-6 border-t border-gray-100 bg-gray-50/50 flex flex-wrap gap-3 justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyFullPost}
          className="text-gray-700 bg-white border-gray-200 hover:bg-gray-50 h-10 px-4 font-semibold shadow-sm"
        >
          <Copy className="w-4 h-4 mr-2 text-gray-500" />
          Copy Full Content
        </Button>
        <Button
          onClick={handleSaveToBoard}
          disabled={isSaving}
          size="sm"
          className={cn("text-white shadow-md transition-all h-10 font-bold px-6 rounded-xl", config.btn)}
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save to Content Board
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[520px]">
      <div className="bg-purple-50 p-5 rounded-2xl mb-6 border border-purple-100">
        <Sparkles className="h-10 w-10 text-purple-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Create Viral Content?</h3>
      <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed mb-6">
        Select your platform and target date on the left. Viralis AI will craft 3 complete, publication-ready strategies with customized visual art.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-md">
        {PLATFORMS.map(p => (
          <span key={p.value} className="text-xs bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full text-gray-600 font-medium">
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AiCalendarPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variations, setVariations] = useState<PostVariations | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [platform, setPlatform] = useState<SupportedPlatform>("Instagram Post");
  const [niche, setNiche] = useState("");
  const [city, setCity] = useState("");
  const [brandName, setBrandName] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState("Professional");

  const { user } = useAuthStore();

  // Load business profile information
  useEffect(() => {
    const loadBusinessProfile = async () => {
      try {
        const res = await api.get('/business/profile');
        if (res.data) {
          const b = res.data;
          if (b.name) setBrandName(b.name);
          if (b.industryMode && b.industryMode.toLowerCase() !== 'other') {
            setNiche(b.industryMode);
          }
          if (b.location?.city) {
            setCity(b.location.city);
          }
          if (b.brandVoice?.tone) {
            setTone(b.brandVoice.tone);
          }
        }
      } catch (err) {
        console.error("Failed to load business profile:", err);
      }
    };

    loadBusinessProfile();
  }, [user]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!niche.trim()) {
      toast.error("Please enter a business niche or industry.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setVariations(null);

    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    try {
      const response = await api.post("/ai/generate-daily", {
        niche: niche.trim(),
        platform,
        city: city.trim(),
        brandName: brandName.trim(),
        description: context.trim(),
        date: formattedDate,
      });

      if (response.data && response.data.variations) {
        setVariations(response.data.variations);
        toast.success(`Generated 3 ${platform} strategies!`);
      } else {
        throw new Error("No content variations returned by AI.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.details || err.response?.data?.error || err.message || "An error occurred during generation.");
      toast.error("Generation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePost = async (post: DayPost) => {
    setIsSaving(true);
    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    try {
      await api.post("/ai/save-post", {
        post,
        date: formattedDate,
        type: post.strategyType || "viral",
      });

      toast.success("Saved to Content Board! View it in your calendar.");
    } catch (err) {
      console.error("Failed to save post", err);
      toast.error("Failed to save post to Content Board.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FBFBFC]">
      {/* Sidebar Controls */}
      <aside className="w-full lg:w-[420px] border-b lg:border-b-0 lg:border-r border-gray-200/80 bg-white p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-purple-600">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">AI Content Studio</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Content Studio</h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate publication-ready posts, video scripts, and custom AI images.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-5">
          {/* Target Platform */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Target Platform
            </Label>
            <Select value={platform} onValueChange={(val) => setPlatform(val as SupportedPlatform)}>
              <SelectTrigger className="w-full h-11 bg-white border-gray-200 text-gray-900 font-semibold rounded-xl">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {PLATFORMS.map(p => {
                  const Icon = p.icon;
                  return (
                    <SelectItem key={p.value} value={p.value} className="cursor-pointer py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn("w-4 h-4", p.color)} />
                        <span className="font-medium text-gray-900">{p.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Publication Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-medium h-11 bg-white border-gray-200 hover:bg-gray-50 rounded-xl text-gray-900"
                >
                  <CalendarIcon className="mr-2.5 h-4 w-4 text-purple-600" />
                  {format(selectedDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Business Name & Niche */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Business Name</Label>
              <Input
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Business Name"
                className="bg-white border-gray-200 h-11 rounded-xl text-gray-900 text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Niche / Industry</Label>
              <Input
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Gym, Dental, SaaS..."
                className="bg-white border-gray-200 h-11 rounded-xl text-gray-900 text-sm font-medium"
                required
              />
            </div>
          </div>

          {/* Location & Tone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Location / City</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City (e.g. Kanpur)"
                className="bg-white border-gray-200 h-11 rounded-xl text-gray-900 text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Brand Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="w-full h-11 bg-white border-gray-200 text-gray-900 font-medium rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Friendly">Friendly & Warm</SelectItem>
                  <SelectItem value="Viral">Viral & Bold</SelectItem>
                  <SelectItem value="Educational">Educational</SelectItem>
                  <SelectItem value="High-Energy">High Energy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Specific Context */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Campaign Focus / Offer (Optional)
            </Label>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. 20% off summer membership, new personal trainer announcement, customer results breakdown..."
              className="bg-white border-gray-200 min-h-[90px] resize-none rounded-xl p-3 text-gray-900 text-xs leading-relaxed"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-900 hover:bg-black text-white h-12 shadow-lg transition-all font-bold rounded-xl text-sm gap-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Crafting {platform} Content...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-purple-400" />
                Generate Strategy & Visuals
              </>
            )}
          </Button>
        </form>
      </aside>

      {/* Main Results View */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {error && (
            <Alert variant="destructive" className="rounded-2xl border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Generation Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!variations && !isLoading && <EmptyState />}

          {isLoading && (
            <div className="w-full flex flex-col items-center justify-center text-center p-16 bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[480px]">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
                <Sparkles className="w-6 h-6 text-purple-600 absolute inset-0 m-auto animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Crafting Publication-Ready Content</h3>
              <p className="mt-2 text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                Gemini is formulating hooks, captions, and platform storyboards while generating custom commercial visual art...
              </p>
            </div>
          )}

          {variations && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-gray-200/80">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                    {platform} Content Strategy
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Target Date: <span className="font-semibold text-gray-800">{format(selectedDate, "PPPP")}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white border-purple-200 text-purple-700 px-3 py-1 font-semibold text-xs">
                    3 AI Variations Ready
                  </Badge>
                </div>
              </div>

              <Tabs defaultValue="viral" className="w-full">
                <TabsList className="grid w-full grid-cols-3 p-1.5 bg-gray-100 rounded-2xl mb-6">
                  <TabsTrigger
                    value="viral"
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-2.5 text-xs sm:text-sm font-bold text-gray-600 data-[state=active]:text-amber-700 gap-2"
                  >
                    <Zap className="w-4 h-4 text-amber-500" />
                    Viral Factor
                  </TabsTrigger>
                  <TabsTrigger
                    value="reach"
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-2.5 text-xs sm:text-sm font-bold text-gray-600 data-[state=active]:text-blue-700 gap-2"
                  >
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    Most Reach
                  </TabsTrigger>
                  <TabsTrigger
                    value="niche"
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-2.5 text-xs sm:text-sm font-bold text-gray-600 data-[state=active]:text-purple-700 gap-2"
                  >
                    <Target className="w-4 h-4 text-purple-500" />
                    Niche Special
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="viral" className="mt-0 focus-visible:outline-none">
                  <PostCard
                    post={variations.viral}
                    type="viral"
                    platform={platform}
                    onSave={handleSavePost}
                    isSaving={isSaving}
                  />
                </TabsContent>
                <TabsContent value="reach" className="mt-0 focus-visible:outline-none">
                  <PostCard
                    post={variations.reach}
                    type="reach"
                    platform={platform}
                    onSave={handleSavePost}
                    isSaving={isSaving}
                  />
                </TabsContent>
                <TabsContent value="niche" className="mt-0 focus-visible:outline-none">
                  <PostCard
                    post={variations.niche}
                    type="niche"
                    platform={platform}
                    onSave={handleSavePost}
                    isSaving={isSaving}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
