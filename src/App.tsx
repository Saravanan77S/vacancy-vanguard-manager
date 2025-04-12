
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import pages
import Dashboard from "./pages/Dashboard";
import JobsList from "./pages/JobsList";
import ActiveJobs from "./pages/ActiveJobs";
import CreateJob from "./pages/CreateJob";
import Applications from "./pages/Applications";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

// Import layout
import { Layout } from "./components/layout/Layout";

// Create a new query client
const queryClient = new QueryClient();

// Install required dependencies
import "@faker-js/faker";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/jobs" element={<JobsList />} />
            <Route path="/active-jobs" element={<ActiveJobs />} />
            <Route path="/create-job" element={<CreateJob />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
