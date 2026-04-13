import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, Building, MapPin, FileText, Upload, CheckCircle, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import logo from "@/assets/logo.png";
import { agentAPI, uploadAPI, UPLOADS_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AgentRegister() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", agency: "", city: "", experience: "", cnic: "", bio: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
          <div className="glass-card p-10 w-full max-w-lg text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <h1 className="text-2xl font-heading font-bold mb-3">Application Submitted!</h1>
            <p className="text-muted-foreground mb-2">
              Your agent registration request has been submitted successfully.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Our admin team will review your application and verify your credentials. 
              You'll receive a confirmation once approved. This usually takes 1-2 business days.
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Go Home
              </Link>
              <Link to="/agents" className="px-6 py-2.5 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors border border-border">
                View Agents
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="glass-card p-8 w-full max-w-2xl">
          <div className="text-center mb-8">
            <img src={logo} alt="Maple" className="h-14 w-14 mx-auto mb-4" width={56} height={56} />
            <h1 className="text-2xl font-heading font-bold">Register as Agent</h1>
            <p className="text-sm text-muted-foreground mt-1">Join Maple Real Estate as a verified property agent</p>
          </div>

          {error && <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}
          {!user && <div className="mb-4 p-3 bg-accent/10 text-accent-foreground text-sm rounded-lg">Please <Link to="/login" className="text-primary hover:underline font-medium">sign in</Link> first to apply as an agent.</div>}

          <form className="space-y-4" onSubmit={async e => {
            e.preventDefault();
            if (!user) { setError("Please sign in first"); return; }
            setLoading(true); setError("");
            try {
              // Upload avatar first if selected
              let avatarUrl = "";
              if (avatarFile) {
                setUploading(true);
                const uploadRes = await uploadAPI.avatar(avatarFile);
                avatarUrl = uploadRes.data.data.imageUrl;
                setUploading(false);
              }
              await agentAPI.apply({
                agencyName: form.agency,
                experience: Number(form.experience),
                location: form.city,
                phone: form.phone,
                bio: form.bio,
                ...(avatarUrl && { avatar: avatarUrl }),
              });
              setSubmitted(true);
            } catch (err: any) {
              setUploading(false);
              setError(err.response?.data?.message || "Failed to submit application");
            } finally { setLoading(false); }
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-xs text-muted-foreground mb-1 block">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input name="name" value={form.name} onChange={handleChange} required type="text" placeholder="Ahmed Khan"
                    className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="ahmed@email.com"
                    className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Phone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input name="phone" value={form.phone} onChange={handleChange} required type="tel" placeholder="+92 300 1234567"
                    className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Agency / Company *</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input name="agency" value={form.agency} onChange={handleChange} required type="text" placeholder="Maple Properties"
                    className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">City *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select name="city" value={form.city} onChange={handleChange} required
                    className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary appearance-none">
                    <option value="">Select City</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Peshawar">Peshawar</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Experience (Years) *</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input name="experience" value={form.experience} onChange={handleChange} required type="number" min="0" placeholder="5"
                    className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">CNIC Number *</label>
              <input name="cnic" value={form.cnic} onChange={handleChange} required type="text" placeholder="35201-1234567-1"
                className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">About Yourself</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} placeholder="Tell us about your experience in real estate..."
                className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary resize-none" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Upload Profile Photo</label>
              <label className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                <input type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5MB"); return; }
                    setAvatarFile(file);
                    setAvatarPreview(URL.createObjectURL(file));
                  }
                }} />
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-20 h-20 rounded-full mx-auto object-cover" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                  </>
                )}
              </label>
            </div>

            <div className="flex items-start gap-2 p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <input type="checkbox" required className="mt-1 accent-primary" />
              <p className="text-xs text-muted-foreground">
                I confirm that all information provided is accurate. I understand my application will be reviewed by the admin team and I'll be notified upon approval.
              </p>
            </div>

            <button type="submit" disabled={loading || uploading} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {uploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading Photo...</> : loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : "Submit Application"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already registered?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
