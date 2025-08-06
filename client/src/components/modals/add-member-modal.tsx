import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertClubMemberSchema } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useState, useEffect } from "react";

const memberFormSchema = insertClubMemberSchema.extend({
  confirmAge: z.boolean().refine(val => val, "You must confirm the member is at least 11 years old")
});

type MemberFormData = z.infer<typeof memberFormSchema>;

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isMinor, setIsMinor] = useState(false);

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      status: "Active",
      joinDate: new Date().toISOString().split('T')[0],
      confirmAge: false
    }
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["/api/locations"],
  });

  const { data: hobbies = [] } = useQuery({
    queryKey: ["/api/hobbies"],
  });

  const { data: families = [] } = useQuery({
    queryKey: ["/api/families"],
  });

  const createMemberMutation = useMutation({
    mutationFn: async (data: Omit<MemberFormData, 'confirmAge'>) => {
      const response = await apiRequest("POST", "/api/members", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Success", description: "Member created successfully" });
      onClose();
      form.reset();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create member",
        variant: "destructive"
      });
    }
  });

  // Watch date of birth to determine if minor
  const dob = form.watch("dob");
  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      setIsMinor(age < 18);
    }
  }, [dob]);

  const onSubmit = (data: MemberFormData) => {
    const { confirmAge, ...memberData } = data;
    createMemberMutation.mutate(memberData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Club Member</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...form.register("firstName")}
                  data-testid="input-first-name"
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.firstName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...form.register("lastName")}
                  data-testid="input-last-name"
                />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.lastName.message}</p>
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
                {form.formState.errors.dob && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.dob.message}</p>
                )}
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
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  {...form.register("height")}
                  data-testid="input-height"
                />
              </div>

              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  {...form.register("weight")}
                  data-testid="input-weight"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  {...form.register("phone")}
                  data-testid="input-phone"
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

              <div className="md:col-span-2">
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
                <Select onValueChange={(value) => form.setValue("province", value)}>
                  <SelectTrigger data-testid="select-province">
                    <SelectValue placeholder="Select Province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="QC">Quebec</SelectItem>
                    <SelectItem value="ON">Ontario</SelectItem>
                    <SelectItem value="BC">British Columbia</SelectItem>
                    <SelectItem value="AB">Alberta</SelectItem>
                    <SelectItem value="MB">Manitoba</SelectItem>
                    <SelectItem value="SK">Saskatchewan</SelectItem>
                    <SelectItem value="NS">Nova Scotia</SelectItem>
                    <SelectItem value="NB">New Brunswick</SelectItem>
                    <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                    <SelectItem value="PE">Prince Edward Island</SelectItem>
                    <SelectItem value="YT">Yukon</SelectItem>
                    <SelectItem value="NT">Northwest Territories</SelectItem>
                    <SelectItem value="NU">Nunavut</SelectItem>
                  </SelectContent>
                </Select>
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
          </div>

          {/* Official Documents */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Official Documents</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="medicareCard">Medicare Card Number</Label>
                <Input
                  id="medicareCard"
                  {...form.register("medicareCard")}
                  data-testid="input-medicare-card"
                />
                {form.formState.errors.medicareCard && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.medicareCard.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Family Member Section for Minors */}
          {isMinor && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-4">Family Member Information</h4>
              <p className="text-sm text-blue-800 mb-4">Minor members must be associated with a family member.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Select Existing Family Member</Label>
                  <Select>
                    <SelectTrigger data-testid="select-family-member">
                      <SelectValue placeholder="Select Family Member" />
                    </SelectTrigger>
                    <SelectContent>
                      {families.map((family: any) => (
                        <SelectItem key={family.id} value={family.id.toString()}>
                          {family.firstName} {family.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Relationship</Label>
                  <Select>
                    <SelectTrigger data-testid="select-relationship">
                      <SelectValue placeholder="Select Relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Father">Father</SelectItem>
                      <SelectItem value="Mother">Mother</SelectItem>
                      <SelectItem value="Grandfather">Grandfather</SelectItem>
                      <SelectItem value="Grandmother">Grandmother</SelectItem>
                      <SelectItem value="Tutor">Tutor</SelectItem>
                      <SelectItem value="Partner">Partner</SelectItem>
                      <SelectItem value="Friend">Friend</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Age Confirmation */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirmAge"
              checked={form.watch("confirmAge")}
              onCheckedChange={(checked) => form.setValue("confirmAge", !!checked)}
              data-testid="checkbox-confirm-age"
            />
            <Label htmlFor="confirmAge">
              I confirm this member is at least 11 years old
            </Label>
          </div>
          {form.formState.errors.confirmAge && (
            <p className="text-sm text-red-600">{form.formState.errors.confirmAge.message}</p>
          )}

          {/* Form Actions */}
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
              disabled={createMemberMutation.isPending}
              data-testid="button-create-member"
            >
              {createMemberMutation.isPending ? "Creating..." : "Create Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
