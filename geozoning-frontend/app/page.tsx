"use client";

import { ArrowDownToLine, Bookmark, Building2, Target } from "lucide-react";

import Map from "@/features/dashboard/components/map";
import RecentAOI from "@/features/dashboard/components/recent-aoi";
import AOISummary from "@/features/dashboard/components/aoi-summary";
import DashboardSearch from "@/features/dashboard/components/dashboard-search";
import QuickAction from "@/features/dashboard/components/quick-action";

export default function HomePage() {
  return (
    <section className="flex min-h-screen flex-col bg-[#F8FAFC] px-6 py-7">
      <div className="mx-auto w-full max-w-[1500px] px-5 py-6">
        {/* Header */}
        <section className="mb-5">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 font-mono">
            Welcome back, Emmanuel
          </h1>

          <p className="mt-1 text-sm text-slate-500 font-mono">
            Explore zoning data, analyze properties, and make informed real
            estate decisions.
          </p>
        </section>

        {/* Search */}
        <div className="mb-4 flex gap-3">
          <div className="flex-1">
            <DashboardSearch />
          </div>
        </div>

        {/* Quick Actions */}
        <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <QuickAction
            icon={Target}
            title="Select AOI"
            description="Draw, upload, or search for an area"
            active
          />

          <QuickAction
            icon={Building2}
            title="Get Zoning Summary"
            description="View zoning, land use, and development rules"
          />

          <QuickAction
            icon={Bookmark}
            title="Save & Organize"
            description="Save AOIs for later or add to a project"
          />

          <QuickAction
            icon={ArrowDownToLine}
            title="Export Report"
            description="Download data and share with your team"
          />
        </section>

        {/* Main Workspace */}
        <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_410px]">
          {/* Map */}
          <div className="bg-white min-w-0 overflow-hidden rounded-xl p-5 h">
            <Map />
            <div className="mt-auto pt-5">
              <RecentAOI />
            </div>
          </div>
          {/* AOI Summary */}
          <div className="min-w-0">
            <AOISummary />
          </div>
        </section>
      </div>
    </section>
  );
}
