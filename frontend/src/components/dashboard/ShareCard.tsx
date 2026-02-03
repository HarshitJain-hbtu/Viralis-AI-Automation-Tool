'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Share2,
    Twitter,
    Linkedin,
    Link2,
    Mail,
    MessageCircle,
    RefreshCw,
    Building2,
    Globe,
    Phone,
    MapPin,
    Copy,
    Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { useAuthStore } from '@/lib/store/authStore';
import { toast } from 'sonner';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

interface ShareCardProps {
    trigger?: React.ReactNode;
}

export function ShareCard({ trigger }: ShareCardProps) {
    const { user } = useAuthStore();
    const business = user?.businessId as any;
    const [isFlipped, setIsFlipped] = useState(false);
    const [copied, setCopied] = useState(false);
    const [open, setOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const voiceAgentUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/voice/${business?._id || 'demo'}`
        : '';

    const handleCopy = async () => {
        await navigator.clipboard.writeText(voiceAgentUrl);
        setCopied(true);
        toast.success('Link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLinks = [
        {
            name: 'Twitter',
            icon: Twitter,
            url: `https://x.com/intent/tweet?text=${encodeURIComponent(`Check out ${business?.name || 'our'} AI Voice Agent! ${voiceAgentUrl}`)}`
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(voiceAgentUrl)}&title=${encodeURIComponent(`${business?.name || 'Our'} AI Voice Agent`)}`
        },
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${business?.name || 'our'} AI Voice Agent: ${voiceAgentUrl}`)}`
        },
        {
            name: 'Email',
            icon: Mail,
            url: `mailto:?subject=${encodeURIComponent(`${business?.name || 'Our'} AI Voice Agent`)}&body=${encodeURIComponent(`Check it out: ${voiceAgentUrl}`)}`
        },
    ];

    return (
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setIsFlipped(false); setIsHovered(false); } }}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="!bg-white !text-gray-900 !border !border-gray-200 shadow-sm hover:!bg-gray-50 gap-2 h-9 font-medium">
                        <Share2 className="w-4 h-4" />
                        Share
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[340px] p-6 border-0 bg-transparent shadow-none overflow-visible">
                <VisuallyHidden.Root>
                    <DialogTitle>Share Profile</DialogTitle>
                </VisuallyHidden.Root>

                {/* Card Container */}
                <div
                    className="relative w-full h-[380px]"
                    style={{ perspective: '1000px' }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <motion.div
                        className="relative w-full h-full"
                        animate={{
                            rotateY: isFlipped ? 180 : isHovered ? 0 : [0, 8, 0, -8, 0]
                        }}
                        transition={isHovered || isFlipped ?
                            { duration: 0.5, type: 'spring', stiffness: 100 } :
                            { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                        }
                        style={{ transformStyle: 'preserve-3d' }}
                    >

                        {/* ===== FRONT - User ===== */}
                        <div
                            className="absolute inset-0 w-full h-full bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100"
                            style={{ backfaceVisibility: 'hidden' }}
                        >
                            {/* User Content */}
                            <div className="flex flex-col items-center justify-center h-full p-6">
                                {/* Avatar */}
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
                                    <img
                                        src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                                        alt={user?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Name */}
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">{user?.name || 'User'}</h3>
                                <p className="text-sm text-gray-400">{user?.email}</p>

                                {/* Badge */}
                                <span className="mt-3 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                                    {business?.industryMode || 'Creator'}
                                </span>

                                {/* Link */}
                                <div className="mt-6 w-full flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                                    <Link2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span className="text-[11px] text-gray-500 truncate flex-1">{voiceAgentUrl.replace(/https?:\/\//, '')}</span>
                                    <button onClick={handleCopy} className="p-1 rounded hover:bg-gray-200 text-gray-400">
                                        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </div>

                                {/* Share */}
                                <div className="mt-4 flex gap-2">
                                    {shareLinks.map((l) => (
                                        <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer"
                                            className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                                            <l.icon className="w-4 h-4" />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="absolute bottom-0 left-0 right-0 py-2.5 text-center border-t border-gray-50">
                                <span className="text-[9px] text-gray-400">viralis.ai</span>
                            </div>
                        </div>

                        {/* ===== BACK - Business ===== */}
                        <div
                            className="absolute inset-0 w-full h-full bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100"
                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        >
                            <div className="flex flex-col items-center justify-center h-full p-6">
                                {/* Logo */}
                                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center shadow-sm">
                                    {business?.logo ? (
                                        <img src={business.logo} alt={business.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-bold text-white">{(business?.name || 'B')[0]}</span>
                                    )}
                                </div>

                                <h3 className="mt-4 text-lg font-semibold text-gray-900">{business?.name || 'Business'}</h3>
                                <p className="text-sm text-gray-400">{business?.industryMode || 'AI-Powered'}</p>

                                {/* Details */}
                                <div className="mt-4 w-full space-y-2 text-sm">
                                    {business?.website && (
                                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                            <Globe className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-gray-600 truncate text-xs">{business.website}</span>
                                        </div>
                                    )}
                                    {(business?.knowledgeBase?.contactPhone || business?.phone) && (
                                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-gray-600 text-xs">{business?.knowledgeBase?.contactPhone || business?.phone}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Share */}
                                <div className="mt-4 flex gap-2">
                                    {shareLinks.map((l) => (
                                        <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer"
                                            className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                                            <l.icon className="w-4 h-4" />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 py-2.5 text-center border-t border-gray-50">
                                <span className="text-[9px] text-gray-400">viralis.ai</span>
                            </div>
                        </div>

                    </motion.div>
                </div>

                {/* Flip Button - Below Card */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        {isFlipped ? 'View Profile' : 'View Business'}
                    </button>
                </div>

            </DialogContent>
        </Dialog>
    );
}
