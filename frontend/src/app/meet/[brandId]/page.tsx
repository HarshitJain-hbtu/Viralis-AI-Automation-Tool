import VoiceInterface from '@/components/voice/VoiceInterface';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Voice Assistant | Viralis',
  description: 'Talk to our AI Agent',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0', // Crucial for mobile app feel
};

// Fetch data directly in Server Component
// Fetch data directly in Server Component
async function getBrandData(brandId: string) {
  try {
    // In production, use internal service DNS. locally, localhost is fine.
    // Ensure this URL is reachable from the Next.js server side.
    const apiUrl = `http://127.0.0.1:5000/api/public/brand/${brandId}?t=${Date.now()}`;
    console.log(`📡 Fetching Brand Data from: ${apiUrl}`);

    const res = await fetch(apiUrl, {
      cache: 'no-store', // Always fetch fresh
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      console.error(`❌ Brand Fetch Failed: ${res.status} ${res.statusText}`);
      if (res.status === 404) return null;
      throw new Error('Failed to fetch brand data');
    }

    const data = await res.json();
    console.log(`✅ Brand Data Found: ${data.name}`);
    return data;
  } catch (error) {
    console.error('Error fetching brand:', error);
    return null;
  }
}

export default async function MeetPage({ params }: { params: Promise<{ brandId: string }> }) {
  const resolvedParams = await params;
  const brand = await getBrandData(resolvedParams.brandId);

  if (!brand) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-slate-400 p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-200 mb-2">Business Not Found</h1>
        <p>The link you used might be invalid or expired.</p>
      </div>
    );
  }

  return (
    <VoiceInterface brand={brand} brandId={resolvedParams.brandId} />
  );
}
