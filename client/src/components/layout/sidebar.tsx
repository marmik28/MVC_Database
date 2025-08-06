import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: "fas fa-chart-pie" },
  { name: "Locations", href: "/locations", icon: "fas fa-map-marker-alt" },
  { name: "Personnel", href: "/personnel", icon: "fas fa-users" },
  { name: "Club Members", href: "/members", icon: "fas fa-user-friends" },
  { name: "Families", href: "/families", icon: "fas fa-home" },
  { name: "Teams", href: "/teams", icon: "fas fa-users-cog" },
  { name: "Sessions", href: "/sessions", icon: "fas fa-calendar-alt" },
  { name: "Payments", href: "/payments", icon: "fas fa-credit-card" },
  { name: "Email Logs", href: "/email-logs", icon: "fas fa-envelope" },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <nav className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-volleyball-ball text-white text-lg"></i>
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-bold text-gray-900">VCS</h1>
            <p className="text-sm text-gray-600">Club System</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <a
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <i className={cn(item.icon, "w-5 h-5 mr-3")}></i>
                  {item.name}
                </a>
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <i className="fas fa-user text-gray-600 text-sm"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-600">General Manager</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
