import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/stats-card";
import DataTable, { StatusBadge, TypeBadge } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddMemberModal from "@/components/modals/add-member-modal";

export default function Dashboard() {
  const [showAddMember, setShowAddMember] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: recentMembers = [], isLoading: membersLoading } = useQuery({
    queryKey: ["/api/members"],
  });

  const { data: upcomingSessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ["/api/sessions/upcoming"],
  });

  const memberColumns = [
    {
      key: "member",
      label: "Member",
      render: (value: any, row: any) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <i className="fas fa-user text-gray-600 text-xs"></i>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {row.firstName} {row.lastName}
            </div>
            <div className="text-xs text-gray-500">ID: #{row.id}</div>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (value: any, row: any) => {
        const birthDate = new Date(row.dob);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        const type = age >= 18 ? "Major" : "Minor";
        return <TypeBadge type={type} />;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (value: any, row: any) => <StatusBadge status={row.status} />,
    },
  ];

  const sessionColumns = [
    {
      key: "session",
      label: "Session",
      render: (value: any, row: any) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {row.sessionType === "Game" ? "Team vs Team" : "Team Training"}
          </div>
          <div className="text-xs text-gray-500">Location TBD</div>
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
  ];

  if (statsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Locations"
          value={stats?.totalLocations || 0}
          icon="fas fa-map-marker-alt"
          iconBgColor="bg-primary"
          iconColor="text-primary"
        />
        <StatsCard
          title="Active Members"
          value={stats?.activeMembers || 0}
          icon="fas fa-user-friends"
          iconBgColor="bg-success"
          iconColor="text-success"
        />
        <StatsCard
          title="Active Teams"
          value={stats?.activeTeams || 0}
          icon="fas fa-users-cog"
          iconBgColor="bg-secondary"
          iconColor="text-secondary"
        />
        <StatsCard
          title="This Week Sessions"
          value={stats?.weekSessions || 0}
          icon="fas fa-calendar-alt"
          iconBgColor="bg-warning"
          iconColor="text-warning"
        />
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button
              onClick={() => setShowAddMember(true)}
              className="w-full justify-between bg-primary bg-opacity-5 hover:bg-opacity-10 text-gray-900 border border-primary border-opacity-20"
              variant="outline"
              data-testid="button-add-member"
            >
              <div className="flex items-center">
                <i className="fas fa-user-plus text-primary mr-3"></i>
                <span className="text-sm font-medium">Add New Member</span>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </Button>
            
            <Button
              className="w-full justify-between bg-secondary bg-opacity-5 hover:bg-opacity-10 text-gray-900 border border-secondary border-opacity-20"
              variant="outline"
              data-testid="button-create-team"
            >
              <div className="flex items-center">
                <i className="fas fa-users-cog text-secondary mr-3"></i>
                <span className="text-sm font-medium">Create Team</span>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </Button>
            
            <Button
              className="w-full justify-between bg-success bg-opacity-5 hover:bg-opacity-10 text-gray-900 border border-success border-opacity-20"
              variant="outline"
              data-testid="button-schedule-session"
            >
              <div className="flex items-center">
                <i className="fas fa-calendar-plus text-success mr-3"></i>
                <span className="text-sm font-medium">Schedule Session</span>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </Button>
            
            <Button
              className="w-full justify-between bg-warning bg-opacity-5 hover:bg-opacity-10 text-gray-900 border border-warning border-opacity-20"
              variant="outline"
              data-testid="button-process-payment"
            >
              <div className="flex items-center">
                <i className="fas fa-credit-card text-warning mr-3"></i>
                <span className="text-sm font-medium">Process Payment</span>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button 
              className="text-sm text-primary hover:text-primary-dark"
              data-testid="button-view-activity"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentMembers.slice(0, 4).map((member: any, index: number) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-success bg-opacity-10 rounded-full flex items-center justify-center">
                  <i className="fas fa-user-plus text-success text-sm"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New member registered: {member.firstName} {member.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(member.joinDate).toLocaleDateString()} • Location TBD
                  </p>
                </div>
              </div>
            ))}
            {recentMembers.length === 0 && (
              <p className="text-sm text-gray-500">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Data Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DataTable
          title="Recent Members"
          columns={memberColumns}
          data={recentMembers.slice(0, 5)}
        />
        
        <DataTable
          title="Upcoming Sessions"
          columns={sessionColumns}
          data={upcomingSessions}
        />
      </div>

      {/* Add Member Modal */}
      <AddMemberModal 
        isOpen={showAddMember} 
        onClose={() => setShowAddMember(false)} 
      />
    </div>
  );
}
