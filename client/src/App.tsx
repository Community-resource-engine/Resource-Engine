import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import DirectorySelection from "@/pages/DirectorySelection";
import MentalHealthSearch from "@/pages/MentalHealthSearch";
import SubstanceAbuseSearch from "@/pages/SubstanceAbuseSearch";
import FacilityDetailPage from "@/pages/FacilityDetail";
import Research from "@/pages/Research";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={DirectorySelection} />
      <Route path="/search/mental-health" component={MentalHealthSearch} />
      <Route path="/search/substance-abuse" component={SubstanceAbuseSearch} />
      <Route path="/facility/:id" component={FacilityDetailPage} />
      <Route path="/research" component={Research} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
