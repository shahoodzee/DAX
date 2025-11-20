import "./global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import MyListings from "./pages/MyListings";
import Marketplace from "./pages/Marketplace";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import AccountDetails from "./pages/AccountDetails";
import SellerListings from "./pages/SellerListings";

const queryClient = new QueryClient();

function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/account/:id" element={<AccountDetails />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/:userId" element={<SellerListings />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/my-lisitng" element={<Navigate to="/my-listings" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const w = window as any;
w.__app_root = w.__app_root || createRoot(rootElement);
w.__app_root.render(<App />);
