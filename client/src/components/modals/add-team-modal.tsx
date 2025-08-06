import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTeamFormationSchema } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type TeamFormData = z.infer<typeof insertTeamFormationSchema>;

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTeamModal({ isOpen, onClose }: AddTeamModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TeamFormData>({
    resolver: zodResolver(insertTeamFormationSchema),
    defaultValues: {
      startDate: new Date().toISOString().split('T')[0]
    }
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["/api/locations"],
  });

  const { data: personnel = [] } = useQuery({
    queryKey: ["/api/personnel"],
  });

  const createTeamMutation = useMutation({
    mutationFn: async (data: TeamFormData) => {
      const response = await apiRequest("POST", "/api/teams", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Success", description: "Team created successfully" });
      onClose();
      form.reset();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create team",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: TeamFormData) => {
    createTeamMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                {...form.register("teamName")}
                data-testid="input-team-name"
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => form.setValue("gender", value as "Male" | "Female")}>
                <SelectTrigger data-testid="select-gender">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.gender && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.gender.message}</p>
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
              <Label htmlFor="headCoachId">Head Coach</Label>
              <Select onValueChange={(value) => form.setValue("headCoachId", parseInt(value))}>
                <SelectTrigger data-testid="select-head-coach">
                  <SelectValue placeholder="Select Head Coach" />
                </SelectTrigger>
                <SelectContent>
                  {personnel.map((person: any) => (
                    <SelectItem key={person.id} value={person.id.toString()}>
                      {person.firstName} {person.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...form.register("startDate")}
                data-testid="input-start-date"
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                {...form.register("endDate")}
                data-testid="input-end-date"
              />
            </div>
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
              disabled={createTeamMutation.isPending}
              data-testid="button-create-team"
            >
              {createTeamMutation.isPending ? "Creating..." : "Create Team"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
