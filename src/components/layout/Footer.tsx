import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-secondary/40 mt-16">
    <div className="container-tight py-10 grid gap-8 md:grid-cols-3">
      <div>
        <h3 className="text-base font-semibold text-primary">Shree Classes</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Quality education in a nurturing environment. English & Marathi medium tuitions for Std 3–10.
        </p>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-primary">Contact</h4>
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /> Birla College area, Kalyan West</li>
          <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 9867897622</li>
          <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> shreeclasses@gmail.com</li>
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-primary">Quick Links</h4>
        <ul className="mt-2 space-y-1.5 text-sm">
          <li><Link to="/courses" className="text-muted-foreground hover:text-primary">Courses</Link></li>
          <li><Link to="/about" className="text-muted-foreground hover:text-primary">About</Link></li>
          <li><Link to="/announcements" className="text-muted-foreground hover:text-primary">Announcements</Link></li>
          <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border">
      <div className="container-tight py-4 text-xs text-muted-foreground text-center">
        © {new Date().getFullYear()} Shree Classes. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
