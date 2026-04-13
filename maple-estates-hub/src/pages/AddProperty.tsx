import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Plus, Loader2, X } from "lucide-react";
import Layout from "@/components/Layout";
import { cities, propertyTypes } from "@/data/mockData";
import { propertyAPI, uploadAPI, UPLOADS_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "", description: "", price: "", location: "", city: "", type: "house", purpose: "buy",
    bedrooms: "", bathrooms: "", area: "", areaUnit: "sq ft", features: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));
  const inputClass = "w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary";

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(f => formData.append("images", f));
      const res = await uploadAPI.uploadImages(formData);
      setImages(prev => [...prev, ...(res.data.data.imageUrls || [])]);
    } catch { setError("Image upload failed"); }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setError("Please sign in first"); return; }
    setLoading(true); setError("");
    try {
      await propertyAPI.create({
        title: form.title, description: form.description, purpose: form.purpose,
        type: form.type, price: Number(form.price), city: form.city, location: form.location,
        bedrooms: Number(form.bedrooms) || 0, bathrooms: Number(form.bathrooms) || 0,
        area: Number(form.area) || 0, areaUnit: form.areaUnit, images,
        features: form.features ? form.features.split(",").map(f => f.trim()) : [],
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit property");
    } finally { setLoading(false); }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-heading font-bold mb-2">Add Property</h1>
        <p className="text-sm text-muted-foreground mb-8">Fill in the details to list your property</p>

        {error && <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-heading font-semibold">Basic Info</h2>
            <div><label className="text-xs text-muted-foreground">Title</label><input value={form.title} onChange={e => update("title", e.target.value)} placeholder="e.g. 5 Marla House in DHA" className={inputClass} required /></div>
            <div><label className="text-xs text-muted-foreground">Description</label><textarea value={form.description} onChange={e => update("description", e.target.value)} rows={4} placeholder="Describe your property..." className={inputClass + " resize-none"} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-muted-foreground">Purpose</label>
                <select value={form.purpose} onChange={e => update("purpose", e.target.value)} className={inputClass}><option value="buy">Sell</option><option value="rent">Rent</option></select></div>
              <div><label className="text-xs text-muted-foreground">Type</label>
                <select value={form.type} onChange={e => update("type", e.target.value)} className={inputClass}>{propertyTypes.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}</select></div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="font-heading font-semibold">Location & Price</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-muted-foreground">City</label>
                <select value={form.city} onChange={e => update("city", e.target.value)} className={inputClass} required><option value="">Select</option>{cities.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className="text-xs text-muted-foreground">Location</label><input value={form.location} onChange={e => update("location", e.target.value)} placeholder="e.g. DHA Phase 6" className={inputClass} required /></div>
            </div>
            <div><label className="text-xs text-muted-foreground">Price (PKR)</label><input type="number" value={form.price} onChange={e => update("price", e.target.value)} placeholder="e.g. 50000000" className={inputClass} required /></div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="font-heading font-semibold">Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><label className="text-xs text-muted-foreground">Bedrooms</label><input type="number" value={form.bedrooms} onChange={e => update("bedrooms", e.target.value)} className={inputClass} /></div>
              <div><label className="text-xs text-muted-foreground">Bathrooms</label><input type="number" value={form.bathrooms} onChange={e => update("bathrooms", e.target.value)} className={inputClass} /></div>
              <div><label className="text-xs text-muted-foreground">Area</label><input type="number" value={form.area} onChange={e => update("area", e.target.value)} className={inputClass} /></div>
              <div><label className="text-xs text-muted-foreground">Unit</label>
                <select value={form.areaUnit} onChange={e => update("areaUnit", e.target.value)} className={inputClass}>
                  {["sq ft", "sq yd", "marla", "kanal"].map(u => <option key={u} value={u}>{u}</option>)}
                </select></div>
            </div>
            <div><label className="text-xs text-muted-foreground">Features (comma-separated)</label><input value={form.features} onChange={e => update("features", e.target.value)} placeholder="Parking, Garden, Security" className={inputClass} /></div>
          </div>

          <div className="glass-card p-6">
            <h2 className="font-heading font-semibold mb-4">Images</h2>
            <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/50 transition-colors cursor-pointer">
              {uploading ? <Loader2 className="h-8 w-8 mx-auto mb-3 text-primary animate-spin" /> : <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />}
              <p className="text-sm text-muted-foreground">Drag & drop images or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB each</p>
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20">
                    <img src={img.startsWith("/") ? `${UPLOADS_URL}${img}` : img} className="w-full h-full object-cover rounded-lg" />
                    <button type="button" onClick={() => setImages(prev => prev.filter((_, j) => j !== i))} className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <><Plus className="h-4 w-4" /> Submit Property</>}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 bg-secondary border border-border rounded-lg font-medium hover:bg-muted transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
