import VoiceInterface from '@/components/voice/VoiceInterface';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Voice Assistant | Viralis',
  description: 'Talk to our AI Agent',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0', // Crucial for mobile app feel
};

// Fetch data directly in Server Component with cold-start retry
async function getBrandData(brandId: string, retries = 2) {
  let baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

  // Normalization: Ensure baseUrl ends with '/api'
  if (!baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.replace(/\/+$/, '') + '/api';
  }

  // Ensure it's absolute for server-side usage
  if (baseUrl.startsWith('/')) {
    baseUrl = `http://127.0.0.1:5000${baseUrl}`;
  }

  const apiUrl = `${baseUrl}/public/brand/${brandId}?t=${Date.now()}`;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      console.log(`📡 [Server] Fetching Brand Data (attempt ${attempt}): ${apiUrl}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(apiUrl, {
        cache: 'no-store',
        next: { revalidate: 0 },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        console.log(`✅ [Server] Brand Data Found: ${data.name}`);
        return data;
      }

      if (res.status === 404) {
        return null;
      }
    } catch (error) {
      console.error(`Attempt ${attempt} failed fetching brand:`, error);
      if (attempt <= retries) {
        await new Promise(r => setTimeout(r, 1500));
      }
    }
  }

  return null;
}

export default async function MeetPage({ params }: { params: Promise<{ brandId: string }> }) {
  const resolvedParams = await params;
  const brand = await getBrandData(resolvedParams.brandId);

  if (!brand) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-300 p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Connecting to Voice Agent</h1>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            The server may be waking up from sleep mode, or the business link might be initializing.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href={`/meet/${resolvedParams.brandId}`}
              className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-all shadow-lg shadow-purple-600/20"
            >
              Retry Connection
            </a>
            <a
              href="/dashboard/settings/ai-brain"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-all"
            >
              Back to Voice Lab
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <VoiceInterface brand={brand} brandId={resolvedParams.brandId} />
  );
}
