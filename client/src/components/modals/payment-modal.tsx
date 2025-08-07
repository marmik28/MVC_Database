import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPaymentSchema } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useState, useEffect } from "react";

const paymentFormSchema = insertPaymentSchema.extend({
  membershipYear: z.number().min(2020).max(2030)
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [recommendedAmount, setRecommendedAmount] = useState<number>(0);
  const [isDonationAmount, setIsDonationAmount] = useState<boolean>(false);

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentDate: new Date().toISOString().split('T')[0],
      membershipYear: new Date().getFullYear(),
      isDonation: false
    }
  });

  const { data: members = [] } = useQuery({
    queryKey: ["/api/members/active"],
  });

  const { data: payments = [] } = useQuery({
    queryKey: ["/api/payments"],
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (data: PaymentFormData) => {
      const response = await apiRequest("POST", "/api/payments", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      toast({ title: "Success", description: "Payment processed successfully" });
      onClose();
      form.reset();
      setSelectedMember(null);
      setRecommendedAmount(0);
      setIsDonationAmount(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to process payment",
        variant: "destructive"
      });
    }
  });

  // Calculate recommended amount when member is selected
  useEffect(() => {
    if (selectedMember) {
      const memberId = selectedMember.id;
      const membershipYear = form.watch("membershipYear");
      
      // Calculate age to determine if major or minor
      const birthDate = new Date(selectedMember.dob);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      const isMajor = age >= 18;
      const requiredFee = isMajor ? 200 : 100;

      // Calculate total payments for this member for this year
      const memberPayments = payments.filter((p: any) => 
        p.memberId === memberId && 
        p.membershipYear === membershipYear && 
        !p.isDonation
      );

      const totalPaid = memberPayments.reduce((sum: number, payment: any) => 
        sum + parseFloat(payment.amount || 0), 0
      );

      const remaining = requiredFee - totalPaid;
      const recommended = Math.max(0, remaining);
      
      setRecommendedAmount(recommended);
    }
  }, [selectedMember, form.watch("membershipYear"), payments]);

  // Watch amount changes to detect donations
  useEffect(() => {
    const amount = parseFloat(form.watch("amount") || "0");
    if (selectedMember && amount > 0) {
      setIsDonationAmount(amount > recommendedAmount);
      
      // Auto-set donation flag if amount exceeds recommended
      if (amount > recommendedAmount && recommendedAmount > 0) {
        form.setValue("isDonation", true);
      } else {
        form.setValue("isDonation", false);
      }
    }
  }, [form.watch("amount"), recommendedAmount, selectedMember]);

  const onSubmit = (data: PaymentFormData) => {
    if (!selectedMember) {
      toast({
        title: "Error",
        description: "Please select a member",
        variant: "destructive"
      });
      return;
    }

    // Check payment installment limit (max 4 installments per year)
    const memberPayments = payments.filter((p: any) => 
      p.memberId === data.memberId && 
      p.membershipYear === data.membershipYear &&
      !p.isDonation
    );

    if (memberPayments.length >= 4 && !data.isDonation) {
      toast({
        title: "Error",
        description: "Maximum 4 membership installments allowed per year",
        variant: "destructive"
      });
      return;
    }

    createPaymentMutation.mutate(data);
  };

  const handleMemberSelect = (memberId: string) => {
    const member = members.find((m: any) => m.id === parseInt(memberId));
    setSelectedMember(member);
    form.setValue("memberId", parseInt(memberId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="memberId">Select Member</Label>
              <Select onValueChange={handleMemberSelect}>
                <SelectTrigger data-testid="select-member">
                  <SelectValue placeholder="Select Member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member: any) => {
                    const birthDate = new Date(member.dob);
                    const age = new Date().getFullYear() - birthDate.getFullYear();
                    const type = age >= 18 ? "Major" : "Minor";
                    return (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.firstName} {member.lastName} ({type})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {form.formState.errors.memberId && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.memberId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="membershipYear">Membership Year</Label>
              <Select onValueChange={(value) => form.setValue("membershipYear", parseInt(value))}>
                <SelectTrigger data-testid="select-membership-year">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Payment Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                {...form.register("amount")}
                data-testid="input-amount"
              />
              {recommendedAmount > 0 && (
                <p className="text-xs text-blue-600 mt-1">
                  Recommended: ${recommendedAmount.toFixed(2)} 
                  {isDonationAmount && " (excess will be donation)"}
                </p>
              )}
              {form.formState.errors.amount && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.amount.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="method">Payment Method</Label>
              <Select onValueChange={(value) => form.setValue("method", value as "Cash" | "Credit" | "Debit")}>
                <SelectTrigger data-testid="select-payment-method">
                  <SelectValue placeholder="Select Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Credit">Credit Card</SelectItem>
                  <SelectItem value="Debit">Debit Card</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.method && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.method.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="paymentDate">Payment Date</Label>
              <Input
                id="paymentDate"
                type="date"
                {...form.register("paymentDate")}
                data-testid="input-payment-date"
              />
              {form.formState.errors.paymentDate && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.paymentDate.message}</p>
              )}
            </div>
          </div>

          {selectedMember && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Member Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Name:</strong> {selectedMember.firstName} {selectedMember.lastName}
                </div>
                <div>
                  <strong>Type:</strong> {(() => {
                    const birthDate = new Date(selectedMember.dob);
                    const age = new Date().getFullYear() - birthDate.getFullYear();
                    return age >= 18 ? "Major ($200/year)" : "Minor ($100/year)";
                  })()}
                </div>
                <div>
                  <strong>Status:</strong> {selectedMember.status}
                </div>
              </div>
            </div>
          )}

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
              disabled={createPaymentMutation.isPending}
              data-testid="button-process-payment"
            >
              {createPaymentMutation.isPending ? "Processing..." : "Process Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
