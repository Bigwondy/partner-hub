import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useApprovalsStore } from "@/stores/approvalsStore";
import { useAuthStore } from "@/stores/authStore";
interface CardHotlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardNumber: string;
  cardHolder: string;
}

const hotlistReasons = [
  "Lost Card",
  "Stolen Card",
  "Fraudulent Activity",
  "Customer Request",
  "Account Closure",
  "Damaged Card",
  "Other",
];

export function CardHotlistDialog({
  open,
  onOpenChange,
  cardNumber,
  cardHolder,
}: CardHotlistDialogProps) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addApproval } = useApprovalsStore();
  const { user } = useAuthStore();

  const handleSubmit = () => {
    if (!reason) {
      toast({
        title: "Error",
        description: "Please select a reason for hotlisting",
        variant: "destructive",
      });
      return;
    }

    // Add to approvals store
    addApproval({
      type: "hotlist",
      requestedBy: user?.name || "Current User",
      requestedByEmail: user?.email || "user@example.com",
      subject: `Hotlist Card - ${cardNumber}`,
      description: `Request to hotlist card ${cardNumber} for ${cardHolder}. Reason: ${reason}${notes ? `. Notes: ${notes}` : ""}`,
      status: "pending",
      priority: "high",
      metadata: {
        cardNumber,
        cardHolder,
        reason,
        notes: notes || "N/A",
      },
    });

    toast({
      title: "Hotlist Request Submitted",
      description: `Your request to hotlist card ${cardNumber} has been sent for approval.`,
    });
    setReason("");
    setNotes("");
    onOpenChange(false);
    navigate("/approvals");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Hotlist Card
          </DialogTitle>
          <DialogDescription>
            Adding a card to the hotlist will immediately block all transactions.
            This action requires supervisor approval.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">Card Details</p>
            <p className="font-medium">{cardNumber}</p>
            <p className="text-sm text-muted-foreground">{cardHolder}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hotlistReason">Reason for Hotlisting</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {hotlistReasons.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hotlistNotes">Additional Notes</Label>
            <Textarea
              id="hotlistNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any relevant details..."
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSubmit}>
              Hotlist Card
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
