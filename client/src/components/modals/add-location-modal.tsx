import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLocationSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type LocationFormData = z.infer<typeof insertLocationSchema>;

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddLocationModal({ isOpen, onClose }: AddLocationModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LocationFormData>({
    resolver: zodResolver(insertLocationSchema),
    defaultValues: {
      type: "Branch"
    }
  });

  const createLocationMutation = useMutation({
    mutationFn: async (data: LocationFormData) => {
      const response = await apiRequest("POST", "/api/locations", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Success", description: "Location created successfully" });
      onClose();
      form.reset();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create location",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: LocationFormData) => {
    createLocationMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Location</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Location Name</Label>
              <Input
                id="name"
                {...form.register("name")}
                data-testid="input-location-name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={(value) => form.setValue("type", value as "Head" | "Branch")}>
                <SelectTrigger data-testid="select-location-type">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Head">Head Office</SelectItem>
                  <SelectItem value="Branch">Branch</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.type.message}</p>
              )}
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
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...form.register("phone")}
                data-testid="input-phone"
              />
            </div>

            <div>
              <Label htmlFor="webAddress">Web Address</Label>
              <Input
                id="webAddress"
                {...form.register("webAddress")}
                data-testid="input-web-address"
              />
            </div>

            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                {...form.register("capacity", { valueAsNumber: true })}
                data-testid="input-capacity"
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
              disabled={createLocationMutation.isPending}
              data-testid="button-create-location"
            >
              {createLocationMutation.isPending ? "Creating..." : "Create Location"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
