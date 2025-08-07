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
  User,
  Baby,
  Activity,
  Heart,
  Scale,
  Ruler,
  CheckCircle,
  XCircle,
  Plus,
  X,
  Edit,
  Trash2,
  Gamepad2
} from "lucide-react";
import { useState } from "react";
import AddMemberModal from "@/components/modals/add-member-modal";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface Hobby {
  id: number;
  name: string;
}

interface ClubMember {
  id: number;
  firstName: string;
  lastName: string;
  dob: string;
  height: number;
  weight: number;
  ssn: string;
  medicareCard: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  email: string;
  gender: string;
  status: string;
  joinDate: string;
  locationId: number;
  locationName?: string;
  hobbies?: Hobby[];
}

const getAgeCategory = (dob: string) => {
  const birthDate = new Date(dob);
  const age = new Date().getFullYear() - birthDate.getFullYear();
  return age >= 18 ? "Major" : "Minor";
};

const getAgeIcon = (dob: string) => {
  const category = getAgeCategory(dob);
  return category === "Major" ? <User className="h-4 w-4" /> : <Baby className="h-4 w-4" />;
};

export default function Members() {
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMemberForHobby, setSelectedMemberForHobby] = useState<number | null>(null);
  const [editingMember, setEditingMember] = useState<ClubMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<ClubMember | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery<ClubMember[]>({
    queryKey: ["/api/members"],
  });

  const { data: allHobbies = [] } = useQuery<Hobby[]>({
    queryKey: ["/api/hobbies"],
  });

  const addHobbyMutation = useMutation({
    mutationFn: async ({ memberId, hobbyId }: { memberId: number; hobbyId: number }) => {
      return await apiRequest("POST", `/api/members/${memberId}/hobbies`, { hobbyId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      toast({ title: "Success", description: "Hobby added successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add hobby", variant: "destructive" });
    },
  });

  const removeHobbyMutation = useMutation({
    mutationFn: async ({ memberId, hobbyId }: { memberId: number; hobbyId: number }) => {
      return await apiRequest("DELETE", `/api/members/${memberId}/hobbies/${hobbyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      toast({ title: "Success", description: "Hobby removed successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to remove hobby", variant: "destructive" });
    },
  });

  const handleAddHobby = (memberId: number, hobbyId: number) => {
    addHobbyMutation.mutate({ memberId, hobbyId });
    setSelectedMemberForHobby(null);
  };

  const handleRemoveHobby = (memberId: number, hobbyId: number) => {
    removeHobbyMutation.mutate({ memberId, hobbyId });
  };

  const deleteMemberMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Success", description: "Member deleted successfully" });
      setDeletingMember(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete member", variant: "destructive" });
    },
  });

  const handleEdit = (member: ClubMember) => {
    setEditingMember(member);
  };

  const handleDelete = (member: ClubMember) => {
    setDeletingMember(member);
  };

  const confirmDelete = () => {
    if (deletingMember) {
      deleteMemberMutation.mutate(deletingMember.id);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Club Members</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const activeMembers = members.filter(m => m.status === "Active");
  const inactiveMembers = members.filter(m => m.status === "Inactive");
  const majorMembers = members.filter(m => getAgeCategory(m.dob) === "Major");
  const minorMembers = members.filter(m => getAgeCategory(m.dob) === "Minor");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Club Members</h1>
        </div>
        <Button 
          onClick={() => setShowAddMember(true)}
          data-testid="button-add-member"
          className="flex items-center space-x-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Member</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{members.length}</p>
                <p className="text-xs text-muted-foreground">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="bg-success/10 p-2 rounded-full">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeMembers.length}</p>
                <p className="text-xs text-muted-foreground">Active Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{majorMembers.length}</p>
                <p className="text-xs text-muted-foreground">Major Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="bg-secondary/10 p-2 rounded-full">
                <Baby className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{minorMembers.length}</p>
                <p className="text-xs text-muted-foreground">Minor Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>All Club Members</span>
            <Badge variant="secondary" className="ml-2">
              {members.length} total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No members registered
              </h3>
              <p className="text-muted-foreground mb-4">
                Add your first club member to get started.
              </p>
              <Button onClick={() => setShowAddMember(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Category & Status</TableHead>
                    <TableHead>Contact Information</TableHead>
                    <TableHead>Physical Details</TableHead>
                    <TableHead>Hobbies & Interests</TableHead>
                    <TableHead>Personal Information</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id} data-testid={`member-row-${member.id}`}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            {getAgeIcon(member.dob)}
                          </div>
                          <div>
                            <div className="font-medium">
                              {member.firstName} {member.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ID: #{member.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={getAgeCategory(member.dob) === "Major" ? "default" : "secondary"}>
                            {getAgeCategory(member.dob)}
                          </Badge>
                          <div>
                            <Badge variant={member.status === "Active" ? "default" : "destructive"}>
                              {member.status === "Active" ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {member.status}
                            </Badge>
                          </div>
                          <div>
                            <Badge variant="outline" className="text-xs">
                              {member.gender}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1 text-sm">
                            <Mail className="h-3 w-3" />
                            <span>{member.email}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm">
                            <Phone className="h-3 w-3" />
                            <span>{member.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center space-x-1">
                            <Ruler className="h-3 w-3" />
                            <span>{member.height}cm</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Scale className="h-3 w-3" />
                            <span>{member.weight}kg</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Activity className="h-3 w-3" />
                            <span>BMI: {(member.weight / Math.pow(member.height/100, 2)).toFixed(1)}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {member.hobbies?.map((hobby) => (
                              <Badge
                                key={hobby.id}
                                variant="outline"
                                className="text-xs flex items-center space-x-1"
                                data-testid={`hobby-badge-${hobby.id}`}
                              >
                                <Gamepad2 className="h-3 w-3" />
                                <span>{hobby.name}</span>
                                <button
                                  onClick={() => handleRemoveHobby(member.id, hobby.id)}
                                  className="ml-1 hover:text-red-500"
                                  data-testid={`remove-hobby-${hobby.id}`}
                                >
                                  <X className="h-2 w-2" />
                                </button>
                              </Badge>
                            )) || []}
                          </div>
                          {selectedMemberForHobby === member.id ? (
                            <div className="flex items-center space-x-2">
                              <Select onValueChange={(value) => handleAddHobby(member.id, parseInt(value))}>
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Add hobby" />
                                </SelectTrigger>
                                <SelectContent>
                                  {allHobbies
                                    .filter(hobby => !member.hobbies?.some(h => h.id === hobby.id))
                                    .map((hobby) => (
                                      <SelectItem key={hobby.id} value={hobby.id.toString()}>
                                        {hobby.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedMemberForHobby(null)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedMemberForHobby(member.id)}
                              data-testid={`add-hobby-${member.id}`}
                              className="text-xs"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Hobby
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(member.dob), "MMM dd, yyyy")}</span>
                          </div>
                          <div className="text-muted-foreground text-xs">
                            Age: {new Date().getFullYear() - new Date(member.dob).getFullYear()}
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{member.locationName || `Location ${member.locationId}`}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Heart className="h-3 w-3" />
                            <span>Joined: {format(new Date(member.joinDate), "MMM yyyy")}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(member)}
                            data-testid={`edit-member-${member.id}`}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(member)}
                            data-testid={`delete-member-${member.id}`}
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
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Club Member Business Rules</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Major Members: 18+ years old with full club privileges</div>
                <div>• Minor Members: Under 18, require family member registration for emergency contacts</div>
                <div>• All members must have unique SSN and Medicare card numbers</div>
                <div>• Teams are segregated by gender (Male/Female teams only)</div>
                <div>• Physical measurements (height/weight) are tracked for team formation and health monitoring</div>
                <div>• Active status required for team participation and session attendance</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Member Modal */}
      {showAddMember && (
        <AddMemberModal
          isOpen={showAddMember}
          onClose={() => setShowAddMember(false)}
        />
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <AddMemberModal
          isOpen={!!editingMember}
          onClose={() => setEditingMember(null)}
          editMember={editingMember ? {
            ...editingMember,
            gender: editingMember.gender as "Male" | "Female",
            status: editingMember.status as "Active" | "Inactive"
          } : null}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingMember} onOpenChange={() => setDeletingMember(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-red-500" />
              <span>Delete Member</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingMember?.firstName} {deletingMember?.lastName}"? This action cannot be undone and will remove all associated data including team assignments, payments, and hobby associations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}