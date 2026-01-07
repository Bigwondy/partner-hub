import { useState } from "react";
import { ArrowLeft, Check, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const cardProfiles = [
  { id: "visa_classic", name: "Visa Classic", fee: 2500 },
  { id: "visa_gold", name: "Visa Gold", fee: 5000 },
  { id: "mastercard_standard", name: "Mastercard Standard", fee: 2500 },
  { id: "mastercard_platinum", name: "Mastercard Platinum", fee: 7500 },
  { id: "verve_standard", name: "Verve Standard", fee: 1500 },
];

export default function NewCardRequest() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cardType: "",
    cardProfile: "",
    numberOfCards: "1",
  });

  const selectedProfile = cardProfiles.find((p) => p.id === formData.cardProfile);
  const totalFee = selectedProfile ? selectedProfile.fee * parseInt(formData.numberOfCards || "0") : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cardType || !formData.cardProfile || !formData.numberOfCards) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.success("Card request submitted successfully!");
    navigate("/card-requests");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/card-requests" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div className="page-header mb-0">
          <h1 className="page-title">New Card Request</h1>
          <p className="page-description">Submit a new card production request</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card-elevated p-6">
        <div className="space-y-6">
          {/* Card Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Card Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: "instant", name: "Instant Card", description: "Issued immediately at branch" },
                { id: "embossed", name: "Embossed Card", description: "Personalized with raised text" },
                { id: "virtual", name: "Virtual Card", description: "Digital card for online use" },
              ].map((type) => (
                <label
                  key={type.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.cardType === type.id
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="cardType"
                    value={type.id}
                    checked={formData.cardType === type.id}
                    onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${formData.cardType === type.id ? "bg-accent/20" : "bg-muted"}`}>
                      <CreditCard className={`w-5 h-5 ${formData.cardType === type.id ? "text-accent" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{type.name}</p>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Card Profile */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Card Profile
            </label>
            <select
              value={formData.cardProfile}
              onChange={(e) => setFormData({ ...formData, cardProfile: e.target.value })}
              className="input-field"
            >
              <option value="">Select a card profile</option>
              {cardProfiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name} - ₦{profile.fee.toLocaleString()}/card
                </option>
              ))}
            </select>
          </div>

          {/* Number of Cards */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Number of Cards
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={formData.numberOfCards}
              onChange={(e) => setFormData({ ...formData, numberOfCards: e.target.value })}
              className="input-field"
              placeholder="Enter quantity"
            />
          </div>

          {/* Summary */}
          {formData.cardType && formData.cardProfile && formData.numberOfCards && (
            <div className="p-4 bg-accent/5 rounded-xl border border-accent/20">
              <h3 className="text-sm font-medium text-foreground mb-3">Request Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Card Type</span>
                  <span className="font-medium text-foreground capitalize">{formData.cardType} Card</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Card Profile</span>
                  <span className="font-medium text-foreground">{selectedProfile?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium text-foreground">{formData.numberOfCards} card(s)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-accent/20">
                  <span className="text-muted-foreground">Total Fee</span>
                  <span className="text-lg font-bold text-accent">₦{totalFee.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 border-t border-border">
            <button
              type="submit"
              className="btn-accent w-full py-3"
              disabled={!formData.cardType || !formData.cardProfile || !formData.numberOfCards}
            >
              <Check className="w-4 h-4" />
              Submit Request
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
