"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Páginas sem sidebar e header
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <SidebarProvider className="flex flex-col">
      {!isAuthPage && <SiteHeader />}
      <div className="flex flex-1">
        {!isAuthPage && <AppSidebar />}
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
