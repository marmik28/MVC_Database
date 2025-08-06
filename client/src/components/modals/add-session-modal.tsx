import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSessionSchema } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type SessionFormData = z.infer<typeof insertSessionSchema>;

interface AddSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddSessionModal({ isOpen, onClose }: AddSessionModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SessionFormData>({
    resolver: zodResolver(insertSessionSchema),
    defaultValues: {
      sessionDate: new Date().toISOString().split('T')[0],
      sessionType: "Training"
    }
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["/api/locations"],
  });

  const { data: teams = [] } = useQuery({
    queryKey: ["/api/teams"],
  });

  const createSessionMutation = useMutation({
    mutationFn: async (data: SessionFormData) => {
      const response = await apiRequest("POST", "/api/sessions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Success", description: "Session scheduled successfully" });
      onClose();
      form.reset();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to schedule session",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: SessionFormData) => {
    // Validate that teams are different if sessionType is Game
    if (data.sessionType === "Game" && data.team1Id === data.team2Id) {
      toast({
        title: "Error",
        description: "Game sessions must have two different teams",
        variant: "destructive"
      });
      return;
    }

    createSessionMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Schedule New Session</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sessionType">Session Type</Label>
              <Select onValueChange={(value) => form.setValue("sessionType", value as "Training" | "Game")}>
                <SelectTrigger data-testid="select-session-type">
                  <SelectValue placeholder="Select Session Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Training">Training</SelectItem>
                  <SelectItem value="Game">Game</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.sessionType && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.sessionType.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="locationId">Location</Label>
              <Select onValueChange={(value) => form.setValue("locationId", parseInt(value))}>
                <SelectTrigger data-testid="select-location">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location: any) => (
                    <SelectItem key={location.id} value={location.id.toString()}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="team1Id">Team 1</Label>
              <Select onValueChange={(value) => form.setValue("team1Id", parseInt(value))}>
                <SelectTrigger data-testid="select-team1">
                  <SelectValue placeholder="Select Team 1" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team: any) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.teamName} ({team.gender})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="team2Id">Team 2 (for Games)</Label>
              <Select onValueChange={(value) => form.setValue("team2Id", parseInt(value))}>
                <SelectTrigger data-testid="select-team2">
                  <SelectValue placeholder="Select Team 2" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team: any) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.teamName} ({team.gender})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sessionDate">Session Date</Label>
              <Input
                id="sessionDate"
                type="date"
                {...form.register("sessionDate")}
                data-testid="input-session-date"
              />
              {form.formState.errors.sessionDate && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.sessionDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                {...form.register("startTime")}
                data-testid="input-start-time"
              />
              {form.formState.errors.startTime && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.startTime.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Session Address</Label>
              <Input
                id="address"
                {...form.register("address")}
                placeholder="Enter session venue address"
                data-testid="input-address"
              />
            </div>

            {form.watch("sessionType") === "Game" && (
              <>
                <div>
                  <Label htmlFor="scoreTeam1">Team 1 Score (after game)</Label>
                  <Input
                    id="scoreTeam1"
                    type="number"
                    {...form.register("scoreTeam1", { valueAsNumber: true })}
                    placeholder="Enter score after game completion"
                    data-testid="input-score-team1"
                  />
                </div>

                <div>
                  <Label htmlFor="scoreTeam2">Team 2 Score (after game)</Label>
                  <Input
                    id="scoreTeam2"
                    type="number"
                    {...form.register("scoreTeam2", { valueAsNumber: true })}
                    placeholder="Enter score after game completion"
                    data-testid="input-score-team2"
                  />
                </div>
              </>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Scheduling Rules</h4>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• Players cannot be assigned to sessions within 3 hours of each other</li>
              <li>• Team members must be of the same gender for each session</li>
              <li>• Training sessions require only one team</li>
              <li>• Game sessions require two different teams</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createSessionMutation.isPending}
              data-testid="button-schedule-session"
            >
              {createSessionMutation.isPending ? "Scheduling..." : "Schedule Session"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
