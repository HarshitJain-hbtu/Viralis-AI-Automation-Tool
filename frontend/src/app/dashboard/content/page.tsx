'use client';

import { useState } from 'react';
import { useContentStore } from '@/lib/store/contentStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Wand2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ContentPage() {
    const { generateContent, isGenerating, generatedResult, error } = useContentStore();
    const [topic, setTopic] = useState('');
    const [type, setType] = useState('video_ideas');
    const [tone, setTone] = useState('engaging');
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!topic) return;
        await generateContent(topic, type, tone);
    };

    const handleCopy = () => {
        if (generatedResult) {
            navigator.clipboard.writeText(generatedResult);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">AI Content Studio</h1>
                <p className="text-muted-foreground">Generate viral video ideas, scripts, and social posts in seconds.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Section */}
                <Card className="lg:col-span-4 h-fit">
                    <CardHeader>
                        <CardTitle>Content Settings</CardTitle>
                        <CardDescription>Configure your AI generation parameters.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="topic">Topic</Label>
                            <Input
                                id="topic"
                                placeholder="e.g. Next.js 14 Features"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="!bg-white !text-gray-900 !border-gray-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Content Type</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="!bg-white !text-gray-900 !border-gray-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="video_ideas">Video Ideas</SelectItem>
                                    <SelectItem value="twitter_thread">Twitter Thread</SelectItem>
                                    <SelectItem value="instagram_caption">Instagram Captions</SelectItem>
                                    <SelectItem value="script">Short Script</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Tone</Label>
                            <Select value={tone} onValueChange={setTone}>
                                <SelectTrigger className="!bg-white !text-gray-900 !border-gray-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="engaging">Engaging</SelectItem>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="funny">Funny</SelectItem>
                                    <SelectItem value="educational">Educational</SelectItem>
                                    <SelectItem value="controversial">Controversial</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                            onClick={handleGenerate}
                            disabled={isGenerating || !topic}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-4 h-4" /> Generate Magic
                                </>
                            )}
                        </Button>

                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{error}</p>
                        )}
                    </CardContent>
                </Card>

                {/* Result Section */}
                <Card className="lg:col-span-8 min-h-[500px] flex flex-col">
                    <CardHeader className="border-b flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Generated Result</CardTitle>
                            <CardDescription>Your AI-crafted content will appear here.</CardDescription>
                        </div>
                        {generatedResult && (
                            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 !bg-white !text-gray-900 !border-gray-200 hover:!bg-gray-50">
                                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied' : 'Copy'}
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="flex-1 p-6 overflow-y-auto max-h-[700px]">
                        {isGenerating ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground animate-pulse gap-4">
                                <Wand2 className="w-12 h-12 text-indigo-300" />
                                <p>Brewing your content...</p>
                            </div>
                        ) : generatedResult ? (
                            <div className="prose prose-indigo max-w-none text-gray-800">
                                <ReactMarkdown>{generatedResult}</ReactMarkdown>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                <p>Enter a topic and click generate to start.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
