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
  User,
  Edit,
  Trash2,
  UserCheck
} from "lucide-react";
import { useState } from "react";
import AddFamilyModal from "@/components/modals/add-family-modal";
import { format } from "date-fns";

interface FamilyMember {
  id: number;
  firstName: string;
  lastName: string;
  dob?: string;
  ssn?: string;
  medicareCard?: string;
  phone: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  email?: string;
  locationId?: number;
  locationName?: string;
  type: 'primary' | 'secondary';
  relationship?: string;
  primaryFamilyId?: number;
  primaryFamilyName?: string;
  children?: Array<{
    memberId: number;
    relationship: string;
    memberName: string;
  }>;
}

const getRelationshipIcon = (relationship?: string) => {
  if (!relationship) return <User className="h-4 w-4" />;
  
  switch (relationship.toLowerCase()) {
    case 'father':
    case 'mother':
      return <Heart className="h-4 w-4 text-red-500" />;
    case 'grandfather':
    case 'grandmother':
      return <Users className="h-4 w-4 text-blue-500" />;
    case 'tutor':
    case 'partner':
      return <Shield className="h-4 w-4 text-green-500" />;
    default:
      return <User className="h-4 w-4 text-gray-500" />;
  }
};

const getRelationshipColor = (relationship?: string) => {
  if (!relationship) return "default";
  
  switch (relationship.toLowerCase()) {
    case 'father':
    case 'mother':
      return "destructive";
    case 'grandfather':
    case 'grandmother':
      return "default";
    case 'tutor':
    case 'partner':
      return "secondary";
    default:
      return "outline";
  }
};

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

  // Only show family members who have relationships with children
  const familiesWithChildren = families.filter(f => f.children && f.children.length > 0);
  const primaryFamilies = familiesWithChildren.filter(f => f.type === 'primary');
  const secondaryFamilies = familiesWithChildren.filter(f => f.type === 'secondary');

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

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Home className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{familiesWithChildren.length}</p>
                <p className="text-xs text-muted-foreground">Guardians with Children</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{primaryFamilies.length}</p>
                <p className="text-xs text-muted-foreground">Primary Guardians</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="bg-green-100 p-2 rounded-full">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{secondaryFamilies.length}</p>
                <p className="text-xs text-muted-foreground">Secondary Contacts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Primary Family Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Primary Family Members & Guardians</span>
            <Badge variant="secondary" className="ml-2">
              {primaryFamilies.length} members
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {primaryFamilies.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No primary family members registered
              </h3>
              <p className="text-muted-foreground mb-4">
                Add primary family members to serve as main guardians for minor club members.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guardian Information</TableHead>
                    <TableHead>Contact Details</TableHead>
                    <TableHead>Address & Location</TableHead>
                    <TableHead>Children/Members</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {primaryFamilies.map((family) => (
                    <TableRow key={family.id} data-testid={`primary-family-row-${family.id}`}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {family.firstName} {family.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ID: #{family.id}
                            </div>
                            <Badge variant="default" className="mt-1 text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Primary Guardian
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1 text-sm">
                            <Mail className="h-3 w-3" />
                            <span>{family.email || 'No email'}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm">
                            <Phone className="h-3 w-3" />
                            <span>{family.phone}</span>
                          </div>
                          {family.dob && (
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{format(new Date(family.dob), "MMM dd, yyyy")}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start space-x-1 text-sm">
                          <MapPin className="h-3 w-3 mt-1" />
                          <div>
                            <div className="font-medium">{family.address || 'No address'}</div>
                            <div className="text-muted-foreground">
                              {family.city}, {family.province}
                            </div>
                            <div className="text-muted-foreground">
                              {family.postalCode}
                            </div>
                            <Badge variant="outline" className="text-xs mt-1">
                              {family.locationName || `Location ${family.locationId}`}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {family.children && family.children.length > 0 ? (
                            family.children.map((child, idx) => (
                              <div key={idx} className="flex items-center space-x-2 text-sm">
                                <UserCheck className="h-3 w-3 text-green-500" />
                                <span className="font-medium">{child.memberName}</span>
                                <Badge variant="outline" className="text-xs">
                                  {child.relationship}
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground">No children assigned</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" data-testid={`edit-family-${family.id}`}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`delete-family-${family.id}`}>
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

      {/* Secondary Family Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Secondary Family Members & Emergency Contacts</span>
            <Badge variant="secondary" className="ml-2">
              {secondaryFamilies.length} members
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {secondaryFamilies.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No secondary family members registered
              </h3>
              <p className="text-muted-foreground mb-4">
                Add secondary contacts for additional emergency support.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact Information</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>Primary Guardian</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {secondaryFamilies.map((family) => (
                    <TableRow key={family.id} data-testid={`secondary-family-row-${family.id}`}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            {getRelationshipIcon(family.relationship)}
                          </div>
                          <div>
                            <div className="font-medium">
                              {family.firstName} {family.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ID: #{family.id}
                            </div>
                            <div className="flex items-center space-x-1 text-sm mt-1">
                              <Phone className="h-3 w-3" />
                              <span>{family.phone}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRelationshipColor(family.relationship)} className="text-xs">
                          {getRelationshipIcon(family.relationship)}
                          <span className="ml-1">{family.relationship || 'Unknown'}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{family.primaryFamilyName || 'Unassigned'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" data-testid={`edit-secondary-${family.id}`}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`delete-secondary-${family.id}`}>
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

      {/* Information Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Family Member Types</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>• <strong>Primary:</strong> Main guardians with full details</div>
                  <div>• <strong>Secondary:</strong> Emergency contacts and additional family</div>
                  <div>• Linked to specific club members as children</div>
                  <div>• Required for minor member enrollment</div>
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
                  <div>• <Heart className="h-3 w-3 inline text-red-500" /> Father, Mother (Primary)</div>
                  <div>• <Users className="h-3 w-3 inline text-blue-500" /> Grandfather, Grandmother</div>
                  <div>• <Shield className="h-3 w-3 inline text-green-500" /> Tutor, Partner (Legal)</div>
                  <div>• <User className="h-3 w-3 inline text-gray-500" /> Friend, Other (Emergency)</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showAddFamily && (
        <AddFamilyModal
          isOpen={showAddFamily}
          onClose={() => setShowAddFamily(false)}
        />
      )}
    </div>
  );
}