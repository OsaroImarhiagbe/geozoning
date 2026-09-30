"use client";
import { Card, CardContent } from "@/components/ui/card";
export default function QuickAction({
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
          <p className="text-md font-bold font-mono leading-tight">{title}</p>
          <p className="mt-1 text-xs leading-4 text-[#64748B] font-mono">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
