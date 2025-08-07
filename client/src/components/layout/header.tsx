import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

const pageNames: { [key: string]: string } = {
  "/": "Dashboard",
  "/locations": "Locations",
  "/personnel": "Personnel", 
  "/members": "Club Members",
  "/families": "Families",
  "/teams": "Teams",
  "/sessions": "Sessions",
  "/payments": "Payments",
  "/email-logs": "Emails",
};

export default function Header() {
  const [location] = useLocation();
  const pageName = pageNames[location] || "Page Not Found";

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900" data-testid="page-title">
            {pageName}
          </h2>
          <p className="text-sm text-gray-600">Montreal Volleyball Club Management System</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            data-testid="button-notifications"
          >
            <i className="fas fa-bell text-lg"></i>
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            data-testid="button-settings"
          >
            <i className="fas fa-cog text-lg"></i>
          </Button>
        </div>
      </div>
    </header>
  );
}
