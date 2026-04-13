import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import SearchResults from "./pages/SearchResults";
import Favorites from "./pages/Favorites";
import UserDashboard from "./pages/UserDashboard";
import AddProperty from "./pages/AddProperty";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import About from "./pages/About";
import AgentProfile from "./pages/AgentProfile";
import Agents from "./pages/Agents";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAgents from "./pages/admin/AdminAgents";
import AdminApprovals from "./pages/admin/AdminApprovals";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSettings from "./pages/admin/AdminSettings";
import AgentRegister from "./pages/AgentRegister";
import AgentDashboardHome from "./pages/agent/AgentDashboardHome";
import AgentListings from "./pages/agent/AgentListings";
import AgentAddProperty from "./pages/agent/AgentAddProperty";
import AgentInquiries from "./pages/agent/AgentInquiries";
import AgentReviews from "./pages/agent/AgentReviews";
import AgentProfileSettings from "./pages/agent/AgentProfileSettings";
import AgentSettings from "./pages/agent/AgentSettings";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
      <FavoritesProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/add-property" element={<ProtectedRoute role="agent"><AddProperty /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/agent/:id" element={<AgentProfile />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/properties" element={<ProtectedRoute role="admin"><AdminProperties /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/agents" element={<ProtectedRoute role="admin"><AdminAgents /></ProtectedRoute>} />
            <Route path="/admin/approvals" element={<ProtectedRoute role="admin"><AdminApprovals /></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute role="admin"><AdminMessages /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />
            <Route path="/agent-register" element={<AgentRegister />} />
            <Route path="/agent-dashboard" element={<ProtectedRoute role="agent"><AgentDashboardHome /></ProtectedRoute>} />
            <Route path="/agent-dashboard/listings" element={<ProtectedRoute role="agent"><AgentListings /></ProtectedRoute>} />
            <Route path="/agent-dashboard/add-property" element={<ProtectedRoute role="agent"><AgentAddProperty /></ProtectedRoute>} />
            <Route path="/agent-dashboard/inquiries" element={<ProtectedRoute role="agent"><AgentInquiries /></ProtectedRoute>} />
            <Route path="/agent-dashboard/reviews" element={<ProtectedRoute role="agent"><AgentReviews /></ProtectedRoute>} />
            <Route path="/agent-dashboard/profile" element={<ProtectedRoute role="agent"><AgentProfileSettings /></ProtectedRoute>} />
            <Route path="/agent-dashboard/settings" element={<ProtectedRoute role="agent"><AgentSettings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
