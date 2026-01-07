import { useState } from "react";
import { Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface CardStatusToggleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardNumber: string;
  cardHolder: string;
  currentStatus: "Active" | "Blocked" | "Pending" | "Paused";
  onStatusChange: (newStatus: "Active" | "Blocked") => void;
}

export function CardStatusToggle({
  open,
  onOpenChange,
  cardNumber,
  cardHolder,
  currentStatus,
  onStatusChange,
}: CardStatusToggleProps) {
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const isActivating = currentStatus !== "Active";
  const newStatus = isActivating ? "Active" : "Blocked";

  const handleSubmit = () => {
    onStatusChange(newStatus);
    toast({
      title: isActivating ? "Card Activated" : "Card Deactivated",
      description: `Card ${cardNumber} has been ${isActivating ? "activated" : "deactivated"}`,
    });
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isActivating ? (
              <Power className="w-5 h-5 text-success" />
            ) : (
              <PowerOff className="w-5 h-5 text-destructive" />
            )}
            {isActivating ? "Activate Card" : "Deactivate Card"}
          </DialogTitle>
          <DialogDescription>
            {isActivating
              ? "This will enable all transactions on this card"
              : "This will temporarily block all transactions on this card"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">Card Details</p>
            <p className="font-medium">{cardNumber}</p>
            <p className="text-sm text-muted-foreground">{cardHolder}</p>
            <div className="mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentStatus === "Active"
                    ? "bg-success/10 text-success"
                    : currentStatus === "Blocked"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-warning/10 text-warning"
                }`}
              >
                Current: {currentStatus}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="statusNotes">Notes (Optional)</Label>
            <Textarea
              id="statusNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add reason for status change..."
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              variant={isActivating ? "default" : "destructive"}
              onClick={handleSubmit}
              className={isActivating ? "btn-accent" : ""}
            >
              {isActivating ? "Activate Card" : "Deactivate Card"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
