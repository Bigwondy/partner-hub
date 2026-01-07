import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  const [newCardType, setNewCardType] = useState(cardType);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!reason) {
      toast({
        title: "Error",
        description: "Please select a reason for reissuance",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Reissue Request Submitted",
      description: `A new ${newCardType} card will be issued for ${cardHolder}`,
    });
    setReason("");
    setDeliveryType("standard");
    onOpenChange(false);
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
          <div className="space-y-2">
            <Label>New Card Type</Label>
            <Select value={newCardType} onValueChange={setNewCardType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Instant">Instant Card</SelectItem>
                <SelectItem value="Embossed">Embossed Card</SelectItem>
                <SelectItem value="Virtual">Virtual Card</SelectItem>
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
