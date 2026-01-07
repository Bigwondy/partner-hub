import { useState } from "react";
import { Key, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface CardPINDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardNumber: string;
  cardHolder: string;
}

export function CardPINDialog({
  open,
  onOpenChange,
  cardNumber,
  cardHolder,
}: CardPINDialogProps) {
  const [action, setAction] = useState("reset");
  const { toast } = useToast();

  const handleSubmit = () => {
    const actionLabels: Record<string, string> = {
      reset: "PIN Reset",
      unblock: "PIN Unblock",
      remail: "PIN Remail",
    };

    toast({
      title: `${actionLabels[action]} Initiated`,
      description:
        action === "remail"
          ? `A new PIN mailer will be sent to ${cardHolder}`
          : `${actionLabels[action]} completed for card ${cardNumber}`,
    });
    setAction("reset");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-accent" />
            PIN Management
          </DialogTitle>
          <DialogDescription>
            Manage PIN for this card
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">Card Details</p>
            <p className="font-medium">{cardNumber}</p>
            <p className="text-sm text-muted-foreground">{cardHolder}</p>
          </div>
          <div className="space-y-3">
            <Label>Select Action</Label>
            <RadioGroup value={action} onValueChange={setAction}>
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="reset" id="reset" className="mt-1" />
                <div>
                  <Label htmlFor="reset" className="font-medium cursor-pointer">
                    Reset PIN
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Generate a new PIN for the cardholder
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="unblock" id="unblock" className="mt-1" />
                <div>
                  <Label htmlFor="unblock" className="font-medium cursor-pointer">
                    Unblock PIN
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Unblock PIN after too many failed attempts
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="remail" id="remail" className="mt-1" />
                <div>
                  <Label htmlFor="remail" className="font-medium cursor-pointer">
                    Remail PIN
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Send a new PIN mailer to the cardholder's address
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
          <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-warning mt-0.5" />
              <p className="text-sm text-warning">
                This action will be logged and may require supervisor approval.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="btn-accent" onClick={handleSubmit}>
              Confirm Action
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
