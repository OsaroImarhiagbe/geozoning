"use client";
import { ArrowRight, Map as MapIcon, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
export default function RecentAOI() {
  return (
    <section className="mt-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold font-mono">Recent AOIs</h2>

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
                  <p className="truncate text-sm font-medium">{aoi.name}</p>

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
  );
}
