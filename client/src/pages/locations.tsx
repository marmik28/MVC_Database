import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import DataTable, { TypeBadge } from "@/components/data-table";
import { useState } from "react";
import AddLocationModal from "@/components/modals/add-location-modal";

export default function Locations() {
  const [showAddLocation, setShowAddLocation] = useState(false);

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["/api/locations"],
  });

  const columns = [
    {
      key: "name",
      label: "Location Name",
      render: (value: any, row: any) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.address}</div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (value: any, row: any) => <TypeBadge type={row.type} />,
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
    {
      key: "contact",
      label: "Contact",
      render: (value: any, row: any) => (
        <div className="text-sm">
          <div>{row.phone}</div>
          <div className="text-blue-600">{row.webAddress}</div>
        </div>
      ),
    },
    {
      key: "capacity",
      label: "Capacity",
      render: (value: any, row: any) => (
        <div className="text-sm">
          {row.capacity ? `${row.capacity} members` : "Not specified"}
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
          <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
          <p className="text-gray-600">Manage club locations and facilities</p>
        </div>
        <Button 
          onClick={() => setShowAddLocation(true)}
          data-testid="button-add-location"
        >
          <i className="fas fa-plus mr-2"></i>
          Add Location
        </Button>
      </div>

      <DataTable
        title="All Locations"
        columns={columns}
        data={locations}
      />

      <AddLocationModal 
        isOpen={showAddLocation} 
        onClose={() => setShowAddLocation(false)} 
      />
    </div>
  );
}
