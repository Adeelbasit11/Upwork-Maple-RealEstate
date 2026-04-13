import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Maple Real Estate</h3>
            <p className="text-sm text-muted-foreground mb-4">Pakistan's premium property platform for buying, selling, and renting real estate.</p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-muted/50 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[["Buy Property", "/properties?purpose=buy"], ["Rent Property", "/properties?purpose=rent"], ["Add Listing", "/add-property"], ["Agents", "/agents"], ["About Us", "/about"]].map(([l, h]) => (
                <Link key={l} to={h} className="block text-sm text-muted-foreground hover:text-primary transition-colors">{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Popular Cities</h4>
            <div className="space-y-2">
              {["Lahore", "Islamabad", "Karachi", "Rawalpindi", "Faisalabad"].map(c => (
                <Link key={c} to={`/properties?city=${c}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors">{c}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> DHA Phase 6, Lahore</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +92 300 1234567</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> info@maplerealestate.pk</div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
          © 2025 Maple Real Estate. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
