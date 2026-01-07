import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, User, CreditCard, MapPin, FileCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, name: "Customer Info", icon: User },
  { id: 2, name: "Card Details", icon: CreditCard },
  { id: 3, name: "Delivery", icon: MapPin },
  { id: 4, name: "Review", icon: FileCheck },
];

export default function NewCardRequest() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    cardType: "",
    binRange: "",
    quantity: "1",
    deliveryMethod: "branch",
    branchId: "",
    address: "",
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Simulate submission
    navigate("/card-requests");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
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

      {/* Stepper */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    currentStep > step.id
                      ? "bg-success text-success-foreground"
                      : currentStep === step.id
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className={cn(
                    "text-sm font-medium",
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.name}
                  </p>
                  <p className="text-xs text-muted-foreground">Step {step.id}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-4",
                  currentStep > step.id ? "bg-success" : "bg-border"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="card-elevated p-6">
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-lg font-semibold">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Customer ID
                </label>
                <input
                  type="text"
                  placeholder="Enter customer ID or search..."
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="customer@email.com"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+234 xxx xxx xxxx"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-lg font-semibold">Card Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Card Type
                </label>
                <select
                  value={formData.cardType}
                  onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select card type</option>
                  <option value="visa_debit">Visa Debit</option>
                  <option value="visa_prepaid">Visa Prepaid</option>
                  <option value="mastercard_debit">Mastercard Debit</option>
                  <option value="mastercard_prepaid">Mastercard Prepaid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  BIN Range
                </label>
                <select
                  value={formData.binRange}
                  onChange={(e) => setFormData({ ...formData, binRange: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select BIN range</option>
                  <option value="453298">453298 - Standard Debit</option>
                  <option value="522345">522345 - Premium Debit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div className="p-4 bg-accent/5 rounded-xl border border-accent/20">
              <p className="text-sm font-medium text-foreground">Estimated Fee</p>
              <p className="text-2xl font-bold text-accent mt-1">₦2,500.00</p>
              <p className="text-xs text-muted-foreground mt-1">Per card issuance fee</p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-lg font-semibold">Delivery Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Delivery Method
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                    formData.deliveryMethod === "branch"
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  )}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="branch"
                      checked={formData.deliveryMethod === "branch"}
                      onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                      className="sr-only"
                    />
                    <p className="font-medium text-foreground">Branch Pickup</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Customer picks up at designated branch
                    </p>
                  </label>
                  <label className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                    formData.deliveryMethod === "courier"
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  )}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="courier"
                      checked={formData.deliveryMethod === "courier"}
                      onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                      className="sr-only"
                    />
                    <p className="font-medium text-foreground">Courier Delivery</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Delivered to customer address
                    </p>
                  </label>
                </div>
              </div>
              {formData.deliveryMethod === "branch" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Select Branch
                  </label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select pickup branch</option>
                    <option value="lagos_vi">Lagos - Victoria Island</option>
                    <option value="lagos_ikeja">Lagos - Ikeja</option>
                    <option value="abuja_central">Abuja - Central</option>
                    <option value="ph_main">Port Harcourt - Main</option>
                  </select>
                </div>
              )}
              {formData.deliveryMethod === "courier" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    placeholder="Enter full delivery address..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-lg font-semibold">Review Request</h2>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-xl">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Customer Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Customer ID</p>
                    <p className="font-medium text-foreground">{formData.customerId || "CUS-0045321"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium text-foreground">{formData.customerName || "Adebayo Johnson"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{formData.customerEmail || "adebayo@email.com"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{formData.customerPhone || "+234 801 234 5678"}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-muted/30 rounded-xl">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Card Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Card Type</p>
                    <p className="font-medium text-foreground">Visa Debit</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">BIN Range</p>
                    <p className="font-medium text-foreground">453298</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-medium text-foreground">{formData.quantity}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-accent/5 rounded-xl border border-accent/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Total Fee</p>
                    <p className="text-xs text-muted-foreground">Issuance fee × {formData.quantity}</p>
                  </div>
                  <p className="text-2xl font-bold text-accent">₦2,500.00</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="btn-secondary disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          {currentStep < 4 ? (
            <button onClick={handleNext} className="btn-accent">
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} className="btn-accent">
              <Check className="w-4 h-4" />
              Submit Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
