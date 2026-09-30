"use client";
import { Search, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function DashboardSearch() {
  return (
    <div className="mb-4 flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <Input
          placeholder="Search by address, city, county, or coordinates..."
          className="h-11 bg-white pl-10 font-mono"
        />
      </div>
      {/* Submit button */}
      <Button variant="outline" size="icon" className="h-11 w-11 bg-white">
        <Target className="h-4 w-4" />
      </Button>
    </div>
  );
}
