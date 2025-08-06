import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/data-table";
import { useState } from "react";
import AddFamilyModal from "@/components/modals/add-family-modal";

export default function Families() {
  const [showAddFamily, setShowAddFamily] = useState(false);

  const { data: families = [], isLoading } = useQuery({
    queryKey: ["/api/families"],
  });

  const columns = [
    {
      key: "family",
      label: "Family Member",
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
      key: "location",
      label: "Location",
      render: (value: any, row: any) => (
        <div className="text-sm">
          <div>{row.city}, {row.province}</div>
          <div className="text-gray-500">{row.postalCode}</div>
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
          <h1 className="text-2xl font-bold text-gray-900">Family Members</h1>
          <p className="text-gray-600">Manage family members and guardians</p>
        </div>
        <Button 
          onClick={() => setShowAddFamily(true)}
          data-testid="button-add-family"
        >
          <i className="fas fa-plus mr-2"></i>
          Add Family Member
        </Button>
      </div>

      <DataTable
        title="All Family Members"
        columns={columns}
        data={families}
      />

      <AddFamilyModal 
        isOpen={showAddFamily} 
        onClose={() => setShowAddFamily(false)} 
      />
    </div>
  );
}
