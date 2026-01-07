import { useState } from "react";
import { 
  CreditCard, 
  User, 
  Calendar, 
  Wallet, 
  Ban, 
  RefreshCw, 
  Lock, 
  Power, 
  PowerOff,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CardHotlistDialog } from "./CardHotlistDialog";
import { CardReissueDialog } from "./CardReissueDialog";
import { CardPINDialog } from "./CardPINDialog";
import { CardStatusToggle } from "./CardStatusToggle";
import { useToast } from "@/hooks/use-toast";

interface Card {
  id: string;
  maskedPan: string;
  customerName: string;
  customerId: string;
  type: string;
  cardCategory: string;
  status: string;
  expiry: string;
  dailyLimit: number;
  monthlyLimit: number;
  issuedAt: string;
}

interface CardDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: Card | null;
  onManageLimits: (card: Card) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "status-active" },
  paused: { label: "Paused", className: "status-paused" },
  blocked: { label: "Blocked", className: "status-blocked" },
  expired: { label: "Expired", className: "bg-muted text-muted-foreground" },
};

const cardCategoryLabels: Record<string, string> = {
  instant: "Instant Card",
  embossed: "Embossed Card",
  virtual: "Virtual Card",
};

export function CardDetailsSheet({ 
  open, 
  onOpenChange, 
  card,
  onManageLimits 
}: CardDetailsSheetProps) {
  const [hotlistDialogOpen, setHotlistDialogOpen] = useState(false);
  const [reissueDialogOpen, setReissueDialogOpen] = useState(false);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [statusToggleOpen, setStatusToggleOpen] = useState(false);
  const { toast } = useToast();

  if (!card) return null;

  const handleActionWithApproval = (action: string) => {
    toast({
      title: "Approval Request Submitted",
      description: `Your ${action} request has been submitted for approval. You will be notified once it's reviewed.`,
    });
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="space-y-4 pb-6">
            <SheetTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold">Card Details</p>
                <p className="text-sm text-muted-foreground font-mono">{card.maskedPan}</p>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  card.status === 'active' ? 'bg-success' : 
                  card.status === 'paused' ? 'bg-warning' : 'bg-destructive'
                }`} />
                <div>
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  <Badge className={statusConfig[card.status]?.className || 'bg-muted'}>
                    {statusConfig[card.status]?.label || card.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Card Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Card Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/20 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-xs">Card Type</span>
                  </div>
                  <p className="font-medium text-foreground">{card.type}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-xs">Category</span>
                  </div>
                  <p className="font-medium text-foreground">{cardCategoryLabels[card.cardCategory]}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Expiry Date</span>
                  </div>
                  <p className="font-medium font-mono text-foreground">{card.expiry}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Issued On</span>
                  </div>
                  <p className="font-medium text-foreground">{card.issuedAt}</p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Customer Information</h3>
              <div className="p-4 rounded-lg bg-muted/20 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{card.customerName}</p>
                    <p className="text-sm text-muted-foreground">{card.customerId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Spending Limits */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Spending Limits</h3>
              <div className="p-4 rounded-lg bg-muted/20 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm">Daily Limit</span>
                  </div>
                  <p className="font-semibold text-foreground">₦{card.dailyLimit.toLocaleString()}</p>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm">Monthly Limit</span>
                  </div>
                  <p className="font-semibold text-foreground">₦{card.monthlyLimit.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Actions</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                All actions require approval
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-3 flex flex-col items-center gap-2"
                  onClick={() => {
                    onManageLimits(card);
                    onOpenChange(false);
                  }}
                >
                  <Wallet className="w-5 h-5 text-accent" />
                  <span className="text-xs">Manage Limits</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-3 flex flex-col items-center gap-2"
                  onClick={() => setPinDialogOpen(true)}
                >
                  <Lock className="w-5 h-5 text-primary" />
                  <span className="text-xs">PIN Management</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-3 flex flex-col items-center gap-2"
                  onClick={() => setReissueDialogOpen(true)}
                >
                  <RefreshCw className="w-5 h-5 text-success" />
                  <span className="text-xs">Reissue Card</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-3 flex flex-col items-center gap-2"
                  onClick={() => setStatusToggleOpen(true)}
                >
                  {card.status === 'active' ? (
                    <>
                      <PowerOff className="w-5 h-5 text-warning" />
                      <span className="text-xs">Deactivate</span>
                    </>
                  ) : (
                    <>
                      <Power className="w-5 h-5 text-success" />
                      <span className="text-xs">Activate</span>
                    </>
                  )}
                </Button>
              </div>

              {card.status !== 'blocked' && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setHotlistDialogOpen(true)}
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Hotlist Card
                </Button>
              )}

              {card.status === 'blocked' && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
                  <p className="text-sm text-destructive font-medium">This card is blocked and cannot perform transactions</p>
                </div>
              )}
            </div>

            {/* Pending Approvals Notice */}
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-warning">Approval Workflow</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All card management actions require supervisor approval before taking effect.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Action Dialogs */}
      <CardHotlistDialog
        open={hotlistDialogOpen}
        onOpenChange={setHotlistDialogOpen}
        cardNumber={card.maskedPan}
        cardHolder={card.customerName}
      />

      <CardReissueDialog
        open={reissueDialogOpen}
        onOpenChange={setReissueDialogOpen}
        cardNumber={card.maskedPan}
        cardHolder={card.customerName}
        cardType={card.type}
      />

      <CardPINDialog
        open={pinDialogOpen}
        onOpenChange={setPinDialogOpen}
        cardNumber={card.maskedPan}
        cardHolder={card.customerName}
      />

      <CardStatusToggle
        open={statusToggleOpen}
        onOpenChange={setStatusToggleOpen}
        cardNumber={card.maskedPan}
        cardHolder={card.customerName}
        currentStatus={card.status === 'active' ? 'Active' : card.status === 'paused' ? 'Paused' : 'Blocked'}
        onStatusChange={(newStatus) => {
          handleActionWithApproval(`status change to ${newStatus}`);
        }}
      />
    </>
  );
}
