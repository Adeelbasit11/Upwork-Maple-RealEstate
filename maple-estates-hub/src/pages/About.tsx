import { Building, Users, Shield, Award } from "lucide-react";
import Layout from "@/components/Layout";

export default function AboutPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-heading font-bold mb-4">About <span className="gradient-text">Maple Real Estate</span></h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Pakistan's leading digital real estate platform, connecting buyers, sellers, and agents with trusted property listings across major cities.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Properties Listed", value: "10,000+", icon: Building },
            { label: "Happy Clients", value: "25,000+", icon: Users },
            { label: "Verified Agents", value: "500+", icon: Shield },
            { label: "Cities Covered", value: "15+", icon: Award },
          ].map(s => (
            <div key={s.label} className="glass-card p-6 text-center">
              <s.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
              <p className="text-2xl font-heading font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 max-w-5xl mx-auto">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-heading font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">To revolutionize Pakistan's real estate market by providing a transparent, reliable, and modern platform where every Pakistani can find their perfect property with confidence and ease.</p>
          </div>
          <div className="glass-card p-8">
            <h2 className="text-2xl font-heading font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">To become the most trusted name in Pakistani real estate, leveraging technology to simplify property transactions and empower buyers, sellers, and agents with the tools they need.</p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">Why Choose Maple?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
            {[
              { title: "Verified Listings", desc: "Every property is verified by our team for authenticity." },
              { title: "Expert Agents", desc: "Work with professional, vetted real estate agents." },
              { title: "Advanced Search", desc: "Find exactly what you need with powerful filters and map search." },
            ].map(f => (
              <div key={f.title} className="glass-card p-6">
                <h3 className="font-heading font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
