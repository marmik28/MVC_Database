import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import DataTable, { TypeBadge } from "@/components/data-table";
import { useState } from "react";
import AddPersonnelModal from "@/components/modals/add-personnel-modal";

export default function Personnel() {
  const [showAddPersonnel, setShowAddPersonnel] = useState(false);

  const { data: personnel = [], isLoading } = useQuery({
    queryKey: ["/api/personnel"],
  });

  const columns = [
    {
      key: "person",
      label: "Personnel",
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
      key: "roleId",
      label: "Role",
      render: (value: any, row: any) => (
        <TypeBadge type={`Role ${row.roleId || 'TBD'}`} />
      ),
    },
    {
      key: "mandate",
      label: "Mandate",
      render: (value: any, row: any) => <TypeBadge type={row.mandate || 'TBD'} />,
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
          <h1 className="text-2xl font-bold text-gray-900">Personnel</h1>
          <p className="text-gray-600">Manage staff and personnel assignments</p>
        </div>
        <Button 
          onClick={() => setShowAddPersonnel(true)}
          data-testid="button-add-personnel"
        >
          <i className="fas fa-plus mr-2"></i>
          Add Personnel
        </Button>
      </div>

      <DataTable
        title="All Personnel"
        columns={columns}
        data={personnel}
      />

      <AddPersonnelModal 
        isOpen={showAddPersonnel} 
        onClose={() => setShowAddPersonnel(false)} 
      />
    </div>
  );
}
