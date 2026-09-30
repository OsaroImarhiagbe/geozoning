"use client";
import { ArrowDownToLine, Bookmark, Building2, Target } from "lucide-react";

import Map from "@/features/dashboard/components/map";
import RecentAOI from "@/features/dashboard/components/recent-aoi";
import AOISummary from "@/features/dashboard/components/aoi-summary";
import DashboardSearch from "@/features/dashboard/components/dashboard-search";
import QuickAction from "@/features/dashboard/components/quick-action";

export default function HomePage() {
  return (
    <section className="bg-slate-50 p-5">
      {/* Name + Introduction*/}
      <div className="mb-5">
        <h1 className="text-2xl font-mono font-semibold tracking-tight">
          Welcome back, Emmanuel
        </h1>

        <p className="mt-1 text-sm text-slate-500 font-mono">
          Explore zoning data, analyze properties, and make informed real estate
          decisions.
        </p>
      </div>
      {/* Search */}
      <>
        <DashboardSearch />
      </>
      {/* Quick Actions */}
      <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
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
      </div>
      {/* Main Workspace */}
      <div className="grid w-full gap-5 xl:grid-cols-[minmax(0,1fr)_410px]">
        <div className="relative h-[90vh] min-w-0 overflow-hidden rounded-xl border bg-white">
          <Map />
        </div>
        <AOISummary />
      </div>
      {/* Recent AOIs */}
      <RecentAOI />
    </section>
  );
}
