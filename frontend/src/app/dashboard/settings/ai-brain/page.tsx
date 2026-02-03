'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Trash2,
  Plus,
  Save,
  BrainCircuit,
  Store,
  BadgeDollarSign,
  Sparkles,
  Link as LinkIcon,
  Copy,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/lib/api/client';

interface Service {
  name: string;
  price: string;
}

interface KnowledgeBase {
  businessHours: string;
  contactPhone: string;
  address: string;
  services: Service[];
  customInstructions: string;
}

export default function AIBrainPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [rootAddress, setRootAddress] = useState('');
  const [businessId, setBusinessId] = useState('');

  const [formData, setFormData] = useState<KnowledgeBase>({
    businessHours: '',
    contactPhone: '',
    address: '',
    services: [],
    customInstructions: ''
  });

  const [newService, setNewService] = useState<Service>({ name: '', price: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await apiClient.get('/business/profile');
      const data = res.data;

      setBusinessId(data._id);
      setBusinessName(data.name || '');

      // Construct full address from location object for fallback
      const loc = data.location || {};
      const fullAddress = [loc.address, loc.city, loc.country].filter(Boolean).join(', ');
      setRootAddress(fullAddress);

      if (data.knowledgeBase) {
        setFormData({
          businessHours: data.knowledgeBase.businessHours || '',
          contactPhone: data.knowledgeBase.contactPhone || '',
          address: data.knowledgeBase.address || '',
          services: data.knowledgeBase.services || [],
          customInstructions: data.knowledgeBase.customInstructions || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch business data', error);
      toast.error('Failed to load business settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.patch('/business/profile', {
        name: businessName,
        knowledgeBase: formData
      });
      toast.success('AI Knowledge Base updated, Agent re-trained!');
    } catch (error) {
      console.error('Failed to save', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const addService = () => {
    if (!newService.name || !newService.price) {
      toast.error('Please fill in both service name and price');
      return;
    }
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
    setNewService({ name: '', price: '' });
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const copySuperLink = () => {
    const url = `${window.location.origin}/meet/${businessId}`;
    navigator.clipboard.writeText(url);
    toast.success('Super Link copied into clipboard!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto pb-24">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Voice Lab
        </h1>
        <p className="text-gray-500">
          Train your Voice Agent with your business details, services, and unique style.
        </p>
      </div>

      {/* Card 1: The Super Link */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100 shadow-sm relative overflow-hidden group">
        <CardHeader className="border-b border-blue-100/50 pb-4 relative z-10">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <LinkIcon className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wider uppercase">Your Public Voice Portal</span>
          </div>
          <CardTitle className="text-xl text-gray-900">The Super Link</CardTitle>
          <CardDescription className="text-gray-600">Share this link with your customers to let them talk to your AI agent instantly.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 relative z-10">
          <div className="flex items-center gap-4 bg-white border border-blue-100 p-4 rounded-xl shadow-sm">
            <div className="flex-1 font-mono text-sm text-gray-600 truncate bg-gray-50 px-3 py-1.5 rounded-md">
              {typeof window !== 'undefined' ? `${window.location.origin}/meet/${businessId}` : `.../meet/${businessId}`}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50 text-gray-700 font-medium" onClick={() => window.open(`/meet/${businessId}`, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Test
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all" onClick={copySuperLink}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 2: The Essentials */}
        <Card className="bg-white border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <CardHeader className="border-b border-gray-50 pb-4">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <Store className="w-5 h-5" />
              <span className="text-sm font-semibold tracking-wider uppercase">Configuration</span>
            </div>
            <CardTitle className="text-xl text-gray-900">Core Identity</CardTitle>
            <CardDescription className="text-gray-500">Core business identifiers for the AI agent.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700">Business Name</Label>
                  <Input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="!bg-white !border-gray-200 !text-gray-900 focus:border-purple-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Support/Handoff Phone</Label>
                  <Input
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="!bg-white !border-gray-200 focus:border-purple-500 transition-colors !text-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Business Hours</Label>
                <Input
                  value={formData.businessHours}
                  onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                  placeholder="Mon-Fri: 9AM - 6PM"
                  className="!bg-white !border-gray-200 focus:border-purple-500 transition-colors !text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Location / Address</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder={rootAddress || "Enter full address for the AI..."}
                  className="!bg-white !border-gray-200 focus:border-purple-500 transition-colors !text-gray-900"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to use default account address: <span className="text-white/50">{rootAddress || 'N/A'}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Services & Pricing */}
        <Card className="bg-white border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <CardHeader className="border-b border-gray-50 pb-4">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <BadgeDollarSign className="w-5 h-5" />
              <span className="text-sm font-semibold tracking-wider uppercase">Menu & Catalog</span>
            </div>
            <CardTitle className="text-xl text-gray-900">Services & Pricing</CardTitle>
            <CardDescription className="text-gray-500">What you sell and how much it costs.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex gap-2 items-end">
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="space-y-2">
                  <Label className="text-gray-700">Service Name</Label>
                  <Input
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    placeholder="e.g. Haircut"
                    className="!bg-white !border-gray-200 focus:border-green-500 !text-gray-900"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addService();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Price</Label>
                  <Input
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    placeholder="$50"
                    className="!bg-white !border-gray-200 focus:border-green-500 !text-gray-900"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addService();
                    }}
                  />
                </div>
              </div>
              <Button onClick={addService} size="icon" className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/50 overflow-hidden">
              <div className="max-h-[220px] overflow-y-auto">
                {formData.services.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    No services added yet.
                  </div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                      <tr>
                        <th className="px-4 py-2">Service</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2 w-[50px]"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {formData.services.map((service, index) => (
                        <tr key={index} className="group hover:bg-white transition-colors">
                          <td className="px-4 py-2 text-gray-900 font-medium">{service.name}</td>
                          <td className="px-4 py-2 text-gray-500">{service.price}</td>
                          <td className="px-4 py-2 text-right">
                            <button
                              onClick={() => removeService(index)}
                              className="text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card 4: The Magic Brain */}
      <Card className="bg-white border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] border-t-4 border-t-purple-500">
        <CardHeader className="border-b border-gray-50 pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <BrainCircuit className="w-5 h-5" />
                <span className="text-sm font-semibold tracking-wider uppercase">System Instructions</span>
              </div>
              <CardTitle className="text-xl text-gray-900">The Magic Brain</CardTitle>
              <CardDescription className="text-gray-500">Define your agent&apos;s personality and behavioral rules.</CardDescription>
            </div>
            <div className="bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3 h-3" />
              Injected into System Prompt
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="relative">
            <Textarea
              value={formData.customInstructions}
              onChange={(e) => setFormData({ ...formData, customInstructions: e.target.value })}
              placeholder="e.g. You are a high-energy fitness coach. Always mention our summer sale..."
              className="min-h-[250px] !bg-white !border-gray-200 focus:border-purple-500 text-base leading-relaxed p-6 resize-y font-mono text-sm !text-gray-900"
            />
            <div className="absolute bottom-4 right-4 text-xs text-gray-400">
              Markdown supported
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Save Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="shadow-xl bg-gray-900 hover:bg-black text-white rounded-full px-8 py-6 h-auto text-lg font-medium transition-all hover:scale-105 active:scale-95 border border-gray-800"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Training Agent...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
