import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { House, Map, FolderGit, Settings } from "lucide-react";
// This is sample data.
const data = [
  {
    title: "Home",
    icon: House,
    url: "#",
  },
  {
    title: "Map",
    icon: Map,
    url: "#",
  },
  {
    title: "Projects",
    icon: FolderGit,
    url: "#",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "#",
  },
];
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="bg-[#0B1726] text-[#FAF9F6] text-2xl p-4 font-mono font-bold">
        GeoZone
      </SidebarHeader>
      <SidebarContent className="bg-[#0B1726]">
        {data.map((item) => {
          const IconComponent = item.icon;
          return (
            <SidebarGroup key={item.title}>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<a href={item.url} />}
                      className="text-[#64748B] font-mono text-md font-semibold"
                    >
                      <IconComponent /> {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
