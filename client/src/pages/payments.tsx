import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import DataTable, { StatusBadge, TypeBadge } from "@/components/data-table";
import { useState } from "react";
import PaymentModal from "@/components/modals/payment-modal";

export default function Payments() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["/api/payments"],
  });

  const { data: members = [] } = useQuery({
    queryKey: ["/api/members"],
  });

  const columns = [
    {
      key: "member",
      label: "Member",
      render: (value: any, row: any) => {
        const member = members.find((m: any) => m.id === row.memberId);
        return (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-gray-600 text-xs"></i>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">
                {member ? `${member.firstName} ${member.lastName}` : `Member #${row.memberId}`}
              </div>
              <div className="text-xs text-gray-500">ID: #{row.memberId}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "amount",
      label: "Amount",
      render: (value: any, row: any) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">${row.amount}</div>
          <div className="text-xs text-gray-500">
            {row.isDonation ? "Donation" : `${row.membershipYear} Membership`}
          </div>
        </div>
      ),
    },
    {
      key: "method",
      label: "Payment Method",
      render: (value: any, row: any) => <TypeBadge type={row.method} />,
    },
    {
      key: "paymentDate",
      label: "Payment Date",
      render: (value: any, row: any) => (
        <div className="text-sm">
          {new Date(row.paymentDate).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: any, row: any) => (
        <StatusBadge status={row.isDonation ? "Donation" : "Membership"} />
      ),
    },
  ];

  // Calculate payment statistics
  const totalRevenue = payments.reduce((sum: number, payment: any) => sum + parseFloat(payment.amount || 0), 0);
  const membershipPayments = payments.filter((p: any) => !p.isDonation);
  const donations = payments.filter((p: any) => p.isDonation);
  const currentYear = new Date().getFullYear();
  const thisYearPayments = payments.filter((p: any) => p.membershipYear === currentYear);

  if (paymentsLoading) {
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & Memberships</h1>
          <p className="text-gray-600">Process payments and manage membership fees</p>
        </div>
        <Button 
          onClick={() => setShowPaymentModal(true)}
          data-testid="button-process-payment"
        >
          <i className="fas fa-plus mr-2"></i>
          Process Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary bg-opacity-10 rounded-full">
              <i className="fas fa-dollar-sign text-primary text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="stat-total-revenue">
                ${totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-success bg-opacity-10 rounded-full">
              <i className="fas fa-credit-card text-success text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Membership Fees</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="stat-membership-payments">
                {membershipPayments.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-warning bg-opacity-10 rounded-full">
              <i className="fas fa-heart text-warning text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Donations</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="stat-donations">
                {donations.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-secondary bg-opacity-10 rounded-full">
              <i className="fas fa-calendar-check text-secondary text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{currentYear} Payments</p>
              <p className="text-3xl font-bold text-gray-900" data-testid="stat-current-year-payments">
                {thisYearPayments.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        title="All Payments"
        columns={columns}
        data={payments}
      />

      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
      />
    </div>
  );
}
