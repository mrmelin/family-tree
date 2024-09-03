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
import { useEffect } from "react";

const queryClient = new QueryClient();

const defaultFamilyMembers = [
  {
    id: "1",
    firstName: "Peter",
    lastName: "Melin",
    birthDate: "1955-03-15",
    birthPlace: "Stockholm",
    isDeceased: false,
    bio: "Family patriarch",
    fatherId: null,
    motherId: null,
    childrenIds: ["3", "4"]
  },
  {
    id: "2",
    firstName: "Birgitta",
    lastName: "Melin",
    birthDate: "1958-07-22",
    birthPlace: "Göteborg",
    isDeceased: false,
    bio: "Family matriarch",
    fatherId: null,
    motherId: null,
    childrenIds: ["3", "4"]
  },
  {
    id: "3",
    firstName: "Ola",
    lastName: "Melin",
    birthDate: "1985-11-10",
    birthPlace: "Stockholm",
    isDeceased: false,
    bio: "Eldest son",
    fatherId: "1",
    motherId: "2",
    childrenIds: ["5"]
  },
  {
    id: "4",
    firstName: "Elin",
    lastName: "Melin",
    birthDate: "1988-04-05",
    birthPlace: "Stockholm",
    isDeceased: false,
    bio: "Daughter",
    fatherId: "1",
    motherId: "2",
    childrenIds: []
  },
  {
    id: "5",
    firstName: "Filip",
    lastName: "Melin",
    birthDate: "2015-09-20",
    birthPlace: "Stockholm",
    isDeceased: false,
    bio: "Grandson",
    fatherId: "3",
    motherId: null,
    childrenIds: []
  }
];

const App = () => {
  useEffect(() => {
    const storedMembers = localStorage.getItem('familyMembers');
    if (!storedMembers) {
      localStorage.setItem('familyMembers', JSON.stringify(defaultFamilyMembers));
    }
  }, []);

  return (
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
};

export default App;