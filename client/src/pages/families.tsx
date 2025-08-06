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
  Home,
  Shield,
  Heart,
  User
} from "lucide-react";
import { useState } from "react";
import AddFamilyModal from "@/components/modals/add-family-modal";
import { format } from "date-fns";

interface FamilyMember {
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
  locationId: number;
}

export default function Families() {
  const [showAddFamily, setShowAddFamily] = useState(false);

  const { data: families = [], isLoading } = useQuery<FamilyMember[]>({
    queryKey: ["/api/families"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Home className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Family Members</h1>
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
          <Home className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Family Members</h1>
        </div>
        <Button 
          onClick={() => setShowAddFamily(true)}
          data-testid="button-add-family"
          className="flex items-center space-x-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Family Member</span>
        </Button>
      </div>

      {/* Statistics Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Home className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{families.length}</p>
              <p className="text-xs text-muted-foreground">Family Members (Emergency Contacts & Guardians)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Family Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Home className="h-5 w-5" />
            <span>Family Members & Emergency Contacts</span>
            <Badge variant="secondary" className="ml-2">
              {families.length} total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {families.length === 0 ? (
            <div className="text-center py-12">
              <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No family members registered
              </h3>
              <p className="text-muted-foreground mb-4">
                Add family members to serve as emergency contacts and guardians for minor club members.
              </p>
              <Button onClick={() => setShowAddFamily(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Family Member
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Family Member</TableHead>
                    <TableHead>Contact Information</TableHead>
                    <TableHead>Personal Details</TableHead>
                    <TableHead>Address & Location</TableHead>
                    <TableHead>Registration Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {families.map((family) => (
                    <TableRow key={family.id} data-testid={`family-row-${family.id}`}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {family.firstName} {family.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ID: #{family.id}
                            </div>
                            <Badge variant="outline" className="mt-1 text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Guardian/Emergency Contact
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1 text-sm">
                            <Mail className="h-3 w-3" />
                            <span>{family.email}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm">
                            <Phone className="h-3 w-3" />
                            <span>{family.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(family.dob), "MMM dd, yyyy")}</span>
                          </div>
                          <div className="text-muted-foreground text-xs">
                            Age: {new Date().getFullYear() - new Date(family.dob).getFullYear()}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            SSN: {family.ssn.slice(-4).padStart(family.ssn.length, '*')}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            Medicare: {family.medicareCard.slice(-4).padStart(family.medicareCard.length, '*')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start space-x-1 text-sm">
                          <MapPin className="h-3 w-3 mt-1" />
                          <div>
                            <div className="font-medium">{family.address}</div>
                            <div className="text-muted-foreground">
                              {family.city}, {family.province}
                            </div>
                            <div className="text-muted-foreground">
                              {family.postalCode}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <Badge variant="secondary" className="text-xs">
                            <Home className="h-3 w-3 mr-1" />
                            Location ID: {family.locationId}
                          </Badge>
                          <div className="text-muted-foreground text-xs">
                            Registered as family member
                          </div>
                          <div className="text-muted-foreground text-xs">
                            Available for emergency contact
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

      {/* Family Member Information Card */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Family Member Role</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>• Serve as emergency contacts for minor club members</div>
                  <div>• Act as guardians and responsible parties</div>
                  <div>• Must be registered before minor member enrollment</div>
                  <div>• Provide consent for minor member activities</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="bg-secondary/10 p-2 rounded-full">
                <Heart className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Relationship Types</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>• Father, Mother (Primary guardians)</div>
                  <div>• Grandfather, Grandmother (Extended family)</div>
                  <div>• Tutor, Partner (Legal guardians)</div>
                  <div>• Friend, Other (Emergency contacts)</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Rules Card */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Family Member Business Rules</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Family members must be registered before enrolling minor club members</div>
                <div>• Each family member must have unique SSN and Medicare card numbers</div>
                <div>• Family members are linked to specific club locations</div>
                <div>• Can have multiple secondary family members with defined relationships</div>
                <div>• Serve as emergency contacts and provide consent for minor activities</div>
                <div>• Must maintain current contact information for emergency situations</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showAddFamily && (
        <AddFamilyModal
          isOpen={showAddFamily}
          onClose={() => setShowAddFamily(false)}
        />
      )}
    </div>
  );
}