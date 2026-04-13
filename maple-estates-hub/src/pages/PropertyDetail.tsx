import { useParams, Link } from "react-router-dom";
import { MapPin, Bed, Bath, Maximize, Phone, Mail, Star, ChevronLeft, ChevronRight, Heart, Share2, CheckCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PropertyCard, { formatPrice, getImageUrl } from "@/components/PropertyCard";
import { propertyAPI, inquiryAPI } from "@/lib/api";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { Property } from "@/types";

const cityCoords: Record<string, [number, number]> = {
  lahore: [31.5204, 74.3587],
  karachi: [24.8607, 67.0011],
  islamabad: [33.6844, 73.0479],
  rawalpindi: [33.5651, 73.0169],
  faisalabad: [31.4504, 73.1350],
  multan: [30.1575, 71.5249],
  peshawar: [34.0151, 71.5249],
  quetta: [30.1798, 66.9750],
  sialkot: [32.4945, 74.5229],
  gujranwala: [32.1877, 74.1945],
  hyderabad: [25.3960, 68.3578],
  bahawalpur: [29.3956, 71.6836],
};

const getMapUrl = (city: string) => {
  const key = city?.toLowerCase().trim();
  const [lat, lng] = cityCoords[key] || [30.3753, 69.3451]; // Pakistan center fallback
  const d = 0.05;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`;
};

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [inquiryMsg, setInquiryMsg] = useState("I'm interested in this property...");
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await propertyAPI.getById(id!);
        setProperty(res.data.data);
        // Fetch similar
        const simRes = await propertyAPI.getAll({ city: res.data.data.city, limit: "5" });
        setSimilar(simRes.data.data.filter((p: Property) => p._id !== id).slice(0, 4));
      } catch {
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetch();
  }, [id]);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !property) return;
    setInquiryLoading(true);
    try {
      await inquiryAPI.create({ propertyId: property._id, message: inquiryMsg });
      setInquirySent(true);
    } catch { /* ignore */ }
    setInquiryLoading(false);
  };

  if (loading) return <Layout><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></Layout>;
  if (!property) return <Layout><div className="container mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-heading font-bold">Property not found</h1></div></Layout>;

  const agent = typeof property.agent === "object" ? property.agent : null;
  const fav = isFavorite(property._id);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Gallery */}
        <div className="relative rounded-xl overflow-hidden mb-8 h-[300px] md:h-[500px]">
          <img src={getImageUrl(property.images?.[currentImg])} alt={property.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          {property.images?.length > 1 && (
            <>
              <button onClick={() => setCurrentImg(i => (i - 1 + property.images.length) % property.images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 glass-card hover:bg-card/80"><ChevronLeft className="h-5 w-5" /></button>
              <button onClick={() => setCurrentImg(i => (i + 1) % property.images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 glass-card hover:bg-card/80"><ChevronRight className="h-5 w-5" /></button>
            </>
          )}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className="px-3 py-1 text-sm font-medium bg-primary text-primary-foreground rounded-md capitalize">{property.purpose}</span>
            <span className="px-3 py-1 text-sm font-medium bg-accent text-accent-foreground rounded-md capitalize">{property.type}</span>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={() => toggleFavorite(property._id)} className={`p-2 rounded-full ${fav ? "bg-destructive text-destructive-foreground" : "glass-card"}`}>
              <Heart className={`h-5 w-5 ${fav ? "fill-current" : ""}`} />
            </button>
            <button className="p-2 glass-card"><Share2 className="h-5 w-5" /></button>
          </div>
          {property.images?.length > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-1">
              {property.images.map((_, i) => (
                <button key={i} onClick={() => setCurrentImg(i)} className={`w-2 h-2 rounded-full ${i === currentImg ? "bg-primary" : "bg-foreground/50"}`} />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-heading font-bold mb-2">{property.title}</h1>
              <p className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" /> {property.location}, {property.city}</p>
            </div>

            <div className="text-3xl font-heading font-bold text-primary">
              {formatPrice(property.price)}{property.purpose === "rent" ? <span className="text-base text-muted-foreground font-normal">/month</span> : ""}
            </div>

            <div className="flex gap-6 flex-wrap">
              {property.bedrooms > 0 && <div className="glass-card px-4 py-3 flex items-center gap-2"><Bed className="h-5 w-5 text-primary" /><div><p className="text-xs text-muted-foreground">Beds</p><p className="font-semibold">{property.bedrooms}</p></div></div>}
              {property.bathrooms > 0 && <div className="glass-card px-4 py-3 flex items-center gap-2"><Bath className="h-5 w-5 text-primary" /><div><p className="text-xs text-muted-foreground">Baths</p><p className="font-semibold">{property.bathrooms}</p></div></div>}
              {property.area > 0 && <div className="glass-card px-4 py-3 flex items-center gap-2"><Maximize className="h-5 w-5 text-primary" /><div><p className="text-xs text-muted-foreground">Area</p><p className="font-semibold">{property.area} {property.areaUnit}</p></div></div>}
            </div>

            <div className="glass-card p-6">
              <h2 className="font-heading font-semibold text-lg mb-3">Description</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{property.description}</p>
            </div>

            {property.features?.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="font-heading font-semibold text-lg mb-3">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-primary" /> {f}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="glass-card p-6">
              <h2 className="font-heading font-semibold text-lg mb-3">Location</h2>
              <div className="h-64 rounded-lg overflow-hidden">
                <iframe
                  title="Property Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={getMapUrl(property.city)}
                />
              </div>
              <p className="flex items-center gap-1 text-sm text-muted-foreground mt-3"><MapPin className="h-4 w-4" /> {property.location}, {property.city}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {agent && (
              <div className="glass-card p-6">
                <h3 className="font-heading font-semibold mb-4">Listed By</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
                    {agent.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <a href={`mailto:${agent.email}`} className="flex items-center gap-2 w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors justify-center">
                    <Mail className="h-4 w-4" /> Email Agent
                  </a>
                </div>
              </div>
            )}

            <div className="glass-card p-6">
              <h3 className="font-heading font-semibold mb-4">Send Inquiry</h3>
              {inquirySent ? (
                <div className="text-center py-4">
                  <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-green-400 font-medium">Inquiry sent successfully!</p>
                </div>
              ) : user ? (
                <form className="space-y-3" onSubmit={handleInquiry}>
                  <textarea value={inquiryMsg} onChange={e => setInquiryMsg(e.target.value)} rows={3} className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary resize-none" required />
                  <button type="submit" disabled={inquiryLoading} className="w-full py-2.5 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50">
                    {inquiryLoading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              ) : (
                <p className="text-sm text-muted-foreground text-center"><Link to="/login" className="text-primary hover:underline">Sign in</Link> to send an inquiry</p>
              )}
            </div>
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-heading font-bold mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similar.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
