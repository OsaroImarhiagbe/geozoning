"use client";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { ChevronDown, Sun } from "lucide-react";
export default function DashboardHeader() {
  return (
    <>
      <div className="flex items-center gap-6">
        <span className="text-md font-medium text-[#64748B] font-mono">
          Real Estate Intelligence
        </span>

        <Separator orientation="vertical" className="h-5" />

        <nav className="hidden items-center gap-6 text-sm font-mono md:flex">
          <button className="text-[#64748B]">Zoning</button>
          <button className="text-[#64748B]">Properties</button>
          <button className="text-[#64748B]">Insights</button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <Sun className="h-4 w-4" color="#FAF9F6" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <button className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>EI</AvatarFallback>
          </Avatar>

          <span className="hidden text-sm font-medium md:block text-[#FAF9F6]">
            Emmanuel I.
          </span>

          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
      </div>
    </>
  );
}
