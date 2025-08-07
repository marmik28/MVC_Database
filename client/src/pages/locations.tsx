import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  MapPin, 
  Plus, 
  Phone, 
  Globe, 
  Users, 
  Building, 
  Edit,
  Trash2,
  AlertCircle
} from "lucide-react";
import { useState } from "react";
import AddLocationModal from "@/components/modals/add-location-modal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Location {
  id: number;
  type: "Head" | "Branch";
  name: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  webAddress: string;
  capacity: number;
}

export default function Locations() {
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [deletingLocation, setDeletingLocation] = useState<Location | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: locations = [], isLoading } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });


  const deleteLocationMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/locations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      toast({ title: "Success", description: "Location deleted successfully" });
      setDeletingLocation(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete location", variant: "destructive" });
    },
  });

  const handleDelete = (location: Location) => {
    setDeletingLocation(location);
  };

  const confirmDelete = () => {
    if (deletingLocation) {
      deleteLocationMutation.mutate(deletingLocation.id);
    }
  };

  const headLocations = locations.filter(l => l.type === "Head");
  const branchLocations = locations.filter(l => l.type === "Branch");

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <MapPin className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Locations</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Locations</h1>
        </div>
        <Button 
          onClick={() => setShowAddLocation(true)}
          data-testid="button-add-location"
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Location</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{locations.length}</p>
                <p className="text-xs text-muted-foreground">Total Locations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <Building className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{headLocations.length}</p>
                <p className="text-xs text-muted-foreground">Head Offices</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="bg-green-100 p-2 rounded-full">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{branchLocations.length}</p>
                <p className="text-xs text-muted-foreground">Branch Offices</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Locations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>All Club Locations</span>
            <Badge variant="secondary" className="ml-2">
              {locations.length} locations
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {locations.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No locations registered
              </h3>
              <p className="text-muted-foreground mb-4">
                Add your first club location to get started.
              </p>
              <Button onClick={() => setShowAddLocation(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location Details</TableHead>
                    <TableHead>Address & Contact</TableHead>
                    <TableHead>Type & Capacity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locations.map((location) => (
                    <TableRow key={location.id} data-testid={`location-row-${location.id}`}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            {location.type === "Head" ? (
                              <Building className="h-4 w-4 text-primary" />
                            ) : (
                              <MapPin className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">
                              {location.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ID: #{location.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{location.address}</span>
                          </div>
                          <div className="text-muted-foreground">
                            {location.city}, {location.province} {location.postalCode}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{location.phone}</span>
                          </div>
                          {location.webAddress && (
                            <div className="flex items-center space-x-1">
                              <Globe className="h-3 w-3" />
                              <span className="text-blue-600">{location.webAddress}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Badge 
                            variant={location.type === "Head" ? "default" : "secondary"}
                            className="flex items-center space-x-1 w-fit"
                          >
                            {location.type === "Head" ? (
                              <Building className="h-3 w-3" />
                            ) : (
                              <MapPin className="h-3 w-3" />
                            )}
                            <span>{location.type} Office</span>
                          </Badge>
                          <div className="flex items-center space-x-1 text-sm">
                            <Users className="h-3 w-3" />
                            <span>{location.capacity || "No limit"} capacity</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            disabled
                            data-testid={`edit-location-${location.id}`}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(location)}
                            data-testid={`delete-location-${location.id}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Rules Card */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Location Business Rules</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Head location must have: General Manager (President), Deputy, Treasurer, Secretary, Administrators</div>
                <div>• General Manager of head location serves as Club President</div>
                <div>• Personnel can operate at only one location at a time</div>
                <div>• Capacity tracking helps manage member assignments and facility planning</div>
                <div>• Each location can host multiple teams and training sessions</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Location Modal */}
      {showAddLocation && (
        <AddLocationModal
          isOpen={showAddLocation}
          onClose={() => setShowAddLocation(false)}
        />
      )}


      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingLocation} onOpenChange={() => setDeletingLocation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>Delete Location</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingLocation?.name}"? This action cannot be undone and will affect all associated members, personnel, and teams.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Location
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}