
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MatchDetail from "./pages/MatchDetail";
import PlayerDetail from "./pages/PlayerDetail";
import Matches from "./pages/Matches";
import Players from "./pages/Players";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/match/:id" element={<MatchDetail />} />
                  <Route path="/player/:id" element={<PlayerDetail />} />
                  <Route path="/matches" element={<Matches />} />
                  <Route path="/players" element={<Players />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/sport/:sport" element={<Players />} />
                  <Route path="/about" element={<NotFound />} />
                  <Route path="/faq" element={<NotFound />} />
                  <Route path="/contact" element={<NotFound />} />
                  <Route path="/terms" element={<NotFound />} />
                  <Route path="/privacy" element={<NotFound />} />
                  <Route path="/cookies" element={<NotFound />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
