import { MessageCircle, Play } from 'lucide-react';

const testimonials = [
    {
        quote: "This task manager has completely transformed the way my team works. We now collaborate in real-time and always meet deadlines.",
        name: "John D.",
        role: "Marketing Lead",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        size: "large"
    },
    {
        quote: "An essential tool for anyone looking to manage their tasks better.",
        name: "Sarah W.",
        role: "Freelance Designer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        size: "small"
    },
    {
        quote: "The built-in analytics give me a complete overview of our team's productivity.",
        name: "Sam J.",
        role: "Project Coordinator",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
        size: "small"
    },
    {
        quote: "The time-tracking feature has been a game-changer for my freelance projects. It helps me stay organized and productive.",
        name: "Alex M.",
        role: "Freelance Developer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        size: "medium",
        hasVideo: true
    },
    {
        quote: "I love how easy it is to create and assign tasks. The platform's interface makes work feel less overwhelming.",
        name: "Daniels T.",
        role: "Operations Manager",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniels",
        size: "large"
    }
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-24 bg-gray-50/50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-gray-500 font-medium text-sm mb-6">
                        Testimonials
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        People just like you<br />
                        are already using <span className="text-blue-600">Viralis</span>
                    </h2>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

                    {/* Large Card - Left */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 lg:row-span-2">
                        <div>
                            <MessageCircle className="w-10 h-10 text-gray-300 mb-4" />
                            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                "{testimonials[0].quote}"
                            </p>
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                            <img src={testimonials[0].avatar} alt={testimonials[0].name} className="w-10 h-10 rounded-full bg-gray-100" />
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">{testimonials[0].name}</p>
                                <p className="text-gray-500 text-xs">{testimonials[0].role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Small Card - Top Center */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                        <p className="text-gray-700 leading-relaxed mb-4">
                            "{testimonials[1].quote}"
                        </p>
                        <div className="flex items-center gap-3">
                            <img src={testimonials[1].avatar} alt={testimonials[1].name} className="w-8 h-8 rounded-full bg-gray-100" />
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">{testimonials[1].name}</p>
                                <p className="text-gray-500 text-xs">{testimonials[1].role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Small Card - Top Right */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                        <p className="text-gray-700 leading-relaxed mb-4">
                            "{testimonials[2].quote}"
                        </p>
                        <div className="flex items-center gap-3">
                            <img src={testimonials[2].avatar} alt={testimonials[2].name} className="w-8 h-8 rounded-full bg-gray-100" />
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">{testimonials[2].name}</p>
                                <p className="text-gray-500 text-xs">{testimonials[2].role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Medium Card with Video - Bottom Center */}
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col">
                        <div className="p-6 flex-1">
                            <p className="text-gray-700 leading-relaxed mb-4">
                                "{testimonials[3].quote}"
                            </p>
                            <div className="flex items-center gap-3">
                                <img src={testimonials[3].avatar} alt={testimonials[3].name} className="w-8 h-8 rounded-full bg-gray-100" />
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{testimonials[3].name}</p>
                                    <p className="text-gray-500 text-xs">{testimonials[3].role}</p>
                                </div>
                            </div>
                        </div>
                        {/* Video Preview */}
                        <div className="relative h-40 bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center group cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop" alt="Video Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                                    <Play className="w-5 h-5 text-white fill-white" />
                                </div>
                            </div>
                            <span className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md">Watch video review</span>
                        </div>
                    </div>

                    {/* Large Card - Bottom Right */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                        <div>
                            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                "{testimonials[4].quote}"
                            </p>
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                            <img src={testimonials[4].avatar} alt={testimonials[4].name} className="w-10 h-10 rounded-full bg-gray-100" />
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">{testimonials[4].name}</p>
                                <p className="text-gray-500 text-xs">{testimonials[4].role}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
