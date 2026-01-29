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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          AI Knowledge Base
        </h1>
        <p className="text-muted-foreground">
          Train your Voice Agent with your business details, services, and unique style.
        </p>
      </div>
      
      {/* Card 1: The Super Link */}
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
        <CardHeader className="border-b border-white/5 pb-4 relative z-10">
           <div className="flex items-center gap-2 text-blue-400 mb-1">
              <LinkIcon className="w-5 h-5" />
              <span className="text-sm font-semibold tracking-wider uppercase">Your Public Voice Portal</span>
            </div>
          <CardTitle className="text-xl">The Super Link</CardTitle>
          <CardDescription>Share this link with your customers to let them talk to your AI agent instantly.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 relative z-10">
          <div className="flex items-center gap-4 bg-black/40 border border-blue-500/30 p-4 rounded-xl">
             <div className="flex-1 font-mono text-sm text-blue-200 truncate">
                {typeof window !== 'undefined' ? `${window.location.origin}/meet/${businessId}` : `.../meet/${businessId}`}
             </div>
             <Button variant="outline" size="sm" className="border-blue-500/50 hover:bg-blue-500/20 text-blue-300" onClick={() => window.open(`/meet/${businessId}`, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Test
             </Button>
             <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]" onClick={copySuperLink}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
             </Button>
          </div>
        </CardContent>
      </Card>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 2: The Essentials */}
        <Card className="bg-black/40 border-white/10 backdrop-blur-xl shadow-2xl">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Store className="w-5 h-5" />
              <span className="text-sm font-semibold tracking-wider uppercase">Configuration</span>
            </div>
            <CardTitle className="text-xl">Core Identity</CardTitle>
            <CardDescription>Core business identifiers for the AI agent.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input 
                      value={businessName} 
                      readOnly 
                      className="bg-white/5 border-white/10 text-muted-foreground cursor-not-allowed" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Support/Handoff Phone</Label>
                    <Input 
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                      placeholder="+1 (555) 000-0000"
                      className="bg-black/50 border-white/10 focus:border-purple-500/50 transition-colors"
                    />
                  </div>
              </div>
              
              <div className="space-y-2">
                <Label>Business Hours</Label>
                <Input 
                  value={formData.businessHours}
                  onChange={(e) => setFormData({...formData, businessHours: e.target.value})}
                  placeholder="Mon-Fri: 9AM - 6PM"
                  className="bg-black/50 border-white/10 focus:border-purple-500/50 transition-colors"
                />
              </div>

               <div className="space-y-2">
                <Label>Location / Address</Label>
                <Input 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder={rootAddress || "Enter full address for the AI..."}
                  className="bg-black/50 border-white/10 focus:border-purple-500/50 transition-colors"
                />
                 <p className="text-xs text-muted-foreground">
                   Leave empty to use default account address: <span className="text-white/50">{rootAddress || 'N/A'}</span>
                 </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Services & Pricing */}
        <Card className="bg-black/40 border-white/10 backdrop-blur-xl shadow-2xl">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex items-center gap-2 text-green-400 mb-1">
              <BadgeDollarSign className="w-5 h-5" />
              <span className="text-sm font-semibold tracking-wider uppercase">Menu & Catalog</span>
            </div>
            <CardTitle className="text-xl">Services & Pricing</CardTitle>
            <CardDescription>What you sell and how much it costs.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex gap-2 items-end">
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="space-y-2">
                  <Label>Service Name</Label>
                  <Input 
                    value={newService.name}
                    onChange={(e) => setNewService({...newService, name: e.target.value})}
                    placeholder="e.g. Haircut"
                    className="bg-black/50 border-white/10 focus:border-green-500/50"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') addService();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input 
                    value={newService.price}
                    onChange={(e) => setNewService({...newService, price: e.target.value})}
                    placeholder="$50"
                    className="bg-black/50 border-white/10 focus:border-green-500/50"
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

            <div className="rounded-md border border-white/5 bg-black/20 overflow-hidden">
              <div className="max-h-[220px] overflow-y-auto">
                {formData.services.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No services added yet.
                  </div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="bg-white/5 text-muted-foreground font-medium">
                      <tr>
                        <th className="px-4 py-2">Service</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2 w-[50px]"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {formData.services.map((service, index) => (
                        <tr key={index} className="group hover:bg-white/5 transition-colors">
                          <td className="px-4 py-2">{service.name}</td>
                          <td className="px-4 py-2 text-muted-foreground">{service.price}</td>
                          <td className="px-4 py-2 text-right">
                            <button 
                              onClick={() => removeService(index)}
                              className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
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
      <Card className="bg-black/40 border-white/10 backdrop-blur-xl shadow-2xl border-t-purple-500/20">
        <CardHeader className="border-b border-white/5 pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <BrainCircuit className="w-5 h-5" />
                <span className="text-sm font-semibold tracking-wider uppercase">System Instructions</span>
              </div>
              <CardTitle className="text-xl">The Magic Brain</CardTitle>
              <CardDescription>Define your agent&apos;s personality and behavioral rules.</CardDescription>
            </div>
            <div className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
              <Sparkles className="w-3 h-3" />
              Injected into System Prompt
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="relative">
            <Textarea 
              value={formData.customInstructions}
              onChange={(e) => setFormData({...formData, customInstructions: e.target.value})}
              placeholder="e.g. You are a high-energy fitness coach. Always mention our summer sale..."
              className="min-h-[250px] bg-black/50 border-white/10 focus:border-purple-500/50 text-base leading-relaxed p-6 resize-y font-mono text-sm"
            />
            <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/50">
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
          className="shadow-[0_0_50px_rgba(147,51,234,0.3)] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-full px-8 py-6 h-auto text-lg font-medium transition-all hover:scale-105 active:scale-95 border border-white/20"
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
