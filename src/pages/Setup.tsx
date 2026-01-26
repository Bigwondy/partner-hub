import { useState } from "react";
import { Key, CreditCard, Settings, ArrowLeft, Copy, Check, Eye, EyeOff, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock Card Profiles data
const cardProfilesData = [
  { id: "CP-001", name: "Premium Visa", account: "0123456789", baseUrl: "https://api.bank.com/v1", status: "configured" },
  { id: "CP-002", name: "Standard Mastercard", account: "9876543210", baseUrl: "https://api.partner.com/v2", status: "configured" },
  { id: "CP-003", name: "Virtual Card", account: "5432109876", baseUrl: "", status: "pending" },
];

interface CardProfile {
  id: string;
  name: string;
  account: string;
  baseUrl: string;
  status: string;
}

export default function Setup() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("keys");
  const [configuringProfile, setConfiguringProfile] = useState<CardProfile | null>(null);
  const [configFormData, setConfigFormData] = useState({
    baseUrl: "",
    apiKey: "",
  });
  const [cardProfiles, setCardProfiles] = useState(cardProfilesData);
  
  // Partner Public Key state
  const [partnerPublicKey, setPartnerPublicKey] = useState("pk_live_*************a4f2b3e1c2d9");
  const [isEditingKey, setIsEditingKey] = useState(false);
  const [editKeyValue, setEditKeyValue] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConfigureClick = (profile: CardProfile) => {
    setConfiguringProfile(profile);
    setConfigFormData({
      baseUrl: profile.baseUrl || "",
      apiKey: "",
    });
  };

  const handleSetConfiguration = () => {
    if (!configFormData.baseUrl || !configFormData.apiKey) {
      toast({
        title: "Validation Error",
        description: "Please fill in both Base URL and API Key",
        variant: "destructive",
      });
      return;
    }

    // Update the card profile
    setCardProfiles(prev => 
      prev.map(p => 
        p.id === configuringProfile?.id 
          ? { ...p, baseUrl: configFormData.baseUrl, status: "configured" }
          : p
      )
    );

    toast({
      title: "Configuration Saved",
      description: `${configuringProfile?.name} has been configured successfully`,
    });

    setConfiguringProfile(null);
    setConfigFormData({ baseUrl: "", apiKey: "" });
  };

  const handleBackToProfiles = () => {
    setConfiguringProfile(null);
    setConfigFormData({ baseUrl: "", apiKey: "" });
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(partnerPublicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied",
      description: "Public key copied to clipboard",
    });
  };

  const handleEditKey = () => {
    setEditKeyValue(partnerPublicKey);
    setIsEditingKey(true);
  };

  const handleSaveKey = () => {
    if (!editKeyValue.trim()) {
      toast({
        title: "Validation Error",
        description: "Public key cannot be empty",
        variant: "destructive",
      });
      return;
    }
    setPartnerPublicKey(editKeyValue);
    setIsEditingKey(false);
    toast({
      title: "Key Updated",
      description: "Partner public key has been updated successfully",
    });
  };

  const handleCancelEdit = () => {
    setIsEditingKey(false);
    setEditKeyValue("");
  };

  const getMaskedKey = () => {
    if (showKey) return partnerPublicKey;
    if (partnerPublicKey.length <= 12) return "••••••••••••";
    return partnerPublicKey.substring(0, 8) + "••••••••••••" + partnerPublicKey.substring(partnerPublicKey.length - 4);
  };

  // Configuration screen for a card profile
  if (configuringProfile) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="page-header">
          <button
            onClick={handleBackToProfiles}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Card Profiles
          </button>
          <h1 className="page-title">Configure {configuringProfile.name}</h1>
          <p className="page-description">
            Set the base URL and API key for this card profile
          </p>
        </div>

        <div className="card-elevated p-6 max-w-2xl">
          <div className="space-y-6">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Profile Name</p>
                  <p className="font-medium text-foreground">{configuringProfile.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Account Number</p>
                  <p className="font-medium text-foreground">{configuringProfile.account}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Set Base URL</label>
                <Input
                  placeholder="https://api.example.com/v1"
                  value={configFormData.baseUrl}
                  onChange={(e) => setConfigFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Set API Key</label>
                <Input
                  type="password"
                  placeholder="Enter your API key"
                  value={configFormData.apiKey}
                  onChange={(e) => setConfigFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                />
              </div>

              <Button onClick={handleSetConfiguration} className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Set Configuration
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Setup</h1>
        <p className="page-description">
          Manage partner public key and configure card profiles
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="keys" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            Partner Public Key
          </TabsTrigger>
          <TabsTrigger value="profiles" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Card Profile
          </TabsTrigger>
        </TabsList>

        {/* Partner Public Key Tab */}
        <TabsContent value="keys" className="mt-6">
          <div className="card-elevated max-w-2xl">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Partner Public Key</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your unique public key for API integration
              </p>
            </div>
            <div className="p-6">
              {isEditingKey ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Public Key</label>
                    <Input
                      value={editKeyValue}
                      onChange={(e) => setEditKeyValue(e.target.value)}
                      placeholder="Enter your public key"
                      className="font-mono"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveKey} className="flex-1">
                      Save Key
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border">
                    <Key className="w-5 h-5 text-primary flex-shrink-0" />
                    <code className="flex-1 font-mono text-sm text-foreground break-all">
                      {getMaskedKey()}
                    </code>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowKey(!showKey)}
                        className="h-8 w-8"
                      >
                        {showKey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopyKey}
                        className="h-8 w-8"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleEditKey} className="w-full">
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Public Key
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Card Profile Tab */}
        <TabsContent value="profiles" className="mt-6">
          <div className="card-elevated">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Card Profiles</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Configure card profiles provided by bank partners
              </p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S/N</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Base URL</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cardProfiles.map((profile, index) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="text-foreground">{profile.name}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{profile.account}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {profile.baseUrl || <span className="text-warning">Not configured</span>}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConfigureClick(profile)}
                        >
                          <Settings className="w-4 h-4 mr-1" />
                          Configure
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
