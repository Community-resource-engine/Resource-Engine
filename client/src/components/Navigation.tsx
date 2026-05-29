import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/search", label: "Find Care" },
    { href: "/insights", label: "Data Insights" },
    { href: "/lab-introduction", label: "Lab Introduction" },
    { href: "/contact", label: "Feedback" },
  ];

  return (
    <>
      <div className="h-1 w-full bg-primary" />

      <nav className="sticky top-0 z-50 border-b border-border/40 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-[#8C1D40]">
              <span className="text-xs font-bold text-white">ASU</span>
            </div>
            <span className="text-lg font-semibold text-foreground">CareConnectAZ</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
                  location === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/search">
              <Button size="default" className="ml-4 rounded-full px-6 py-2 text-base font-medium shadow-sm">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t bg-white px-6 py-4 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block py-2 text-sm font-medium transition-colors cursor-pointer",
                  location === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/search">
              <Button size="default" className="mt-4 w-full rounded-full text-base py-6">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
