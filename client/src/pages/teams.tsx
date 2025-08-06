import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import DataTable, { TypeBadge } from "@/components/data-table";
import { useState } from "react";
import AddTeamModal from "@/components/modals/add-team-modal";

export default function Teams() {
  const [showAddTeam, setShowAddTeam] = useState(false);

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ["/api/teams"],
  });

  const columns = [
    {
      key: "teamName",
      label: "Team Name",
      render: (value: any, row: any) => (
        <div className="font-medium text-gray-900">{row.teamName}</div>
      ),
    },
    {
      key: "gender",
      label: "Gender",
      render: (value: any, row: any) => <TypeBadge type={row.gender} />,
    },
    {
      key: "headCoachId",
      label: "Head Coach",
      render: (value: any, row: any) => (
        <div className="text-sm">Coach ID: {row.headCoachId || 'TBD'}</div>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      render: (value: any, row: any) => (
        <div className="text-sm">
          <div>{row.startDate ? new Date(row.startDate).toLocaleDateString() : 'TBD'}</div>
          <div className="text-gray-500">
            - {row.endDate ? new Date(row.endDate).toLocaleDateString() : 'Ongoing'}
          </div>
        </div>
      ),
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
          <h1 className="text-2xl font-bold text-gray-900">Team Formations</h1>
          <p className="text-gray-600">Manage team formations and assignments</p>
        </div>
        <Button 
          onClick={() => setShowAddTeam(true)}
          data-testid="button-add-team"
        >
          <i className="fas fa-plus mr-2"></i>
          Create Team
        </Button>
      </div>

      <DataTable
        title="All Teams"
        columns={columns}
        data={teams}
      />

      <AddTeamModal 
        isOpen={showAddTeam} 
        onClose={() => setShowAddTeam(false)} 
      />
    </div>
  );
}
