
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export function Layout() {
  // In a real app, this would come from authentication
  const [managerName] = useState("Sarah Johnson");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Header managerName={managerName} />
          <main className="p-4 md:p-6">
            <SidebarTrigger className="block md:hidden mb-4">
              <span className="sr-only">Toggle Menu</span>
            </SidebarTrigger>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
