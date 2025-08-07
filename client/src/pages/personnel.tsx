import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Shield, 
  User,
  Building,
  Crown
} from "lucide-react";
import { useState } from "react";
import AddPersonnelModal from "@/components/modals/add-personnel-modal";
import { format } from "date-fns";

interface Personnel {
  id: number;
  firstName: string;
  lastName: string;
  dob: string;
  ssn: string;
  medicareCard: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  email: string;
  roleId: number;
  mandate: string;
}

const getRoleIcon = (roleId: number) => {
  switch (roleId) {
    case 1: return <Crown className="h-4 w-4" />; // General Manager/President
    case 2: return <Shield className="h-4 w-4" />; // Deputy
    case 3: return <Briefcase className="h-4 w-4" />; // Treasurer/Secretary
    case 4: return <Users className="h-4 w-4" />; // Coach
    default: return <User className="h-4 w-4" />; // Other
  }
};

const getRoleName = (roleId: number) => {
  const roleNames = {
    1: "General Manager",
    2: "Deputy Manager", 
    3: "Treasurer",
    4: "Secretary",
    5: "Administrator",
    6: "Captain",
    7: "Coach",
    8: "Assistant Coach",
    9: "Other"
  };
  return roleNames[roleId as keyof typeof roleNames] || "Unknown Role";
};

export default function Personnel() {
  const [showAddPersonnel, setShowAddPersonnel] = useState(false);

  const { data: personnel = [], isLoading } = useQuery<Personnel[]>({
    queryKey: ["/api/personnel"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Personnel</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const headLocationPersonnel = personnel.filter(p => p.roleId >= 1 && p.roleId <= 5);
  const otherPersonnel = personnel.filter(p => p.roleId > 5 || !p.roleId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Personnel Management</h1>
        </div>
        <Button 
          onClick={() => setShowAddPersonnel(true)}
          data-testid="button-add-personnel"
          className="flex items-center space-x-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Personnel</span>
        </Button>
      </div>

      {/* Head Office Leadership */}
      {headLocationPersonnel.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Head Office Leadership</span>
              <Badge variant="outline" className="ml-2">
                Montreal Volleyball Club
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {headLocationPersonnel.map((person) => (
                <Card key={person.id} className="border-l-4 border-l-primary" data-testid={`personnel-card-${person.id}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 p-3 rounded-full">
                          {getRoleIcon(person.roleId)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {person.firstName} {person.lastName}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {getRoleName(person.roleId)}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant={person.mandate === "Salaried" ? "default" : "outline"}>
                        {person.mandate}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{person.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{person.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{person.city}, {person.province}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Born: {format(new Date(person.dob), "MMM dd, yyyy")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Personnel Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>All Personnel</span>
            <Badge variant="secondary" className="ml-2">
              {personnel.length} total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {personnel.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No personnel registered
              </h3>
              <p className="text-muted-foreground mb-4">
                Add your first staff member to get started.
              </p>
              <Button onClick={() => setShowAddPersonnel(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Personnel
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Personnel</TableHead>
                    <TableHead>Role & Mandate</TableHead>
                    <TableHead>Contact Information</TableHead>
                    <TableHead>Personal Details</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {personnel.map((person) => (
                    <TableRow key={person.id} data-testid={`personnel-row-${person.id}`}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            {getRoleIcon(person.roleId)}
                          </div>
                          <div>
                            <div className="font-medium">
                              {person.firstName} {person.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ID: #{person.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline">
                            {getRoleName(person.roleId)}
                          </Badge>
                          <div>
                            <Badge variant={person.mandate === "Salaried" ? "default" : "secondary"}>
                              {person.mandate}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1 text-sm">
                            <Mail className="h-3 w-3" />
                            <span>{person.email}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm">
                            <Phone className="h-3 w-3" />
                            <span>{person.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(person.dob), "MMM dd, yyyy")}</span>
                          </div>
                          <div className="text-muted-foreground text-xs">
                            SSN: {person.ssn.slice(-4).padStart(person.ssn.length, '*')}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            Medicare: {person.medicareCard.slice(-4).padStart(person.medicareCard.length, '*')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          <div>
                            <div>{person.address}</div>
                            <div className="text-muted-foreground">
                              {person.city}, {person.province} {person.postalCode}
                            </div>
                          </div>
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

      {showAddPersonnel && (
        <AddPersonnelModal
          isOpen={showAddPersonnel}
          onClose={() => setShowAddPersonnel(false)}
        />
      )}
    </div>
  );
}