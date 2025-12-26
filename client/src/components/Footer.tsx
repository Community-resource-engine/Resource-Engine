import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border bg-accent/30">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Brand Column */}
          <div>
            <h3 className="text-lg font-semibold text-foreground">Community Resource Engine</h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Empowering communities with a smarter, data-driven approach to mental health resource discovery.
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="font-semibold text-foreground">Links</h4>
            <nav className="mt-4 flex flex-col gap-3">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                Home
              </Link>
              <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                Search
              </Link>
              <Link href="/research" className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                Research
              </Link>
            </nav>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-semibold text-foreground">Contact</h4>
            <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
              <p>School of Social Work</p>
              <p>Arizona State University</p>
              <a href="mailto:hyunsung@asu.edu" className="hover:text-foreground">
                hyunsung@asu.edu
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Arizona State University. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
