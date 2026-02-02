'use client';

import { ContentCalendar } from "@/components/dashboard/ContentCalendar";

export default function ContentBoardPage() {
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Content Board</h1>
                    <p className="text-gray-500 mt-1">Manage and schedule your social media content.</p>
                </div>
            </div>

            <ContentCalendar />
        </div>
    );
}
