"use client";

import {
  ArrowDownToLine,
  ArrowRight,
  Bookmark,
  Building2,
  ChevronDown,
  CircleHelp,
  Compass,
  FileText,
  Folder,
  Home,
  Lightbulb,
  Map as MapIcon,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings,
  Sparkles,
  Sun,
  Target,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const recentAOIs = [
  {
    name: "Downtown Development Site",
    acreage: "12.4 acres",
    zoning: "C-3",
  },
  {
    name: "Riverside Property",
    acreage: "8.7 acres",
    zoning: "R-5",
  },
  {
    name: "West End Parcel",
    acreage: "4.2 acres",
    zoning: "I-1",
  },
  {
    name: "Market St. Corridor",
    acreage: "15.6 acres",
    zoning: "C-2",
  },
];

const zoningData = [
  ["Zoning District", "C-3"],
  ["Max Building Height", "120 ft"],
  ["FAR (Floor Area Ratio)", "4.0"],
  ["Lot Coverage", "80%"],
  ["Setbacks", "0 ft / 0 ft / 10 ft"],
];

const navItems = [
  { label: "Home", icon: Home, active: true },
  { label: "Map", icon: MapIcon },
  { label: "Saved AOIs", icon: Bookmark },
  { label: "Projects", icon: Folder },
  { label: "Settings", icon: Settings },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-[228px] flex-col bg-[#0b1726] text-white lg:flex">
          {/* Logo */}
          <div className="flex h-[72px] items-center gap-3 px-7">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500">
              <Compass className="h-5 w-5" />
            </div>

            <span className="text-xl font-semibold tracking-tight">
              GeoZoning
            </span>
          </div>

          <Separator className="bg-white/10" />

          {/* Navigation */}
          <nav className="flex flex-1 flex-col gap-1 px-4 py-5">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  className={`justify-start gap-3 px-4 ${
                    item.active
                      ? "bg-blue-500/20 text-white hover:bg-blue-500/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Sidebar helper */}
          <div className="border-t border-white/10 p-5">
            <div className="flex gap-3 text-xs leading-5 text-slate-400">
              <CircleHelp className="mt-0.5 h-4 w-4 shrink-0" />

              <p>
                Select an area on the map or search for a location to get zoning
                and property insights.
              </p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top Navigation */}
          <header className="flex h-[72px] items-center justify-between border-b bg-white px-6 lg:px-8">
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-slate-900">
                Real Estate Intelligence
              </span>

              <Separator orientation="vertical" className="h-5" />

              <nav className="hidden items-center gap-6 text-sm text-slate-500 md:flex">
                <button className="font-medium text-slate-900">Zoning</button>
                <button className="hover:text-slate-900">Properties</button>
                <button className="hover:text-slate-900">Insights</button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Sun className="h-4 w-4" />
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <button className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>EI</AvatarFallback>
                </Avatar>

                <span className="hidden text-sm font-medium md:block">
                  Emmanuel I.
                </span>

                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </header>

          {/* Dashboard */}
          <main className="flex-1 overflow-auto p-5 lg:p-7">
            <div className="mx-auto max-w-[1500px]">
              {/* Welcome */}
              <div className="mb-5">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Welcome back, Emmanuel
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Explore zoning data, analyze properties, and make informed
                  real estate decisions.
                </p>
              </div>

              {/* Search */}
              <div className="mb-4 flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    placeholder="Search by address, city, county, or coordinates..."
                    className="h-11 bg-white pl-10"
                  />
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 bg-white"
                >
                  <Target className="h-4 w-4" />
                </Button>
              </div>

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
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_410px]">
                {/* Map */}
                <Card className="overflow-hidden">
                  <CardContent className="relative h-[580px] p-0">
                    {/* Map placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
                      <div className="text-center">
                        <MapIcon className="mx-auto mb-3 h-12 w-12 text-slate-400" />

                        <p className="text-2xl font-semibold text-slate-500">
                          MAP
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Mapbox / Cesium / Leaflet goes here
                        </p>
                      </div>
                    </div>

                    {/* Map tools */}
                    <div className="absolute left-4 top-4 flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm">
                      <MapToolButton>
                        <Target className="h-4 w-4" />
                      </MapToolButton>

                      <MapToolButton>
                        <div className="h-3 w-3 rounded-full border-2 border-slate-600" />
                      </MapToolButton>

                      <MapToolButton>
                        <div className="h-3 w-3 rounded-full border-2 border-slate-600" />
                      </MapToolButton>

                      <MapToolButton>
                        <Pencil className="h-4 w-4" />
                      </MapToolButton>
                    </div>

                    {/* Fake AOI */}
                    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                      <div className="rounded-lg border border-blue-500 bg-blue-500/20 px-16 py-20">
                        <div className="rounded-md bg-slate-900 px-3 py-2 text-center text-xs text-white shadow-lg">
                          <div className="font-medium">AOI</div>
                          <div className="text-slate-300">12.4 acres</div>
                        </div>
                      </div>
                    </div>

                    {/* Map controls */}
                    <div className="absolute bottom-4 right-4 flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-none"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>

                      <Separator />

                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-none"
                      >
                        <span className="text-lg leading-none">−</span>
                      </Button>
                    </div>

                    {/* Scale */}
                    <div className="absolute bottom-4 left-4 rounded bg-white/90 px-3 py-1.5 text-xs text-slate-600 shadow-sm">
                      0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;250
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;500 ft
                    </div>
                  </CardContent>
                </Card>

                {/* AOI Summary */}
                <AOISummary />
              </div>

              {/* Recent AOIs */}
              <section className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Recent AOIs</h2>

                  <Button variant="ghost" size="sm" className="gap-1">
                    View all
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {recentAOIs.map((aoi) => (
                    <Card
                      key={aoi.name}
                      className="cursor-pointer transition-shadow hover:shadow-md"
                    >
                      <CardContent className="flex gap-3 p-3">
                        {/* Thumbnail placeholder */}
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-slate-200">
                          <MapIcon className="h-6 w-6 text-slate-400" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="truncate text-sm font-medium">
                              {aoi.name}
                            </p>

                            <MoreHorizontal className="h-4 w-4 shrink-0 text-slate-400" />
                          </div>

                          <p className="mt-1 text-xs text-slate-500">
                            {aoi.acreage} &nbsp;•&nbsp; {aoi.zoning}
                          </p>

                          <p className="mt-2 text-[11px] text-slate-400">
                            Recently viewed
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function QuickAction({
  icon: Icon,
  title,
  description,
  active = false,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <Card
      className={`cursor-pointer transition-colors ${
        active ? "border-blue-500 ring-1 ring-blue-500/20" : ""
      }`}
    >
      <CardContent className="flex min-h-[92px] items-center gap-3 p-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            active ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-600"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-1 text-xs leading-4 text-slate-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MapToolButton({ children }: { children: React.ReactNode }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-10 w-10 rounded-none border-b last:border-b-0"
    >
      {children}
    </Button>
  );
}

function AOISummary() {
  return (
    <Card className="h-[580px] overflow-hidden">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">AOI Summary</CardTitle>

          <Button variant="link" size="sm" className="text-blue-600">
            Clear
          </Button>
        </div>

        <div className="mt-3 flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
            <MapPin className="h-4 w-4 text-blue-600" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium">Downtown Development Site</p>

              <Pencil className="h-3.5 w-3.5 text-slate-400" />
            </div>

            <p className="mt-1 text-xs text-slate-500">
              12.4 acres&nbsp;&nbsp;•&nbsp;&nbsp;Polygon
            </p>

            <p className="mt-1 text-xs text-slate-400">
              38.8951° N, 77.0364° W
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="overflow-auto p-4">
        {/* Tabs */}
        <div className="mb-5 flex gap-5 border-b text-xs">
          <button className="border-b-2 border-blue-600 pb-3 font-medium text-blue-600">
            Zoning
          </button>

          <button className="pb-3 text-slate-500 hover:text-slate-900">
            Land Use
          </button>

          <button className="pb-3 text-slate-500 hover:text-slate-900">
            Property Details
          </button>

          <button className="pb-3 text-slate-500 hover:text-slate-900">
            More
          </button>
        </div>

        {/* Current Zoning */}
        <div className="rounded-xl border bg-slate-50/70 p-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <Sparkles className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-xs font-medium text-emerald-600">
                Current Zoning
              </p>

              <p className="mt-0.5 text-xl font-semibold">C-3</p>

              <p className="text-sm text-slate-600">General Commercial</p>
            </div>
          </div>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            Allows for a wide range of commercial uses including retail, office,
            and mixed-use developments.
          </p>

          <Button
            variant="link"
            size="sm"
            className="mt-2 h-auto p-0 text-blue-600"
          >
            View zoning details
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>

        {/* Key Information */}
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold">Key Zoning Information</h3>

          <div className="divide-y">
            {zoningData.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between py-3 text-xs"
              >
                <span className="text-slate-500">{label}</span>
                <span className="font-medium text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Zoning */}
        <div className="mt-5">
          <h3 className="mb-3 text-sm font-semibold">Nearby Zoning</h3>

          <div className="space-y-3">
            <NearbyZoning
              color="bg-red-400"
              name="C-3 (General Commercial)"
              distance="0.2 mi"
            />
            <NearbyZoning
              color="bg-yellow-400"
              name="R-5 (Residential)"
              distance="0.4 mi"
            />
            <NearbyZoning
              color="bg-purple-400"
              name="I-1 (Light Industrial)"
              distance="0.6 mi"
            />
          </div>
        </div>

        {/* Tip */}
        <div className="mt-6 flex gap-3 rounded-lg bg-blue-50 p-3">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

          <p className="text-xs leading-5 text-blue-700">
            You can save this AOI to your projects or adjust the boundary for a
            more detailed analysis.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function NearbyZoning({
  color,
  name,
  distance,
}: {
  color: string;
  name: string;
  distance: string;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <span className={`h-4 w-4 rounded ${color}`} />
        <span className="text-slate-600">{name}</span>
      </div>

      <span className="text-slate-400">{distance}</span>
    </div>
  );
}
