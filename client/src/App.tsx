import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Locations from "@/pages/locations";
import Members from "@/pages/members";
import Personnel from "@/pages/personnel";
import Families from "@/pages/families";
import Teams from "@/pages/teams";
import Sessions from "@/pages/sessions";
import Payments from "@/pages/payments";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

function Router() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/locations" component={Locations} />
            <Route path="/members" component={Members} />
            <Route path="/personnel" component={Personnel} />
            <Route path="/families" component={Families} />
            <Route path="/teams" component={Teams} />
            <Route path="/sessions" component={Sessions} />
            <Route path="/payments" component={Payments} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
