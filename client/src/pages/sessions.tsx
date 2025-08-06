import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import DataTable, { TypeBadge } from "@/components/data-table";
import { useState } from "react";
import AddSessionModal from "@/components/modals/add-session-modal";

export default function Sessions() {
  const [showAddSession, setShowAddSession] = useState(false);

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["/api/sessions"],
  });

  const columns = [
    {
      key: "session",
      label: "Session",
      render: (value: any, row: any) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {row.sessionType === "Game" ? "Game Session" : "Training Session"}
          </div>
          <div className="text-xs text-gray-500">
            {row.address || "Location TBD"}
          </div>
        </div>
      ),
    },
    {
      key: "teams",
      label: "Teams",
      render: (value: any, row: any) => (
        <div className="text-sm">
          <div>Team {row.team1Id} vs Team {row.team2Id}</div>
          {row.scoreTeam1 !== null && row.scoreTeam2 !== null && (
            <div className="text-xs text-gray-500">
              Score: {row.scoreTeam1} - {row.scoreTeam2}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "datetime",
      label: "Date/Time",
      render: (value: any, row: any) => (
        <div>
          <div className="text-sm text-gray-900">
            {new Date(row.sessionDate).toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-500">{row.startTime}</div>
        </div>
      ),
    },
    {
      key: "sessionType",
      label: "Type",
      render: (value: any, row: any) => <TypeBadge type={row.sessionType} />,
    },
    {
      key: "status",
      label: "Status",
      render: (value: any, row: any) => {
        const sessionDate = new Date(row.sessionDate);
        const today = new Date();
        const status = sessionDate > today ? "Upcoming" : "Completed";
        return <TypeBadge type={status} />;
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training & Game Sessions</h1>
          <p className="text-gray-600">Schedule and manage training sessions and games</p>
        </div>
        <Button 
          onClick={() => setShowAddSession(true)}
          data-testid="button-add-session"
        >
          <i className="fas fa-plus mr-2"></i>
          Schedule Session
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary bg-opacity-10 rounded-full">
              <i className="fas fa-calendar-alt text-primary text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="stat-total-sessions">
                {sessions.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-success bg-opacity-10 rounded-full">
              <i className="fas fa-dumbbell text-success text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Training Sessions</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="stat-training-sessions">
                {sessions.filter((s: any) => s.sessionType === 'Training').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-warning bg-opacity-10 rounded-full">
              <i className="fas fa-trophy text-warning text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Game Sessions</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="stat-game-sessions">
                {sessions.filter((s: any) => s.sessionType === 'Game').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-secondary bg-opacity-10 rounded-full">
              <i className="fas fa-clock text-secondary text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="stat-upcoming-sessions">
                {sessions.filter((s: any) => new Date(s.sessionDate) > new Date()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        title="All Sessions"
        columns={columns}
        data={sessions}
      />

      <AddSessionModal 
        isOpen={showAddSession} 
        onClose={() => setShowAddSession(false)} 
      />
    </div>
  );
}
