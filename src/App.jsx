import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import FamilyTree from "@/components/FamilyTree";
import MemberDetails from "@/components/MemberDetails";
import AddEditMember from "@/components/AddEditMember";
import Timeline from "@/components/Timeline";
import MediaGallery from "@/components/MediaGallery";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<FamilyTree />} />
              <Route path="/member/:id" element={<MemberDetails />} />
              <Route path="/add-member" element={<AddEditMember />} />
              <Route path="/edit-member/:id" element={<AddEditMember />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/gallery" element={<MediaGallery />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;