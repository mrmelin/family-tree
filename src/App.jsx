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
    id: "407",
    firstName: "Andreas",
    lastName: "Melin",
    gender: "male",
    birthDate: "1848-04-15",
    deathDate: "1931-05-29",
    isDeceased: true,
    bio: "Stamtavla 407",
    fatherId: null,
    motherId: null,
    spouseId: null,
    children: ["433", "439", "442", "454", "457", "528", "542", "548", "549"],
    image: "/placeholder.svg"
  },
  {
    id: "433",
    firstName: "Harald",
    lastName: "Melin",
    gender: "male",
    birthDate: "1878-04-01",
    deathDate: "1945-02-26",
    isDeceased: true,
    bio: "",
    fatherId: "407",
    motherId: null,
    spouseId: null,
    children: ["6"],
    image: "/placeholder.svg"
  },
  {
    id: "6",
    firstName: "Svante",
    lastName: "Melin",
    gender: "male",
    birthDate: "1895-02-17",
    deathDate: "1977-10-20",
    isDeceased: true,
    bio: "",
    fatherId: "433",
    motherId: null,
    spouseId: null,
    children: [],
    image: "/placeholder.svg"
  },
  {
    id: "439",
    firstName: "Ida",
    lastName: "Melin",
    gender: "female",
    birthDate: "1888-11-28",
    deathDate: null,
    isDeceased: false,
    bio: "",
    fatherId: "407",
    motherId: null,
    spouseId: null,
    children: [],
    image: "/placeholder.svg"
  },
  {
    id: "442",
    firstName: "Hilda",
    lastName: "Melin",
    gender: "female",
    birthDate: "1880-02-22",
    deathDate: "1948-07-12",
    isDeceased: true,
    bio: "",
    fatherId: "407",
    motherId: null,
    spouseId: null,
    children: [],
    image: "/placeholder.svg"
  },
  {
    id: "454",
    firstName: "Nils",
    lastName: "Melin",
    gender: "male",
    birthDate: "1886-10-26",
    deathDate: null,
    isDeceased: false,
    bio: "",
    fatherId: "407",
    motherId: null,
    spouseId: null,
    children: [],
    image: "/placeholder.svg"
  },
  {
    id: "457",
    firstName: "Wilhelm",
    lastName: "Melin",
    gender: "male",
    birthDate: "1890-12-31",
    deathDate: "1959-09-03",
    isDeceased: true,
    bio: "",
    fatherId: "407",
    motherId: null,
    spouseId: null,
    children: ["435", "437", "568", "573", "583"],
    image: "/placeholder.svg"
  },
  {
    id: "435",
    firstName: "Wilhelm",
    lastName: "Melin",
    gender: "male",
    birthDate: "1902-03-05",
    deathDate: null,
    isDeceased: false,
    bio: "",
    fatherId: "457",
    motherId: null,
    spouseId: null,
    children: [],
    image: "/placeholder.svg"
  },
  {
    id: "437",
    firstName: "Birgit",
    lastName: "Melin",
    gender: "female",
    birthDate: "1921-12-08",
    deathDate: null,
    isDeceased: false,
    bio: "",
    fatherId: "457",
    motherId: null,
    spouseId: null,
    children: [],
    image: "/placeholder.svg"
  },
  {
    id: "568",
    firstName: "Sven",
    lastName: "Melin",
    gender: "male",
    birthDate: "1903-08-21",
    deathDate: null,
    isDeceased: false,
    bio: "",
    fatherId: "457",
    motherId: null,
    spouseId: null,
    children: [],
    image: "/placeholder.svg"
  },
  {
    id: "573",
    firstName: "Torsten",
    lastName: "Melin",
    gender: "male",
    birthDate: "1905-02-15",
    deathDate: null,
    isDeceased: false,
    bio: "",
    fatherId: "457",
    motherId: null,
    spouseId: null,
    children: [],
    image: "/placeholder.svg"
  },
  {
    id: "583",
    firstName: "Margareta",
    lastName: "Melin",
    gender: "female",
    birthDate: null,
    deathDate: null,
    isDeceased: false,
    bio: "Also known as Greta",
    fatherId: "457",
    motherId: null,
    spouseId: null,
    children: [],
    image: "/placeholder.svg"
  },
  {
    id: "528",
    firstName: "Julius",
    lastName: "Melin",
    gender: "male",
    birthDate: "1892-11-05",
    deathDate: "1974-10-20",
    isDeceased: true,
    bio: "",
    fatherId: "407",
    motherId: null,
    spouseId: null,
    children: [],
    image: "/placeholder.svg"
  },
  {
    id: "542",
    firstName: "Ingeborg",
    lastName: "Melin",
    gender: "female",
    birthDate: "1898-05-09",
    deathDate: "1988-02-26",
    isDeceased: true,
    bio: "",
    fatherId: "407",
    motherId: null,
    spouseId: null,
    children: [],
    image: "/placeholder.svg"
  },
  {
    id: "548",
    firstName: "Anna",
    lastName: "Melin",
    gender: "female",
    birthDate: "1883-02-22",
    deathDate: "1894-12-01",
    isDeceased: true,
    bio: "",
    fatherId: "407",
    motherId: null,
    spouseId: null,
    children: [],
    image: "/placeholder.svg"
  },
  {
    id: "549",
    firstName: "Anna",
    lastName: "Melin",
    gender: "female",
    birthDate: "1896-12-29",
    deathDate: null,
    isDeceased: false,
    bio: "",
    fatherId: "407",
    motherId: null,
    spouseId: null,
    children: [],
    image: "/placeholder.svg"
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