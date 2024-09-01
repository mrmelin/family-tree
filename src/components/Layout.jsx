import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, Search, User } from "lucide-react";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={`w-64 bg-card text-card-foreground p-4 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <nav className="space-y-2">
          <Link to="/" className="block py-2 px-4 rounded hover:bg-accent">Släktträd</Link>
          <Link to="/add-member" className="block py-2 px-4 rounded hover:bg-accent">Lägg till medlem</Link>
          <Link to="/timeline" className="block py-2 px-4 rounded hover:bg-accent">Tidslinje</Link>
          <Link to="/gallery" className="block py-2 px-4 rounded hover:bg-accent">Mediagalleri</Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card text-card-foreground shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">Melin Släktträd</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <Input type="search" placeholder="Sök..." className="w-64" />
              </div>
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5 md:hidden" />
              </Button>
              <ModeToggle />
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
