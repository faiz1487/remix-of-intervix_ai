import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Building2,
  Users,
  FileText,
  Contact,
  Lightbulb,
  Route as RouteIcon,
  MessageSquareHeart,
  LogOut,
  MessageSquareText,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/jobs", icon: Briefcase, label: "Jobs (Company-wise)" },
  { to: "/admin/questions", icon: MessageSquare, label: "Questions (Topic-wise)" },
  { to: "/admin/company-questions", icon: Building2, label: "Company-wise Questions" },
  { to: "/admin/scenario-questions", icon: Lightbulb, label: "Scenarios" },
  { to: "/admin/prep-roadmap", icon: RouteIcon, label: "Prep Roadmap" },
  { to: "/admin/hr-contacts", icon: Contact, label: "HR Contacts" },
  { to: "/admin/templates", icon: FileText, label: "Templates" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/feedback", icon: MessageSquareHeart, label: "Feedback" },
  { to: "/admin/contact-messages", icon: MessageSquareText, label: "Contact Messages" },
];

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-lg font-bold text-primary">Intervixa AI</h1>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
