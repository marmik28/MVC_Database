import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import DataTable, { StatusBadge, TypeBadge } from "@/components/data-table";
import { useState } from "react";
import AddMemberModal from "@/components/modals/add-member-modal";

export default function Members() {
  const [showAddMember, setShowAddMember] = useState(false);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["/api/members"],
  });

  const columns = [
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
      key: "contact",
      label: "Contact",
      render: (value: any, row: any) => (
        <div className="text-sm">
          <div>{row.email}</div>
          <div className="text-gray-500">{row.phone}</div>
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
    {
      key: "joinDate",
      label: "Join Date",
      render: (value: any, row: any) => (
        <div className="text-sm">
          {new Date(row.joinDate).toLocaleDateString()}
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
          <h1 className="text-2xl font-bold text-gray-900">Club Members</h1>
          <p className="text-gray-600">Manage club members and registrations</p>
        </div>
        <Button 
          onClick={() => setShowAddMember(true)}
          data-testid="button-add-member"
        >
          <i className="fas fa-plus mr-2"></i>
          Add Member
        </Button>
      </div>

      <DataTable
        title="All Members"
        columns={columns}
        data={members}
      />

      <AddMemberModal 
        isOpen={showAddMember} 
        onClose={() => setShowAddMember(false)} 
      />
    </div>
  );
}
