'use client';

import { useState, FormEvent } from 'react';

interface ContentResult {
  caption: string;
  hook: string;
  hashtags: string[];
  visual_prompt: string;
}

export default function AIContentPage() {
  const [formData, setFormData] = useState({
    niche: '',
    city: 'Indore',
    platform: 'Instagram Reels'
  });
  const [result, setResult] = useState<ContentResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('API error');
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🧠 AI Content Engine
          </h1>
          <p className="text-xl text-gray-600">
            Powered by Gemini 3 • Hyper-local content in seconds
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Niche</label>
              <input
                type="text"
                value={formData.niche}
                onChange={(e) => setFormData({...formData, niche: e.target.value})}
                placeholder="local cafe"
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="Indore">Indore</option>
                <option value="Kanpur">Kanpur</option>
                <option value="Bhopal">Bhopal</option>
                <option value="Mumbai">Mumbai</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({...formData, platform: e.target.value})}
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="Instagram Reels">Instagram Reels</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="WhatsApp Status">WhatsApp Status</option>
                <option value="Twitter">Twitter</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-6 px-8 rounded-3xl text-xl font-bold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-300 shadow-xl"
          >
            {loading ? '🚀 Generating...' : '✨ Generate Daily Content'}
          </button>
        </form>

        {/* Results */}
        {result && (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">✨ Generated Content</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">📝 Caption</h3>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-l-4 border-blue-500">
                  <p className="text-lg leading-relaxed">{result.caption}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">🎣 Hook</h3>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-l-4 border-green-500 font-bold text-2xl">
                  {result.hook}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">🏷️ Hashtags</h3>
                <div className="flex flex-wrap gap-2 p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl">
                  {result.hashtags.map((tag, i) => (
                    <span key={i} className="px-4 py-2 bg-white text-sm font-medium rounded-full border border-gray-200 shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">🖼️ Visual Prompt</h3>
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-2xl border-l-4 border-orange-500">
                  <p className="text-lg italic">{result.visual_prompt}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
