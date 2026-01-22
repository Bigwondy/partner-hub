import { useState } from "react";
import { ArrowLeft, Check, CreditCard, Upload, Download, FileSpreadsheet } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const cardProfiles = [
  { id: "visa_classic", name: "Visa Classic" },
  { id: "visa_gold", name: "Visa Gold" },
  { id: "mastercard_standard", name: "Mastercard Standard" },
  { id: "mastercard_platinum", name: "Mastercard Platinum" },
  { id: "verve_standard", name: "Verve Standard" },
];

type CardType = "instant" | "embossed" | null;

export default function NewCardRequest() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<CardType>(null);
  const [cardProfile, setCardProfile] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const selectedProfileData = cardProfiles.find((p) => p.id === cardProfile);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast.success(`File "${file.name}" uploaded successfully`);
    }
  };

  const handleDownloadTemplate = () => {
    // Create a simple CSV template
    const templateContent = "Customer Name,Account Number,Email,Phone Number,Address\nJohn Doe,1234567890,john@example.com,08012345678,123 Main Street Lagos";
    const blob = new Blob([templateContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "card_request_template.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Template downloaded successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardProfile) {
      toast.error("Please select a card profile");
      return;
    }

    if (selectedType === "instant" && !quantity) {
      toast.error("Please enter the quantity");
      return;
    }

    if (selectedType === "embossed" && !uploadedFile) {
      toast.error("Please upload a card file");
      return;
    }

    const cardTypeName = selectedType === "instant" ? "Instant" : "Embossed";

    toast.success("Card request submitted for approval!", {
      description: `Your ${cardTypeName} card request has been sent to the approvals queue.`,
    });
    navigate("/approvals");
  };

  const handleBack = () => {
    if (selectedType) {
      setSelectedType(null);
      setCardProfile("");
      setQuantity("1");
      setUploadedFile(null);
    } else {
      navigate("/card-requests");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={handleBack} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="page-header mb-0">
          <h1 className="page-title">New Card Request</h1>
          <p className="page-description">
            {selectedType === null
              ? "Select the type of physical card you want to request"
              : selectedType === "instant"
              ? "Request instant cards for immediate issuance"
              : "Request embossed cards with personalized details"}
          </p>
        </div>
      </div>

      {/* Card Type Selection */}
      {selectedType === null && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setSelectedType("instant")}
            className="card-elevated p-6 text-left hover:border-accent transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-info/10 group-hover:bg-info/20 transition-colors">
                <CreditCard className="w-6 h-6 text-info" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">Instant Cards</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Request blank cards for immediate issuance at branch locations. Simply select the profile and quantity.
                </p>
                <span className="text-sm font-medium text-accent">Select →</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedType("embossed")}
            className="card-elevated p-6 text-left hover:border-accent transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                <CreditCard className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">Embossed Cards</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Request personalized cards with raised text. Upload a card file with customer details.
                </p>
                <span className="text-sm font-medium text-accent">Select →</span>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Instant Card Form */}
      {selectedType === "instant" && (
        <form onSubmit={handleSubmit} className="card-elevated p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="p-2 rounded-lg bg-info/10">
                <CreditCard className="w-5 h-5 text-info" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Instant Card Request</h3>
                <p className="text-sm text-muted-foreground">Cards will be available for immediate issuance</p>
              </div>
            </div>

            {/* Card Profile */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Card Profile
              </label>
              <select
                value={cardProfile}
                onChange={(e) => setCardProfile(e.target.value)}
                className="input-field"
              >
                <option value="">Select a card profile</option>
                {cardProfiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="input-field"
                placeholder="Enter number of cards"
              />
            </div>

            {/* Summary */}
            {cardProfile && quantity && (
              <div className="p-4 bg-info/5 rounded-xl border border-info/20">
                <h4 className="text-sm font-medium text-foreground mb-3">Request Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Card Profile</span>
                    <span className="font-medium text-foreground">{selectedProfileData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-medium text-foreground">{quantity} card(s)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-border">
              <button
                type="submit"
                className="btn-accent w-full py-3"
                disabled={!cardProfile || !quantity}
              >
                <Check className="w-4 h-4" />
                Submit Request
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Embossed Card Form */}
      {selectedType === "embossed" && (
        <form onSubmit={handleSubmit} className="card-elevated p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="p-2 rounded-lg bg-accent/10">
                <CreditCard className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Embossed Card Request</h3>
                <p className="text-sm text-muted-foreground">Personalized cards with raised text</p>
              </div>
            </div>

            {/* Card Profile */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Card Profile
              </label>
              <select
                value={cardProfile}
                onChange={(e) => setCardProfile(e.target.value)}
                className="input-field"
              >
                <option value="">Select a card profile</option>
                {cardProfiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </select>
            </div>


            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Upload Card File
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                  uploadedFile ? "border-success bg-success/5" : "border-border hover:border-accent"
                }`}>
                  {uploadedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileSpreadsheet className="w-8 h-8 text-success" />
                      <div className="text-left">
                        <p className="font-medium text-foreground">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        CSV, XLSX, or XLS files only
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            {cardProfile && uploadedFile && (
              <div className="p-4 bg-accent/5 rounded-xl border border-accent/20">
                <h4 className="text-sm font-medium text-foreground mb-3">Request Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Card Profile</span>
                    <span className="font-medium text-foreground">{selectedProfileData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Card File</span>
                    <span className="font-medium text-foreground">{uploadedFile.name}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-border">
              <button
                type="submit"
                className="btn-accent w-full py-3"
                disabled={!cardProfile || !uploadedFile}
              >
                <Check className="w-4 h-4" />
                Submit Request
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
