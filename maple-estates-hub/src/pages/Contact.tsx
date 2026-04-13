import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { contactAPI } from "@/lib/api";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      await contactAPI.submit(form);
      setSuccess("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally { setLoading(false); }
  };

  const ic = "w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-heading font-bold mb-2">Contact Us</h1>
          <p className="text-muted-foreground">Get in touch with our team</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="font-heading font-semibold text-lg mb-4">Send a Message</h2>
              {success && <div className="mb-4 p-3 bg-green-500/10 text-green-400 text-sm rounded-lg">{success}</div>}
              {error && <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" className={ic} />
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" className={ic} />
                </div>
                <input required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Subject" className={ic} />
                <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Your message..." className={ic + " resize-none"} />
                <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : "Send Message"}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { icon: MapPin, title: "Office", detail: "DHA Phase 6, Main Boulevard, Lahore, Pakistan" },
              { icon: Phone, title: "Phone", detail: "+92 300 1234567" },
              { icon: Mail, title: "Email", detail: "info@maplerealestate.pk" },
              { icon: Clock, title: "Working Hours", detail: "Mon - Sat: 9:00 AM - 6:00 PM" },
            ].map(item => (
              <div key={item.title} className="glass-card p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}

            <div className="glass-card p-6">
              <h3 className="font-heading font-semibold mb-3">Location</h3>
              <div className="h-48 rounded-lg overflow-hidden">
                <iframe
                  title="Office Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=74.33%2C31.46%2C74.38%2C31.50&layer=mapnik&marker=31.4804%2C74.3587"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
