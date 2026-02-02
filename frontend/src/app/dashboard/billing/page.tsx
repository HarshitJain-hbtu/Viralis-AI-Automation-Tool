'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { CheckCircle2, Zap, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function BillingPage() {
    const { user } = useAuthStore();
    const currentTier = (typeof user?.businessId === 'object' ? (user.businessId as any).subscriptionTier : 'Free') || 'Free';

    const handleUpgrade = (tier: string) => {
        toast.info(`Please contact support to upgrade to ${tier}. Self-serve upgrades coming soon.`);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">Subscription & Billing</h1>
                    <p className="text-gray-500">Manage your workspace plan. All plans include core AI features.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-start">

                    {/* Free Plan */}
                    <Card className={`relative border-2 transition-all ${currentTier === 'Free' ? 'border-primary ring-4 ring-primary/10 shadow-xl' : 'border-gray-100 shadow-sm hover:shadow-md'}`}>
                        {currentTier === 'Free' && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                Current Plan
                            </div>
                        )}
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-bold text-gray-900">Free Forever</CardTitle>
                            <CardDescription>Try Viralis with limited features.</CardDescription>
                            <div className="pt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-gray-900">$0</span>
                                <span className="text-gray-400 font-medium">/mo</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                '1 Content Generation/day',
                                '2 Hours Voice Agent/month',
                                '1 Social Account',
                                '10 Leads Storage',
                                'Basic Analytics',
                                '7 Days Data Retention'
                            ].map((feat) => (
                                <div key={feat} className="flex items-center gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                    {feat}
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                variant={currentTier === 'Free' ? 'outline' : 'default'}
                                disabled={currentTier === 'Free'}
                                onClick={() => handleUpgrade('Free')}
                            >
                                {currentTier === 'Free' ? 'Active Plan' : 'Downgrade'}
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Growth Plan */}
                    <Card className={`relative border-2 transition-all ${currentTier === 'Growth' ? 'border-blue-600 ring-4 ring-blue-600/10 shadow-xl' : 'border-blue-100/50 shadow-md hover:shadow-lg bg-blue-50/10'}`}>
                        {currentTier === 'Growth' && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                Current Plan
                            </div>
                        )}
                        <div className="absolute top-0 right-0 p-4">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">Popular</Badge>
                        </div>
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-5 h-5 text-blue-600 fill-current" />
                                <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">Best Value</span>
                            </div>
                            <CardTitle className="text-xl font-bold text-gray-900">Growth</CardTitle>
                            <CardDescription>For growing businesses.</CardDescription>
                            <div className="pt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-gray-900">$19</span>
                                <span className="text-gray-400 font-medium">/mo</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                'Unlimited Content Generation',
                                '10 Hours Voice Agent/month',
                                '3 Social Accounts',
                                'Unlimited Leads',
                                'Content Studio (Full Access)',
                                'Competitor Intelligence',
                                'AI Insights Dashboard',
                                '30 Days Data Retention'
                            ].map((feat) => (
                                <div key={feat} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                                    {feat}
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                            <Button
                                className={`w-full ${currentTier === 'Growth' ? 'border-blue-200 text-blue-700 bg-blue-50' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                variant={currentTier === 'Growth' ? 'outline' : 'default'}
                                disabled={currentTier === 'Growth'}
                                onClick={() => handleUpgrade('Growth')}
                            >
                                {currentTier === 'Growth' ? 'Active Plan' : 'Upgrade to Growth'}
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Agency Plan */}
                    <Card className={`relative border-2 transition-all ${currentTier === 'Agency' ? 'border-primary ring-4 ring-primary/10 shadow-xl' : 'border-gray-100 shadow-sm hover:shadow-md'}`}>
                        {currentTier === 'Agency' && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                Current Plan
                            </div>
                        )}
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-bold text-gray-900">Agency</CardTitle>
                            <CardDescription>For teams & agencies.</CardDescription>
                            <div className="pt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-gray-900">$49</span>
                                <span className="text-gray-400 font-medium">/mo</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                'Everything in Growth',
                                'Unlimited Voice Agent Hours',
                                '10 Social Accounts',
                                '5 Team Members',
                                'White-label Reports',
                                'API Access',
                                'Dedicated Support',
                                'Unlimited Data Retention'
                            ].map((feat) => (
                                <div key={feat} className="flex items-center gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-4 h-4 text-gray-900 shrink-0" />
                                    {feat}
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                variant={currentTier === 'Agency' ? 'outline' : 'default'}
                                disabled={currentTier === 'Agency'}
                                onClick={() => handleUpgrade('Agency')}
                            >
                                {currentTier === 'Agency' ? 'Active Plan' : 'Contact Sales'}
                            </Button>
                        </CardFooter>
                    </Card>

                </div>

                <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 flex items-start gap-3 mt-12">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                        <h4 className="font-semibold text-blue-900 text-sm">Enterprise or Custom Needs?</h4>
                        <p className="text-blue-700 text-sm mt-1">Need higher limits or custom integrations? Reach out at <a href="mailto:team@viralis.ai" className="underline hover:text-blue-900">team@viralis.ai</a>.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

