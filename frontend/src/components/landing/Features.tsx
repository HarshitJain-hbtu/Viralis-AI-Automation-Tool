import { Bot, Mic, BarChart3, Zap, Shield, Globe } from 'lucide-react';

export default function Features() {
    return (
        <section id="features" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to scale</h2>
                    <p className="text-gray-500">We combine voice AI, content generation, and analytics into one seamless platform.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: Bot, title: "AI Voice Agents", desc: "Handle inbound calls 24/7 with human-like intonation and smart routing." },
                        { icon: Mic, title: "Content Studio", desc: "Turn voice notes into viral social media posts, blogs, and emails instantly." },
                        { icon: BarChart3, title: "Growth Analytics", desc: "Track every interaction and measure ROI with real-time dashboards." },
                        { icon: Zap, title: "Instant Setup", desc: "Get started in minutes. Choose your industry mode and go live." },
                        { icon: Shield, title: "Enterprise Security", desc: "Bank-grade encryption ensures your business data stays private." },
                        { icon: Globe, title: "Global Reach", desc: "Support for 30+ languages to serve customers anywhere in the world." }
                    ].map((feature, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
