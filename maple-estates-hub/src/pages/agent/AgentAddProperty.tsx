import { useState, useRef } from "react";
import { Upload, MapPin, CheckCircle, Loader2, X } from "lucide-react";
import AgentLayout from "@/components/AgentLayout";
import { cities, propertyTypes } from "@/data/mockData";
import { propertyAPI, uploadAPI, UPLOADS_URL } from "@/lib/api";

export default function AgentAddProperty() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "", description: "", purpose: "buy", type: "house", price: "",
    city: "", location: "", bedrooms: "", bathrooms: "", area: "", areaUnit: "sq ft",
    features: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
    setLoading(true); setError("");
    try {
      await propertyAPI.create({
        title: form.title,
        description: form.description,
        purpose: form.purpose,
        type: form.type,
        price: Number(form.price),
        city: form.city,
        location: form.location,
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        area: Number(form.area) || 0,
        areaUnit: form.areaUnit,
        images,
        features: form.features ? form.features.split(",").map(f => f.trim()) : [],
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create property");
    } finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <AgentLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <h2 className="text-xl font-heading font-bold mb-2">Property Submitted!</h2>
            <p className="text-sm text-muted-foreground mb-6">Your property listing has been submitted for admin review.</p>
            <button onClick={() => { setSubmitted(false); setForm({ title: "", description: "", purpose: "buy", type: "house", price: "", city: "", location: "", bedrooms: "", bathrooms: "", area: "", areaUnit: "sq ft", features: "" }); setImages([]); }} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
              Add Another Property
            </button>
          </div>
        </div>
      </AgentLayout>
    );
  }

  return (
    <AgentLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-heading font-bold">Add New Property</h1>
          <p className="text-sm text-muted-foreground">Fill in the details to list a new property</p>
        </div>

        {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-heading font-semibold">Basic Information</h2>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Property Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required type="text" placeholder="e.g. Luxury Villa in DHA Phase 6" className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Describe the property..." className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary resize-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Purpose *</label>
                <select name="purpose" value={form.purpose} onChange={handleChange} required className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary">
                  <option value="buy">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Type *</label>
                <select name="type" value={form.type} onChange={handleChange} required className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary capitalize">
                  {propertyTypes.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Price (PKR) *</label>
                <input name="price" value={form.price} onChange={handleChange} required type="number" placeholder="50000000" className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="font-heading font-semibold">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">City *</label>
                <select name="city" value={form.city} onChange={handleChange} required className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary">
                  <option value="">Select City</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Location / Area *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input name="location" value={form.location} onChange={handleChange} required type="text" placeholder="DHA Phase 6" className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="font-heading font-semibold">Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Bedrooms</label>
                <input name="bedrooms" value={form.bedrooms} onChange={handleChange} type="number" min="0" placeholder="3" className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Bathrooms</label>
                <input name="bathrooms" value={form.bathrooms} onChange={handleChange} type="number" min="0" placeholder="2" className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Area</label>
                <input name="area" value={form.area} onChange={handleChange} type="number" min="0" placeholder="2200" className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Unit</label>
                <select name="areaUnit" value={form.areaUnit} onChange={handleChange} className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary">
                  <option>sq ft</option>
                  <option>sq yd</option>
                  <option>marla</option>
                  <option>kanal</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Features (comma-separated)</label>
              <input name="features" value={form.features} onChange={handleChange} type="text" placeholder="Parking, Garden, Security" className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="font-heading font-semibold">Images</h2>
            <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              {uploading ? <Loader2 className="h-10 w-10 mx-auto text-primary mb-3 animate-spin" /> : <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />}
              <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB each • Max 10 images</p>
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2">
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

          <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : "Submit for Review"}
          </button>
        </form>
      </div>
    </AgentLayout>
  );
}
