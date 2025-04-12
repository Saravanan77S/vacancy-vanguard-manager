
import { 
  Briefcase, 
  Calendar, 
  FileText, 
  Home, 
  PlusCircle, 
  Users,
  AlertCircle
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const location = useLocation();
  
  const navItems = [
    { 
      title: "Dashboard", 
      path: "/", 
      icon: Home 
    },
    { 
      title: "Create Job", 
      path: "/create-job", 
      icon: PlusCircle 
    },
    { 
      title: "Job Listings", 
      path: "/jobs", 
      icon: Briefcase 
    },
    { 
      title: "Active Jobs", 
      path: "/active-jobs", 
      icon: Calendar 
    },
    { 
      title: "Applications", 
      path: "/applications", 
      icon: Users 
    },
    { 
      title: "Reports", 
      path: "/reports", 
      icon: AlertCircle 
    }
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <div className="py-4 flex flex-col items-center">
          <div className="flex items-center gap-2 px-2 mb-8">
            <Briefcase className="h-6 w-6 text-purple-600" />
            <h1 className="text-xl font-semibold">Vacancy Vanguard</h1>
          </div>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.path} 
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md w-full", 
                          location.pathname === item.path 
                            ? "bg-purple-100 text-purple-700" 
                            : "hover:bg-gray-100"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
