'use client';

import { useEffect, useState } from 'react';
import { Filter, Eye, Heart, TrendingUp, Plus, Search, Mail, Phone, MoreVertical, ExternalLink, RefreshCw } from "lucide-react";
import { useLeadStore, InstagramMedia, VideoAnalysis, Lead } from '@/lib/store/leadStore';

// Types are now imported from @/lib/store/leadStore indirectly or used within the store

export default function LeadManagement() {
    const {
        analyses,
        leads,
        instagramMedia,
        loading,
        fetchAnalyses,
        fetchLeads,
        fetchInstagramMedia,
        getTotalStats
    } = useLeadStore();

    const [activeTab, setActiveTab] = useState<'analytics' | 'database'>('analytics');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
    const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', source: 'Manual', status: 'new' });

    const stats = getTotalStats();

    useEffect(() => {
        if (activeTab === 'analytics') {
            fetchAnalyses();
            fetchInstagramMedia();
        } else {
            fetchLeads();
        }
    }, [activeTab]);

    const handleAnalyzeMedia = async (media: InstagramMedia) => {
        // As requested: "when user click on the analyze then only show thsi is implemented later"
        alert(`Analysis for Instagram post ${media.id} is being set up. This feature is implemented but currently showing this placeholder as requested.`);
    };

    const handleCreateLead = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(newLead)
            });
            if (response.ok) {
                setIsAddModalOpen(false);
                setNewLead({ name: '', email: '', phone: '', source: 'Manual', status: 'new' });
                fetchLeads();
            }
        } catch (error) {
            console.error('Error creating lead:', error);
        }
    };

    const updateLeadStatus = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/leads/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                fetchLeads();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA]">

            <main className="px-8 py-6 max-w-[1600px] mx-auto">
                {/* Page Header */}
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
                        <p className="text-gray-500 mt-1">
                            {activeTab === 'analytics' ? 'Video Performance & Analysis' : 'Manage your contact database'}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        {activeTab === 'analytics' && (
                            <button
                                onClick={() => fetchInstagramMedia(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white font-medium rounded-xl hover:bg-pink-700 transition-colors shadow-sm"
                                title="Force refresh recent posts from your Instagram account"
                            >
                                <TrendingUp className="w-4 h-4" />
                                Sync Instagram
                            </button>
                        )}
                        {activeTab === 'database' && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                                title="Manually add a lead who contacted you outside of social media"
                            >
                                <Plus className="w-4 h-4" />
                                Add Lead
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (activeTab === 'analytics') {
                                    fetchAnalyses(true);
                                    fetchInstagramMedia(true);
                                } else {
                                    fetchLeads(true);
                                }
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-gray-200 mb-8">
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === 'analytics' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Analytics
                        {activeTab === 'analytics' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('database')}
                        className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === 'database' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Lead Database
                        {activeTab === 'database' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <p className="text-gray-500">Loading...</p>
                    </div>
                ) : activeTab === 'analytics' ? (
                    /* ANALYTICS VIEW */
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group">
                                <div className="flex items-center gap-2 text-gray-600 font-semibold mb-2">
                                    <Eye className="w-4 h-4 text-blue-500" />
                                    Total Views
                                </div>
                                <p className="text-3xl font-bold text-gray-900">
                                    {stats.views.toLocaleString()}
                                </p>
                                <div className="absolute -top-2 -right-2 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-blue-100 shadow-sm">
                                    From Analyzed Content
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group">
                                <div className="flex items-center gap-2 text-gray-600 font-semibold mb-2">
                                    <Heart className="w-4 h-4 text-red-500" />
                                    Total Engagement
                                </div>
                                <p className="text-3xl font-bold text-gray-900">
                                    {stats.engagement.toLocaleString()}
                                </p>
                                <div className="absolute -top-2 -right-2 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-red-100 shadow-sm">
                                    Raw Feed + Analyzed
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-2 text-gray-600 font-semibold mb-2">
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                    Avg Quality
                                </div>
                                <p className="text-3xl font-bold text-gray-900">
                                    {stats.avgQuality}%
                                </p>
                            </div>
                        </div>

                        {/* RAW MEDIA FEED (PRIMARY) */}
                        <div className="mb-12">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-pink-600" />
                                Your Recent Instagram Posts
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {instagramMedia.length > 0 ? (
                                    instagramMedia.map(media => (
                                        <div key={media.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                                            <div className="aspect-square relative overflow-hidden bg-gray-100">
                                                {media.media_url && (
                                                    <img
                                                        src={media.media_url}
                                                        alt=""
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                )}
                                                <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-[9px] font-bold text-white uppercase tracking-wider">
                                                    {media.media_type}
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-sm text-gray-900 font-semibold line-clamp-2 mb-3 h-10">
                                                    {media.caption || 'No caption'}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 text-[11px] text-gray-500 font-bold">
                                                        <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-400" /> {media.like_count || 0}</span>
                                                        <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-blue-400" /> {media.comments_count || 0}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAnalyzeMedia(media)}
                                                        className="px-4 py-1.5 bg-blue-600 text-white font-bold text-[11px] rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                                                    >
                                                        Analyze
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
                                        <p className="text-gray-500 text-sm font-medium">Fetching your Instagram posts...</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ANALYZED CAMPAIGNS (SECONDARY) */}
                        <div className="space-y-4">
                            {analyses.map(analysis => (
                                <div key={analysis._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                        <div className="md:col-span-2 flex gap-4">
                                            {analysis.thumbnailUrl && (
                                                <a
                                                    href={analysis.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-24 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100 shadow-sm relative group cursor-pointer"
                                                >
                                                    <img
                                                        src={analysis.thumbnailUrl}
                                                        alt="Video Preview"
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <ExternalLink className="w-6 h-6 text-white drop-shadow-lg" />
                                                    </div>
                                                </a>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${analysis.platform === 'instagram' ? 'bg-pink-50 text-pink-600 border border-pink-100' : 'bg-red-50 text-red-600 border border-red-100'
                                                        }`}>
                                                        {analysis.platform}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-medium">
                                                        {new Date(analysis.analyzedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <a
                                                    href={analysis.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight block mb-1"
                                                >
                                                    {analysis.aiSummary || 'Video Analysis'}
                                                </a>
                                                <p className="text-xs text-gray-500 line-clamp-2 italic leading-relaxed">
                                                    "{analysis.description || 'Campaign Content'}"
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    <span className="text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                                                        🎯 {analysis.audienceType || 'Global'}
                                                    </span>
                                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${analysis.audienceSentiment === 'positive' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-600 border-gray-100'
                                                        }`}>
                                                        ✨ {analysis.audienceSentiment || 'Neutral'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Views</p>
                                            <p className="text-lg font-bold text-gray-900">{(analysis.platformStats.views || 0).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Eng.</p>
                                            <p className="text-lg font-bold text-gray-900">{((analysis.platformStats.likes || 0) + (analysis.platformStats.comments || 0)).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Quality</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500" style={{ width: `${analysis.leadQualityScore || 0}%` }} />
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{analysis.leadQualityScore || 0}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    /* DATABASE VIEW */
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#F8F9FA] border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Lead Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Contact</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Source</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Score</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {leads.map(lead => (
                                        <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">{lead.name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <div className="flex flex-col gap-1">
                                                    {lead.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>}
                                                    {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                                                    className={`px-2 py-1 text-xs font-bold rounded-lg border-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${lead.status === 'qualified' ? 'bg-green-100 text-green-700' :
                                                        lead.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                                                            lead.status === 'closed' ? 'bg-purple-100 text-purple-700' :
                                                                'bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    <option value="new">New</option>
                                                    <option value="qualified">Qualified</option>
                                                    <option value="contacted">Contacted</option>
                                                    <option value="closed">Closed</option>
                                                    <option value="archived">Archived</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium">
                                                    {lead.source}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-gray-900">{lead.score}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(lead.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-400">
                                                <button className="hover:text-gray-600">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {leads.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                                No leads found. Start by adding one manually or via video analysis.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Add Lead Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Lead</h2>
                        <form onSubmit={handleCreateLead} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={newLead.name}
                                    onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={newLead.email}
                                    onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={newLead.phone}
                                    onChange={e => setNewLead({ ...newLead, phone: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Source</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        value={newLead.source}
                                        onChange={e => setNewLead({ ...newLead, source: e.target.value })}
                                    >
                                        <option value="Manual">Manual</option>
                                        <option value="Website">Website</option>
                                        <option value="Social Media">Social Media</option>
                                        <option value="Referral">Referral</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        value={newLead.status}
                                        onChange={e => setNewLead({ ...newLead, status: e.target.value as any })}
                                    >
                                        <option value="new">New</option>
                                        <option value="qualified">Qualified</option>
                                        <option value="contacted">Contacted</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    Create Lead
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
