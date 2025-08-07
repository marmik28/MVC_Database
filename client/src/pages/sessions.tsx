import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Calendar,
  Clock, 
  MapPin, 
  Users, 
  Trophy,
  Target,
  Zap,
  Shield,
  User
} from "lucide-react";
import { useState } from "react";
import AddSessionModal from "@/components/modals/add-session-modal";
import { format } from "date-fns";

interface Session {
  id: number;
  sessionType: "Training" | "Game";
  sessionDate: string;
  startTime: string;
  endTime?: string;
  address?: string;
  team1Id: number;
  team2Id: number;
  scoreTeam1?: number;
  scoreTeam2?: number;
  locationId: number;
  locationName?: string;
  team1Name?: string;
  team2Name?: string;
}

interface TeamMember {
  id: number;
  firstName: string;
  lastName: string;
  playerRole: string;
  teamId: number;
}

interface TeamFormation {
  teamId: number;
  teamName: string;
  members: TeamMember[];
}

const getRoleIcon = (role: string) => {
  switch (role?.toLowerCase()) {
    case 'setter':
      return <Target className="h-4 w-4" />;
    case 'outside_hitter':
      return <Zap className="h-4 w-4" />;
    case 'opposite_hitter':
      return <Trophy className="h-4 w-4" />;
    case 'middle_blocker':
      return <Shield className="h-4 w-4" />;
    case 'defensive_specialist':
      return <Users className="h-4 w-4" />;
    case 'libero':
      return <User className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

const getRoleBadgeColor = (role: string) => {
  switch (role?.toLowerCase()) {
    case 'setter':
      return "default";
    case 'outside_hitter':
      return "destructive";
    case 'opposite_hitter':
      return "secondary";
    case 'middle_blocker':
      return "outline";
    case 'defensive_specialist':
      return "default";
    case 'libero':
      return "destructive";
    default:
      return "outline";
  }
};

export default function Sessions() {
  const [showAddSession, setShowAddSession] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [teamFormations, setTeamFormations] = useState<TeamFormation[]>([]);

  const { data: sessions = [], isLoading } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
  });

  const handleSessionClick = async (session: Session) => {
    setSelectedSession(session);
    
    // Fetch team formations for both teams
    try {
      const [team1Response, team2Response] = await Promise.all([
        fetch(`/api/teams/${session.team1Id}/members`),
        fetch(`/api/teams/${session.team2Id}/members`)
      ]);

      const [team1Members, team2Members] = await Promise.all([
        team1Response.json(),
        team2Response.json()
      ]);

      setTeamFormations([
        {
          teamId: session.team1Id,
          teamName: session.team1Name || `Team ${session.team1Id}`,
          members: team1Members || []
        },
        {
          teamId: session.team2Id,
          teamName: session.team2Name || `Team ${session.team2Id}`,
          members: team2Members || []
        }
      ]);
    } catch (error) {
      console.error("Error fetching team formations:", error);
      setTeamFormations([]);
    }
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

  const upcomingSessions = sessions.filter(s => new Date(s.sessionDate) > new Date());
  const completedSessions = sessions.filter(s => new Date(s.sessionDate) <= new Date());
  const trainingSessions = sessions.filter(s => s.sessionType === 'Training');
  const gameSessions = sessions.filter(s => s.sessionType === 'Game');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training & Game Sessions</h1>
          <p className="text-gray-600">Schedule and manage training sessions and games</p>
        </div>
        <Button 
          onClick={() => setShowAddSession(true)}
          data-testid="button-add-session"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Session
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="stat-total-sessions">
                  {sessions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Training Sessions</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="stat-training-sessions">
                  {trainingSessions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Trophy className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Game Sessions</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="stat-game-sessions">
                  {gameSessions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="stat-upcoming-sessions">
                  {upcomingSessions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Grid */}
      <div className="space-y-6">
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No sessions scheduled
              </h3>
              <p className="text-muted-foreground">
                Create your first training or game session to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => {
              const isUpcoming = new Date(session.sessionDate) > new Date();
              return (
                <Card 
                  key={session.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-primary"
                  onClick={() => handleSessionClick(session)}
                  data-testid={`session-card-${session.id}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {session.sessionType === "Game" ? "Game Session" : "Training Session"}
                      </CardTitle>
                      <Badge variant={session.sessionType === "Game" ? "destructive" : "default"}>
                        {session.sessionType}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(new Date(session.sessionDate), "MMM dd, yyyy")}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {session.startTime}
                      {session.endTime && ` - ${session.endTime}`}
                    </div>

                    {session.address && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {session.address}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm">
                        <span className="font-medium">
                          {session.team1Name || `Team ${session.team1Id}`} vs {session.team2Name || `Team ${session.team2Id}`}
                        </span>
                        {session.scoreTeam1 !== null && session.scoreTeam2 !== null && (
                          <div className="text-xs text-gray-500 mt-1">
                            Score: {session.scoreTeam1} - {session.scoreTeam2}
                          </div>
                        )}
                      </div>
                      <Badge variant={isUpcoming ? "default" : "secondary"}>
                        {isUpcoming ? "Upcoming" : "Completed"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Session Modal */}
      {showAddSession && (
        <AddSessionModal 
          isOpen={showAddSession} 
          onClose={() => setShowAddSession(false)} 
        />
      )}

      {/* Team Formation Details Modal */}
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Team Formation Details</span>
            </DialogTitle>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-6">
              {/* Session Info */}
              <Card className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{format(new Date(selectedSession.sessionDate), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{selectedSession.startTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={selectedSession.sessionType === "Game" ? "destructive" : "default"}>
                        {selectedSession.sessionType}
                      </Badge>
                    </div>
                  </div>
                  {selectedSession.address && (
                    <div className="flex items-center space-x-2 mt-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{selectedSession.address}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Team Formations */}
              <div className="grid gap-6 md:grid-cols-2">
                {teamFormations.map((team) => (
                  <Card key={team.teamId}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>{team.teamName}</span>
                        <Badge variant="outline">{team.members?.length || 0} players</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {team.members && team.members.length > 0 ? (
                        <div className="space-y-3">
                          {team.members.map((member) => (
                            <div 
                              key={member.id} 
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                  {getRoleIcon(member.playerRole)}
                                  <span className="font-medium">
                                    {member.firstName} {member.lastName}
                                  </span>
                                </div>
                              </div>
                              <Badge variant={getRoleBadgeColor(member.playerRole)}>
                                {member.playerRole?.replace('_', ' ') || 'Player'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No players assigned to this team</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}