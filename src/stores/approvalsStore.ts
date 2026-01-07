import { create } from "zustand";

export interface ApprovalRequest {
  id: string;
  type: "card_request" | "limit_change" | "hotlist" | "reissue" | "status_change" | "user_create" | "config_change";
  requestedBy: string;
  requestedByEmail: string;
  subject: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewComment?: string;
  metadata?: Record<string, string>;
}

interface ApprovalsStore {
  approvals: ApprovalRequest[];
  addApproval: (approval: Omit<ApprovalRequest, "id" | "createdAt" | "updatedAt">) => string;
  updateApproval: (id: string, updates: Partial<ApprovalRequest>) => void;
  getApprovalById: (id: string) => ApprovalRequest | undefined;
  getPendingApprovals: () => ApprovalRequest[];
}

const initialApprovals: ApprovalRequest[] = [
  {
    id: "APR-001",
    type: "card_request",
    requestedBy: "John Smith",
    requestedByEmail: "john.smith@partner.com",
    subject: "Bulk Card Request - 500 Instant Cards",
    description: "Request for 500 instant cards for new customer onboarding campaign",
    status: "pending",
    priority: "high",
    createdAt: "2024-01-15T10:30:00",
    updatedAt: "2024-01-15T10:30:00",
    metadata: {
      cardType: "Instant",
      profile: "Standard Debit",
      quantity: "500",
    },
  },
  {
    id: "APR-002",
    type: "limit_change",
    requestedBy: "Sarah Johnson",
    requestedByEmail: "sarah.j@partner.com",
    subject: "Card Limit Increase - **** 4521",
    description: "Increase daily transaction limit from ₦100,000 to ₦500,000",
    status: "pending",
    priority: "medium",
    createdAt: "2024-01-15T09:15:00",
    updatedAt: "2024-01-15T09:15:00",
    metadata: {
      cardPan: "**** **** **** 4521",
      currentLimit: "₦100,000",
      requestedLimit: "₦500,000",
    },
  },
  {
    id: "APR-003",
    type: "hotlist",
    requestedBy: "Michael Brown",
    requestedByEmail: "m.brown@partner.com",
    subject: "Hotlist Card - Fraud Suspected",
    description: "Customer reported unauthorized transactions, requesting immediate hotlist",
    status: "pending",
    priority: "high",
    createdAt: "2024-01-15T08:45:00",
    updatedAt: "2024-01-15T08:45:00",
    metadata: {
      cardPan: "**** **** **** 7892",
      reason: "Fraud suspected",
      customerName: "Adebayo Olamide",
    },
  },
  {
    id: "APR-004",
    type: "card_request",
    requestedBy: "David Wilson",
    requestedByEmail: "d.wilson@partner.com",
    subject: "Embossed Card Request - 100 Cards",
    description: "Request for personalized embossed cards with company branding",
    status: "approved",
    priority: "medium",
    createdAt: "2024-01-13T11:00:00",
    updatedAt: "2024-01-14T09:30:00",
    reviewedBy: "Admin User",
    reviewComment: "Approved. Card file verified and production scheduled.",
    metadata: {
      cardType: "Embossed",
      profile: "Premium Debit",
      quantity: "100",
    },
  },
  {
    id: "APR-005",
    type: "status_change",
    requestedBy: "Lisa Anderson",
    requestedByEmail: "l.anderson@partner.com",
    subject: "Deactivate Card - Customer Request",
    description: "Customer requested temporary deactivation while traveling",
    status: "approved",
    priority: "low",
    createdAt: "2024-01-12T15:45:00",
    updatedAt: "2024-01-13T08:00:00",
    reviewedBy: "Support Lead",
    reviewComment: "Approved per customer request. Card can be reactivated upon return.",
    metadata: {
      cardPan: "**** **** **** 9012",
      action: "Deactivate",
      reason: "Travel",
    },
  },
  {
    id: "APR-006",
    type: "config_change",
    requestedBy: "Admin User",
    requestedByEmail: "admin@pavilion.com",
    subject: "Fee Configuration Update",
    description: "Update interchange fee percentage from 1.5% to 1.75%",
    status: "rejected",
    priority: "high",
    createdAt: "2024-01-11T10:00:00",
    updatedAt: "2024-01-12T14:30:00",
    reviewedBy: "Partner Admin",
    reviewComment: "Rejected. Fee increase requires partner agreement renewal first.",
    metadata: {
      configType: "Fee",
      currentValue: "1.5%",
      proposedValue: "1.75%",
    },
  },
];

export const useApprovalsStore = create<ApprovalsStore>((set, get) => ({
  approvals: initialApprovals,

  addApproval: (approval) => {
    const id = `APR-${String(get().approvals.length + 1).padStart(3, "0")}`;
    const now = new Date().toISOString();
    const newApproval: ApprovalRequest = {
      ...approval,
      id,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({
      approvals: [newApproval, ...state.approvals],
    }));
    return id;
  },

  updateApproval: (id, updates) => {
    set((state) => ({
      approvals: state.approvals.map((a) =>
        a.id === id
          ? { ...a, ...updates, updatedAt: new Date().toISOString() }
          : a
      ),
    }));
  },

  getApprovalById: (id) => {
    return get().approvals.find((a) => a.id === id);
  },

  getPendingApprovals: () => {
    return get().approvals.filter((a) => a.status === "pending");
  },
}));
