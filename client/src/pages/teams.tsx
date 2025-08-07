import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  UserPlus, 
  MapPin, 
  Calendar, 
  User,
  Edit,
  Trash2,
  Plus,
  Target,
  Shield,
  Zap,
  Activity
} from "lucide-react";
import { useState } from "react";
import AddTeamModal from "@/components/modals/add-team-modal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface TeamMember {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
}

interface Team {
  id: number;
  teamName: string;
  headCoachId: number;
  headCoachName: string;
  locationId: number;
  locationName: string;
  startDate: string;
  endDate: string;
  gender: string;
  members: TeamMember[];
}

interface Member {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  status: string;
}

const getRoleIcon = (role: string) => {
  switch (role?.toLowerCase()) {
    case 'setter': return <Target className="w-4 h-4" />;
    case 'outside_hitter': return <Zap className="w-4 h-4" />;
    case 'opposite_hitter': return <Activity className="w-4 h-4" />;
    case 'middle_blocker': return <Shield className="w-4 h-4" />;
    case 'defensive_specialist': return <User className="w-4 h-4" />;
    case 'libero': return <Users className="w-4 h-4" />;
    default: return <User className="w-4 h-4" />;
  }
};

const getRoleColor = (role: string) => {
  switch (role?.toLowerCase()) {
    case 'setter': return 'bg-blue-100 text-blue-800';
    case 'outside_hitter': return 'bg-green-100 text-green-800';
    case 'opposite_hitter': return 'bg-purple-100 text-purple-800';
    case 'middle_blocker': return 'bg-orange-100 text-orange-800';
    case 'defensive_specialist': return 'bg-yellow-100 text-yellow-800';
    case 'libero': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function Teams() {
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showAssignMember, setShowAssignMember] = useState(false);
  const [showRemoveMember, setShowRemoveMember] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [sessionDate, setSessionDate] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teams = [], isLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const { data: members = [] } = useQuery<Member[]>({
    queryKey: ["/api/members/active"],
  });

  const assignMemberMutation = useMutation({
    mutationFn: async ({ teamId, memberId, role, sessionDate }: { teamId: number; memberId: number; role: string; sessionDate: string }) => {
      const response = await apiRequest("POST", `/api/teams/${teamId}/members`, { 
        memberId, 
        role, 
        sessionDate,
        startTime: '09:00' // Default start time for validation
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      toast({ title: "Success", description: "Team member assigned successfully" });
      setShowAssignMember(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to assign team member. This member may have a conflicting assignment on the same day.",
        variant: "destructive"
      });
    }
  });

  const removeMemberMutation = useMutation({
    mutationFn: async ({ teamId, memberId }: { teamId: number; memberId: number }) => {
      const response = await apiRequest("DELETE", `/api/teams/${teamId}/members/${memberId}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      toast({ title: "Success", description: "Team member removed successfully" });
      setShowRemoveMember(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to remove team member",
        variant: "destructive"
      });
    }
  });

  const handleAssignMember = (team: Team) => {
    setSelectedTeam(team);
    setShowAssignMember(true);
  };

  const handleRemoveMember = (team: Team, member: TeamMember) => {
    setSelectedTeam(team);
    setSelectedMember(member);
    setShowRemoveMember(true);
  };

  const resetForm = () => {
    setSelectedTeam(null);
    setSelectedMember(null);
    setSelectedMemberId(null);
    setSelectedRole('');
    setSessionDate('');
  };

  const onAssignSubmit = () => {
    if (!selectedTeam || !selectedMemberId || !selectedRole || !sessionDate) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    assignMemberMutation.mutate({
      teamId: selectedTeam.id,
      memberId: selectedMemberId,
      role: selectedRole,
      sessionDate
    });
  };

  const onRemoveSubmit = () => {
    if (!selectedTeam || !selectedMember) return;
    
    removeMemberMutation.mutate({
      teamId: selectedTeam.id,
      memberId: selectedMember.id
    });
  };

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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Formations</h1>
          <p className="text-gray-600">Manage team formations and member assignments</p>
        </div>
        <Button 
          onClick={() => setShowAddTeam(true)}
          data-testid="button-add-team"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team.id} className="">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{team.teamName}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={team.gender === 'Male' ? 'default' : 'secondary'}>
                      {team.gender}
                    </Badge>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleAssignMember(team)}
                  data-testid={`button-assign-member-${team.id}`}
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Team Details */}
              <div className="space-y-2 text-sm">
                {team.headCoachName && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>Coach: {team.headCoachName}</span>
                  </div>
                )}
                
                {team.locationName && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{team.locationName}</span>
                  </div>
                )}
                
                {team.startDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>
                      {format(new Date(team.startDate), 'MMM d, yyyy')}
                      {team.endDate && ` - ${format(new Date(team.endDate), 'MMM d, yyyy')}`}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Team Members */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Team Members</h4>
                  <Badge variant="outline">{team.members?.length || 0}</Badge>
                </div>
                
                {team.members && team.members.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {team.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(member.role)}
                          <div>
                            <div className="text-sm font-medium">
                              {member.firstName} {member.lastName}
                            </div>
                            <Badge 
                              className={`${getRoleColor(member.role)} text-xs`}
                            >
                              {member.role?.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveMember(team, member)}
                          data-testid={`button-remove-member-${team.id}-${member.id}`}
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No members assigned
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Team Modal */}
      <AddTeamModal 
        isOpen={showAddTeam} 
        onClose={() => setShowAddTeam(false)} 
      />

      {/* Assign Member Modal */}
      <Dialog open={showAssignMember} onOpenChange={setShowAssignMember}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Member to {selectedTeam?.teamName}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="member-select">Select Member</Label>
              <Select onValueChange={(value) => setSelectedMemberId(parseInt(value))}>
                <SelectTrigger data-testid="select-member">
                  <SelectValue placeholder="Choose a member" />
                </SelectTrigger>
                <SelectContent>
                  {members
                    .filter(member => member.gender === selectedTeam?.gender && member.status === 'Active')
                    .map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.firstName} {member.lastName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="role-select">Select Role</Label>
              <Select onValueChange={setSelectedRole}>
                <SelectTrigger data-testid="select-role">
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Setter">Setter</SelectItem>
                  <SelectItem value="Outside_Hitter">Outside Hitter</SelectItem>
                  <SelectItem value="Opposite_Hitter">Opposite Hitter</SelectItem>
                  <SelectItem value="Middle_Blocker">Middle Blocker</SelectItem>
                  <SelectItem value="Defensive_Specialist">Defensive Specialist</SelectItem>
                  <SelectItem value="Libero">Libero</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="session-date">Session Date (for conflict checking)</Label>
              <Input
                id="session-date"
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                data-testid="input-session-date"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAssignMember(false);
                resetForm();
              }}
              data-testid="button-cancel-assign"
            >
              Cancel
            </Button>
            <Button 
              onClick={onAssignSubmit}
              disabled={assignMemberMutation.isPending}
              data-testid="button-confirm-assign"
            >
              {assignMemberMutation.isPending ? "Assigning..." : "Assign Member"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation */}
      <AlertDialog open={showRemoveMember} onOpenChange={setShowRemoveMember}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedMember?.firstName} {selectedMember?.lastName} from {selectedTeam?.teamName}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setShowRemoveMember(false);
                resetForm();
              }}
              data-testid="button-cancel-remove"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onRemoveSubmit}
              disabled={removeMemberMutation.isPending}
              data-testid="button-confirm-remove"
            >
              {removeMemberMutation.isPending ? "Removing..." : "Remove Member"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
