import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import CardRequests from "./pages/CardRequests";
import NewCardRequest from "./pages/NewCardRequest";
import CardManagement from "./pages/CardManagement";
import Disputes from "./pages/Disputes";
import NewDispute from "./pages/NewDispute";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import NotificationsPage from "./pages/NotificationsPage";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/card-requests" element={<CardRequests />} />
            <Route path="/card-requests/new" element={<NewCardRequest />} />
            <Route path="/cards" element={<CardManagement />} />
            <Route path="/disputes" element={<Disputes />} />
            <Route path="/disputes/new" element={<NewDispute />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/users" element={<Users />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/support" element={<Support />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
