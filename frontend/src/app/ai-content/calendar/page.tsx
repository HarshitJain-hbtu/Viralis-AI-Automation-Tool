'use client';
import { useState, FormEvent } from 'react';

interface CalendarItem {
  day: number;
  hook: string;
  caption: string;
  hashtags: string[];
  visual_prompt: string;
  image_url?: string;
}

export default function CalendarPage() {
  const [formData, setFormData] = useState({
    niche: '',
    city: 'Indore',
    platform: 'Instagram Reels',
    description: '',
    brand: { name: 'Chai Junction', colors: ['#F97316', '#1D4ED8'] }
  });
  const [calendar, setCalendar] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Your n8n webhook
  const N8N_IMAGE_URL = 'https://your-n8n.com/webhook/image';

  const generateCalendar = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Get 30-day text plan
      const res = await fetch('http://localhost:5000/api/ai-content/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const plan = await res.json();
      setCalendar(plan);
    } catch (error) {
      alert('Failed to generate calendar');
    } finally {
      setLoading(false);
    }
  };

  const generateImageForDay = async (dayIndex: number) => {
    const item = calendar[dayIndex];
    if (!item) return;

    try {
      const res = await fetch(N8N_IMAGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visual_prompt: item.visual_prompt,
          day: item.day
        }),
      });
      const { image_url } = await res.json();
      setCalendar(prev => {
        const newCalendar = [...prev];
        newCalendar[dayIndex].image_url = image_url;
        return newCalendar;
      });
    } catch (error) {
      console.error('Image gen failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Form */}
        <form onSubmit={generateCalendar} className="bg-white/80 rounded-3xl p-12 shadow-2xl mb-12">
          {/* Your 5 input fields here */}
          <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-6 px-8 rounded-3xl text-xl font-bold">
            {loading ? 'Generating...' : '🚀 Generate 30-Day Plan'}
          </button>
        </form>

        {/* 30-Day Calendar Grid */}
        {calendar.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {calendar.map((item, index) => (
              <div key={item.day} className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all group">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                    Day {item.day}
                  </div>
                </div>
                
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                  {item.image_url ? (
                    <img src={item.image_url} alt={`Day ${item.day}`} className="w-full h-48 object-cover rounded-2xl" />
                  ) : (
                    <button
                      onClick={() => generateImageForDay(index)}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg"
                    >
                      🖼️ Generate Image
                    </button>
                  )}
                </div>

                {/* Hook */}
                <div className="font-bold text-xl mb-2 text-gray-800 line-clamp-2">
                  {item.hook}
                </div>

                {/* Caption preview */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.caption}</p>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.hashtags.slice(0, 6).map((tag: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 rounded-xl text-sm font-semibold">
                    📋 Copy Post
                  </button>
                  <button className="px-4 py-2 bg-gray-200 rounded-xl text-sm hover:bg-gray-300">
                    ✏️ Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
