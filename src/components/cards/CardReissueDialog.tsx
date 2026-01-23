import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

interface CardReissueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardNumber: string;
  cardHolder: string;
  cardType: string;
}

const reissueReasons = [
  "Card Expiry",
  "Card Damaged",
  "Card Lost/Stolen (after hotlist)",
  "Name Change",
  "Upgrade Request",
  "Other",
];

export function CardReissueDialog({
  open,
  onOpenChange,
  cardNumber,
  cardHolder,
  cardType,
}: CardReissueDialogProps) {
  const [reason, setReason] = useState("");
  const [deliveryType, setDeliveryType] = useState("standard");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addApproval } = useApprovalsStore();
  const { user } = useAuthStore();

  const deliveryLabels: Record<string, string> = {
    standard: "Standard Delivery (5-7 business days)",
    express: "Express Delivery (2-3 business days)",
    pickup: "Branch Pickup",
  };

  const handleSubmit = () => {
    if (!reason) {
      toast({
        title: "Error",
        description: "Please select a reason for reissuance",
        variant: "destructive",
      });
      return;
    }

    // Add to approvals store
    addApproval({
      type: "reissue",
      requestedBy: user?.name || "Current User",
      requestedByEmail: user?.email || "user@example.com",
      subject: `Reissue Card - ${cardNumber}`,
      description: `Request to reissue card ${cardNumber} for ${cardHolder}. Reason: ${reason}. Delivery: ${deliveryLabels[deliveryType]}`,
      status: "pending",
      priority: "medium",
      metadata: {
        cardNumber,
        cardHolder,
        cardType,
        reason,
        deliveryType: deliveryLabels[deliveryType],
      },
    });

    toast({
      title: "Reissue Request Submitted",
      description: `Your request to reissue card for ${cardHolder} has been sent for approval.`,
    });
    setReason("");
    setDeliveryType("standard");
    onOpenChange(false);
    navigate("/approvals");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-accent" />
            Reissue Card
          </DialogTitle>
          <DialogDescription>
            Request a replacement card for this customer
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">Current Card</p>
            <p className="font-medium">{cardNumber}</p>
            <p className="text-sm text-muted-foreground">{cardHolder}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reissueReason">Reason for Reissuance</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {reissueReasons.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label>Delivery Option</Label>
            <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="font-normal cursor-pointer">
                  Standard Delivery (5-7 business days)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="express" id="express" />
                <Label htmlFor="express" className="font-normal cursor-pointer">
                  Express Delivery (2-3 business days)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup" className="font-normal cursor-pointer">
                  Branch Pickup
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="btn-accent" onClick={handleSubmit}>
              Submit Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
