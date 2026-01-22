import { Globe } from 'lucide-react';

export default function Integrations() {
    return (
        <section id="solutions" className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-xs font-semibold uppercase tracking-wide mb-6">
                    <Globe className="w-3 h-3" />
                    Ecosystem
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Connect the tools you use everyday</h2>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-16">
                    Viralis integrates seamlessly with your existing stack. Sync contacts, export leads, and trigger workflows instantly.
                </p>

                <div className="relative max-w-5xl mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10" />
                    <div className="flex gap-8 items-center justify-center flex-wrap opacity-80">
                        {[
                            { name: 'Slack', color: 'bg-[#4A154B]' },
                            { name: 'Notion', color: 'bg-black' },
                            { name: 'HubSpot', color: 'bg-[#FF7A59]' },
                            { name: 'Salesforce', color: 'bg-[#00A1E0]' },
                            { name: 'Gmail', color: 'bg-[#EA4335]' },
                            { name: 'Zoom', color: 'bg-[#2D8CFF]' },
                            { name: 'Zapier', color: 'bg-[#FF4F00]' },
                            { name: 'Shopify', color: 'bg-[#96BF48]' }
                        ].map((app, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition-all w-32 h-32 justify-center">
                                <div className={`w-12 h-12 rounded-xl ${app.color} text-white flex items-center justify-center font-bold text-lg`}>
                                    {app.name[0]}
                                </div>
                                <span className="text-xs font-semibold text-gray-700">{app.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
