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

  // Fallback brand metadata if backend is in cold-start during SSR
  const activeBrand = brand || {
    name: 'AI Voice Receptionist',
    businessHours: 'Business Hours',
    location: { city: 'Local Office' },
    knowledgeBase: {}
  };

  return (
    <VoiceInterface brand={activeBrand} brandId={resolvedParams.brandId} />
  );
}
