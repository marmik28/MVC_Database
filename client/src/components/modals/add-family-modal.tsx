import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFamilyMemberSchema } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type FamilyFormData = z.infer<typeof insertFamilyMemberSchema>;

interface AddFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddFamilyModal({ isOpen, onClose }: AddFamilyModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FamilyFormData>({
    resolver: zodResolver(insertFamilyMemberSchema),
    defaultValues: {}
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["/api/locations"],
  });

  const createFamilyMutation = useMutation({
    mutationFn: async (data: FamilyFormData) => {
      const response = await apiRequest("POST", "/api/families", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/families"] });
      toast({ title: "Success", description: "Family member created successfully" });
      onClose();
      form.reset();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create family member",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: FamilyFormData) => {
    createFamilyMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Family Member</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...form.register("firstName")}
                data-testid="input-first-name"
              />
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...form.register("lastName")}
                data-testid="input-last-name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                data-testid="input-email"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...form.register("phone")}
                data-testid="input-phone"
              />
            </div>

            <div>
              <Label htmlFor="ssn">Social Security Number</Label>
              <Input
                id="ssn"
                {...form.register("ssn")}
                data-testid="input-ssn"
              />
              {form.formState.errors.ssn && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.ssn.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="medicareCard">Medicare Card</Label>
              <Input
                id="medicareCard"
                {...form.register("medicareCard")}
                data-testid="input-medicare-card"
              />
              {form.formState.errors.medicareCard && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.medicareCard.message}</p>
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
              disabled={createFamilyMutation.isPending}
              data-testid="button-create-family"
            >
              {createFamilyMutation.isPending ? "Creating..." : "Create Family Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
