import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, TrendingUp, Building, Home, Landmark, Star, ArrowRight, ChevronRight, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import { cities } from "@/data/mockData";
import { propertyAPI } from "@/lib/api";
import { Property } from "@/types";

const categories = [
  { label: "Houses", icon: Home, type: "house", count: 1250 },
  { label: "Apartments", icon: Building, type: "apartment", count: 890 },
  { label: "Plots", icon: MapPin, type: "plot", count: 560 },
  { label: "Commercial", icon: Landmark, type: "commercial", count: 340 },
  { label: "Villas", icon: Star, type: "villa", count: 120 },
];

const testimonials = [
  { name: "Hassan Ali", text: "Found my dream home in DHA through Maple. The filters made it so easy!", rating: 5 },
  { name: "Ayesha Khan", text: "Best real estate platform in Pakistan. Very professional agents.", rating: 5 },
  { name: "Bilal Ahmed", text: "Sold my property within 2 weeks. Highly recommended!", rating: 4 },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState("");
  const [searchPurpose, setSearchPurpose] = useState("buy");
  const [searchQuery, setSearchQuery] = useState("");
  const [featured, setFeatured] = useState<Property[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);

  useEffect(() => {
    propertyAPI.getAll({ featured: "true", limit: "8" })
      .then(async res => {
        if (res.data.data.length > 0) {
          setFeatured(res.data.data);
        } else {
          // Fallback: show latest approved properties if none are featured
          const latestRes = await propertyAPI.getAll({ limit: "8" });
          setFeatured(latestRes.data.data);
          setIsFeatured(false);
        }
      })
      .catch(() => setFeatured([]))
      .finally(() => setLoadingFeatured(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchPurpose) params.set("purpose", searchPurpose);
    if (searchCity) params.set("city", searchCity);
    if (searchQuery) params.set("q", searchQuery);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center justify-center section-padding overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card mb-6 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-primary" /> Over 10,000+ Premium Properties
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight">
            Find Your <span className="gradient-text">Perfect</span> Property
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Pakistan's most trusted real estate platform. Browse thousands of verified properties across all major cities.
          </p>

          <form onSubmit={handleSearch} className="glass-card p-3 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
                {["buy", "rent"].map(p => (
                  <button key={p} type="button" onClick={() => setSearchPurpose(p)}
                    className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${searchPurpose === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    {p}
                  </button>
                ))}
              </div>
              <select value={searchCity} onChange={e => setSearchCity(e.target.value)}
                className="bg-muted/50 rounded-lg px-3 py-2 text-sm outline-none flex-1 min-w-[140px]">
                <option value="">All Cities</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 flex-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input type="text" placeholder="Location, project, or keyword..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground" />
              </div>
              <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors whitespace-nowrap">
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding">
        <div className="container mx-auto">
          <h2 className="text-3xl font-heading font-bold mb-2">Browse by Category</h2>
          <p className="text-muted-foreground mb-8">Find the right property type for you</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map(cat => (
              <button key={cat.type} onClick={() => navigate(`/properties?type=${cat.type}`)}
                className="glass-card-hover p-6 text-center group">
                <cat.icon className="h-8 w-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                <p className="font-heading font-semibold text-sm">{cat.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{cat.count.toLocaleString()} listings</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">{isFeatured ? "Featured Properties" : "Latest Properties"}</h2>
              <p className="text-muted-foreground">{isFeatured ? "Handpicked premium listings" : "Recently added listings"}</p>
            </div>
            <button onClick={() => navigate("/properties")} className="hidden sm:flex items-center gap-1 text-sm text-primary hover:underline">
              View All <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          {loadingFeatured ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : featured.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No featured properties yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featured.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Popular Cities */}
      <section className="section-padding">
        <div className="container mx-auto">
          <h2 className="text-3xl font-heading font-bold mb-2">Popular Cities</h2>
          <p className="text-muted-foreground mb-8">Explore properties in top Pakistani cities</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cities.slice(0, 8).map((city, i) => (
              <button key={city} onClick={() => navigate(`/properties?city=${city}`)}
                className="glass-card-hover p-6 flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-heading font-semibold">{city}</p>
                  <p className="text-xs text-muted-foreground">{(1200 - i * 100).toLocaleString()}+ properties</p>
                </div>
                <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-heading font-bold mb-2 text-center">What Our Users Say</h2>
          <p className="text-muted-foreground text-center mb-10">Trusted by thousands of property seekers</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-accent text-accent" />)}
                </div>
                <p className="text-sm text-muted-foreground mb-4">"{t.text}"</p>
                <p className="font-heading font-semibold text-sm">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="glass-card p-10 md:p-16 text-center bg-gradient-to-br from-primary/10 to-accent/5">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Ready to List Your Property?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Join thousands of sellers and agents on Pakistan's fastest growing real estate platform.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate("/add-property")} className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Add Property
              </button>
              <button onClick={() => navigate("/contact")} className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium border border-border hover:bg-muted transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
