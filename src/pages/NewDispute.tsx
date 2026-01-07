import { useState } from "react";
import { ArrowLeft, Search, Upload, X, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const mockTransactions = [
  {
    id: "TXN-20240105-89432",
    cardMasked: "****4532",
    customerName: "Adebayo Johnson",
    amount: 45000,
    merchant: "Amazon.com",
    date: "2024-01-05 14:32",
    type: "Purchase",
  },
  {
    id: "TXN-20240104-78123",
    cardMasked: "****8921",
    customerName: "Chioma Okafor",
    amount: 125000,
    merchant: "Jumia Nigeria",
    date: "2024-01-04 11:15",
    type: "Purchase",
  },
  {
    id: "TXN-20240103-65890",
    cardMasked: "****1287",
    customerName: "Emmanuel Nnamdi",
    amount: 89000,
    merchant: "Konga.com",
    date: "2024-01-03 16:48",
    type: "Purchase",
  },
];

export default function NewDispute() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<typeof mockTransactions[0] | null>(null);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const filteredTransactions = mockTransactions.filter(
    (tx) =>
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.cardMasked.includes(searchQuery)
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    navigate("/disputes");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/disputes" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div className="page-header mb-0">
          <h1 className="page-title">Raise New Dispute</h1>
          <p className="page-description">Submit a dispute for a transaction</p>
        </div>
      </div>

      {/* Step 1: Select Transaction */}
      <div className="card-elevated p-6">
        <h2 className="text-lg font-semibold mb-4">1. Select Transaction</h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by transaction ID, customer name, or card..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              onClick={() => setSelectedTransaction(tx)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedTransaction?.id === tx.id
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-accent/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{tx.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {tx.customerName} • {tx.cardMasked}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">₦{tx.amount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{tx.merchant}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Dispute Details */}
      <div className="card-elevated p-6">
        <h2 className="text-lg font-semibold mb-4">2. Dispute Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Dispute Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-field"
            >
              <option value="">Select a reason</option>
              <option value="unauthorized">Unauthorized Transaction</option>
              <option value="duplicate">Duplicate Charge</option>
              <option value="goods_not_received">Goods Not Received</option>
              <option value="service_not_rendered">Service Not Rendered</option>
              <option value="wrong_amount">Wrong Amount Charged</option>
              <option value="fraud">Fraudulent Transaction</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              placeholder="Provide details about the dispute..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="input-field resize-none"
            />
          </div>
        </div>
      </div>

      {/* Step 3: Supporting Documents */}
      <div className="card-elevated p-6">
        <h2 className="text-lg font-semibold mb-4">3. Supporting Documents (Optional)</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Upload up to 5 files (PDF, JPG, PNG - max 5MB each)
        </p>
        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl hover:border-accent/50 cursor-pointer transition-colors">
            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
            <span className="text-sm font-medium text-foreground">Click to upload</span>
            <span className="text-xs text-muted-foreground">or drag and drop</span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <span className="text-sm text-foreground truncate">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between pt-4">
        <Link to="/disputes" className="btn-secondary">
          Cancel
        </Link>
        <button
          onClick={handleSubmit}
          disabled={!selectedTransaction || !reason}
          className="btn-accent disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          Submit Dispute
        </button>
      </div>
    </div>
  );
}
