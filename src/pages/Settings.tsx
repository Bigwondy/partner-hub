import { useState } from "react";
import { User, Bell, Shield, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

const tabs = [
  { id: "profile", name: "Profile", icon: User },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "security", name: "Security", icon: Shield },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@acmecorp.com",
    phone: "+234 801 234 5678",
    role: "Partner Admin",
  });
  const [notificationSettings, setNotificationSettings] = useState({
    cardRequests: true,
    disputes: true,
    settlements: true,
    security: true,
    marketing: false,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-description">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="card-elevated p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                  activeTab === tab.id
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="card-elevated p-6 animate-fade-in">
              <h2 className="text-lg font-semibold mb-6">Profile Information</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">JD</span>
                  </div>
                  <button className="btn-secondary">Change Avatar</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="input-field"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={profile.role}
                      className="input-field"
                      disabled
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <button className="btn-accent">Save Changes</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="card-elevated p-6 animate-fade-in">
              <h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Card Request Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when card requests change status
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.cardRequests}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, cardRequests: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Dispute Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when disputes are updated
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.disputes}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, disputes: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Settlement Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when settlements are processed
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.settlements}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, settlements: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-foreground">Security Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified about security events
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.security}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, security: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">Marketing & Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Receive product updates and announcements
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketing}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, marketing: checked })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="card-elevated p-6 animate-fade-in">
              <h2 className="text-lg font-semibold mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Password</p>
                      <p className="text-sm text-muted-foreground">
                        Last changed 30 days ago
                      </p>
                    </div>
                    <button className="btn-secondary">Change Password</button>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <span className="px-3 py-1 text-sm font-medium bg-success/10 text-success rounded-full">
                      Enabled
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Active Sessions</p>
                      <p className="text-sm text-muted-foreground">
                        Manage your active login sessions
                      </p>
                    </div>
                    <button className="btn-secondary">View Sessions</button>
                  </div>
                </div>
                <div className="p-4 border border-destructive/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-destructive">Sign Out All Devices</p>
                      <p className="text-sm text-muted-foreground">
                        Sign out from all devices except this one
                      </p>
                    </div>
                    <button className="btn-destructive">Sign Out All</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
