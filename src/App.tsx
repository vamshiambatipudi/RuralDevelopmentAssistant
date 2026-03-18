import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import AuthLanding from "./pages/AuthLanding";
import Auth from "./pages/Auth";
import UserLogin from "./pages/user/UserLogin";
import UserRegister from "./pages/user/UserRegister";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import Dashboard from "./pages/Dashboard";
import CropRecommendation from "./pages/CropRecommendation";
import Telemedicine from "./pages/Telemedicine";
import GovernmentSchemes from "./pages/GovernmentSchemes";
import SchemeDetails from "./pages/SchemeDetails";
import JobsSkills from "./pages/JobsSkills";
import Weather from "./pages/Weather";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminSchemeManagement from "./pages/AdminSchemeManagement";
import AdminJobManagement from "./pages/AdminJobManagement";
import AdminCropManagement from "./pages/AdminCropManagement";
import AdminTelemedicineManagement from "./pages/AdminTelemedicineManagement";
import AdminWeatherConfig from "./pages/AdminWeatherConfig";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Role selection landing */}
          <Route path="/auth" element={<AuthLanding />} />

          {/* Legacy auth route — redirect to new landing */}
          <Route path="/login" element={<Navigate to="/auth" replace />} />

          {/* User authentication */}
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/register" element={<UserRegister />} />

          {/* Admin authentication */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* User pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crop-recommendation" element={<CropRecommendation />} />
          <Route path="/telemedicine" element={<Telemedicine />} />
          <Route path="/schemes" element={<GovernmentSchemes />} />
          <Route path="/schemes/:schemeId" element={<SchemeDetails />} />
          <Route path="/jobs" element={<JobsSkills />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin pages */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUserManagement />} />
          <Route path="/admin/schemes" element={<AdminSchemeManagement />} />
          <Route path="/admin/jobs" element={<AdminJobManagement />} />
          <Route path="/admin/crops" element={<AdminCropManagement />} />
          <Route path="/admin/telemedicine" element={<AdminTelemedicineManagement />} />
          <Route path="/admin/weather" element={<AdminWeatherConfig />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
