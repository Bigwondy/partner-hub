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
    id: "APR-003",
    type: "card_request",
    requestedBy: "Sarah Johnson",
    requestedByEmail: "sarah.j@partner.com",
    subject: "Instant Card Request - 250 Cards",
    description: "Request for instant cards for branch replenishment",
    status: "rejected",
    priority: "medium",
    createdAt: "2024-01-12T14:00:00",
    updatedAt: "2024-01-13T10:15:00",
    reviewedBy: "Partner Admin",
    reviewComment: "Rejected. Inventory levels sufficient for current demand.",
    metadata: {
      cardType: "Instant",
      profile: "Standard Debit",
      quantity: "250",
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
