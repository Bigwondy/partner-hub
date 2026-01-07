import { useState } from "react";
import { Bell, Check, CheckCheck, FileText, CreditCard, AlertTriangle, DollarSign, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: 1,
    type: "card_request",
    title: "Card request approved",
    message: "Request #REQ-2024-001234 has been approved and sent to production",
    time: "2 minutes ago",
    read: false,
    icon: FileText,
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  {
    id: 2,
    type: "dispute",
    title: "Dispute status updated",
    message: "Dispute #DSP-2024-000891 has been moved to 'Under Investigation'",
    time: "1 hour ago",
    read: false,
    icon: AlertTriangle,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
  {
    id: 3,
    type: "settlement",
    title: "Settlement completed",
    message: "Daily settlement of ₦12,450,000 has been processed successfully",
    time: "3 hours ago",
    read: true,
    icon: DollarSign,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    id: 4,
    type: "card_blocked",
    title: "Card blocked",
    message: "Card ****4532 has been blocked due to customer request",
    time: "5 hours ago",
    read: true,
    icon: CreditCard,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
  },
  {
    id: 5,
    type: "system",
    title: "Scheduled maintenance",
    message: "System maintenance scheduled for January 10th, 2:00 AM - 4:00 AM WAT",
    time: "1 day ago",
    read: true,
    icon: Settings,
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notificationList, setNotificationList] = useState(notifications);

  const filteredNotifications = notificationList.filter((n) =>
    filter === "all" ? true : !n.read
  );

  const unreadCount = notificationList.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotificationList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <div className="flex items-center gap-3">
            <h1 className="page-title">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-accent text-accent-foreground rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="page-description">
            Stay updated on your card program activities
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn-ghost text-sm text-accent">
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            filter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            filter === "unread"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="card-elevated divide-y divide-border">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications to show</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={cn(
                "flex items-start gap-4 p-4 cursor-pointer transition-colors",
                !notification.read ? "bg-accent/5" : "hover:bg-muted/30"
              )}
            >
              <div className={cn("p-2.5 rounded-xl", notification.iconBg)}>
                <notification.icon className={cn("w-5 h-5", notification.iconColor)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn(
                    "text-sm",
                    !notification.read ? "font-semibold text-foreground" : "font-medium text-foreground"
                  )}>
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-1.5"></span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                <p className="text-xs text-muted-foreground/70 mt-2">{notification.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
