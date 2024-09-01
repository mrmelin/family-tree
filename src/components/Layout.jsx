import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, Search, User, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const Layout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const NavLinks = ({ onLinkClick }) => (
    <nav className="space-y-2">
      <Link to="/" className="block py-2 px-4 rounded hover:bg-accent" onClick={onLinkClick}>Släktträd</Link>
      <Link to="/add-member" className="block py-2 px-4 rounded hover:bg-accent" onClick={onLinkClick}>Lägg till medlem</Link>
      <Link to="/timeline" className="block py-2 px-4 rounded hover:bg-accent" onClick={onLinkClick}>Tidslinje</Link>
      <Link to="/gallery" className="block py-2 px-4 rounded hover:bg-accent" onClick={onLinkClick}>Mediagalleri</Link>
    </nav>
  );

  return (
    <div className="flex h-screen bg-background">
      {!isMobile && (
        <aside className="w-64 bg-card text-card-foreground p-4">
          <NavLinks />
        </aside>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card text-card-foreground shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              {isMobile && (
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="mr-2">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64 p-0">
                    <div className="flex justify-end p-4">
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon">
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetClose>
                    </div>
                    <NavLinks onLinkClick={() => setIsMenuOpen(false)} />
                  </SheetContent>
                </Sheet>
              )}
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
