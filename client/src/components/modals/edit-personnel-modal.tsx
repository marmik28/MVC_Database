import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPersonnelSchema } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useEffect } from "react";

type PersonnelFormData = z.infer<typeof insertPersonnelSchema> & { locationId?: number };

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
  locationId?: number;
  locationName?: string;
}

interface EditPersonnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  personnel: Personnel;
}

export default function EditPersonnelModal({ isOpen, onClose, personnel }: EditPersonnelModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PersonnelFormData>({
    resolver: zodResolver(insertPersonnelSchema.extend({ locationId: z.number().optional() })),
    defaultValues: {
      firstName: personnel.firstName,
      lastName: personnel.lastName,
      dob: personnel.dob,
      ssn: personnel.ssn,
      medicareCard: personnel.medicareCard,
      phone: personnel.phone,
      address: personnel.address,
      city: personnel.city,
      province: personnel.province,
      postalCode: personnel.postalCode,
      email: personnel.email,
      roleId: personnel.roleId,
      mandate: personnel.mandate as "Salaried" | "Volunteer",
      locationId: personnel.locationId || undefined
    }
  });

  // Update form when personnel prop changes
  useEffect(() => {
    form.reset({
      firstName: personnel.firstName,
      lastName: personnel.lastName,
      dob: personnel.dob,
      ssn: personnel.ssn,
      medicareCard: personnel.medicareCard,
      phone: personnel.phone,
      address: personnel.address,
      city: personnel.city,
      province: personnel.province,
      postalCode: personnel.postalCode,
      email: personnel.email,
      roleId: personnel.roleId,
      mandate: personnel.mandate as "Salaried" | "Volunteer",
      locationId: personnel.locationId || undefined
    });
  }, [personnel, form]);

  const { data: roles = [] } = useQuery<any[]>({
    queryKey: ["/api/roles"],
  });

  const { data: locations = [] } = useQuery<any[]>({
    queryKey: ["/api/locations"],
  });

  const updatePersonnelMutation = useMutation({
    mutationFn: async (data: PersonnelFormData) => {
      const response = await apiRequest("PUT", `/api/personnel/${personnel.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personnel"] });
      toast({ title: "Success", description: "Personnel updated successfully" });
      onClose();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update personnel",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: PersonnelFormData) => {
    updatePersonnelMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Personnel</DialogTitle>
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
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                {...form.register("dob")}
                data-testid="input-dob"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...form.register("address")}
                data-testid="input-address"
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...form.register("city")}
                data-testid="input-city"
              />
            </div>

            <div>
              <Label htmlFor="province">Province</Label>
              <Input
                id="province"
                {...form.register("province")}
                data-testid="input-province"
              />
            </div>

            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                {...form.register("postalCode")}
                data-testid="input-postal-code"
              />
            </div>

            <div>
              <Label htmlFor="roleId">Role</Label>
              <Select 
                onValueChange={(value) => form.setValue("roleId", parseInt(value))}
                value={form.watch("roleId")?.toString()}
              >
                <SelectTrigger data-testid="select-role">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role: any) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mandate">Mandate</Label>
              <Select 
                onValueChange={(value) => form.setValue("mandate", value as "Salaried" | "Volunteer")}
                value={form.watch("mandate") || ""}
              >
                <SelectTrigger data-testid="select-mandate">
                  <SelectValue placeholder="Select Mandate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Salaried">Salaried</SelectItem>
                  <SelectItem value="Volunteer">Volunteer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="locationId">Work Location</Label>
              <Select 
                onValueChange={(value) => form.setValue("locationId", parseInt(value))}
                value={form.watch("locationId")?.toString()}
              >
                <SelectTrigger data-testid="select-location">
                  <SelectValue placeholder="Select work location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location: any) => (
                    <SelectItem key={location.id} value={location.id.toString()}>
                      {location.name} ({location.type})
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
              disabled={updatePersonnelMutation.isPending}
              data-testid="button-update-personnel"
            >
              {updatePersonnelMutation.isPending ? "Updating..." : "Update Personnel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}