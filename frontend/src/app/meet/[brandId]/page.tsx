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
    // Determine the base URL:
    // 1. Use NEXT_PUBLIC_API_URL if defined (Production/Vercel)
    // 2. Fallback to 127.0.0.1 for local development (internal networking)
    let baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

    // Ensure it's not just a path (like '/api'), must be absolute for server fetch
    if (baseUrl.startsWith('/')) {
      // If it's a relative path, we can't easily fetch server-side unless we know the host.
      // fallback to localhost default if we can't resolve.
      baseUrl = `http://127.0.0.1:5000${baseUrl}`;
    }

    const apiUrl = `${baseUrl}/public/brand/${brandId}?t=${Date.now()}`;
    console.log(`📡 [Server] Fetching Brand Data from: ${apiUrl}`);

    const res = await fetch(apiUrl, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      console.error(`❌ [Server] Brand Fetch Failed: ${res.status} ${res.statusText}`);
      if (res.status === 404) return null;
      throw new Error('Failed to fetch brand data');
    }

    const data = await res.json();
    console.log(`✅ [Server] Brand Data Found: ${data.name}`);
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
