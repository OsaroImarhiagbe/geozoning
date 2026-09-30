"use client";
import { ArrowRight, Lightbulb, MapPin, Pencil, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const zoningData = [
  ["Zoning District", "C-3"],
  ["Max Building Height", "120 ft"],
  ["FAR (Floor Area Ratio)", "4.0"],
  ["Lot Coverage", "80%"],
  ["Setbacks", "0 ft / 0 ft / 10 ft"],
];
export default function AOISummary() {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold font-mono">
            AOI Summary
          </CardTitle>

          <Button
            variant="link"
            size="sm"
            className="text-blue-600 font-bold font-mono text-sm hover:cursor-pointer"
          >
            Clear
          </Button>
        </div>

        <div className="mt-3 flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
            <MapPin className="h-4 w-4 text-blue-600" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium font-mono text-md">
                Downtown Development Site
              </p>

              <Pencil className="h-3.5 w-3.5 text-[#64748B]" />
            </div>

            <p className="mt-1 text-xs text-[#64748B] font-mono">
              12.4 acres&nbsp;&nbsp;•&nbsp;&nbsp;Polygon
            </p>

            <p className="mt-1 text-xs text-[#64748B]">
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
