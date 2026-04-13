import { useState, useEffect } from "react";
import { Star, Loader2 } from "lucide-react";
import AgentLayout from "@/components/AgentLayout";
import { reviewAPI } from "@/lib/api";

interface Review {
  _id: string;
  user: { name: string } | string;
  property?: { title: string } | string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function AgentReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewAPI.getMyReviews()
      .then(res => setReviews(res.data.data || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AgentLayout><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AgentLayout>;

  const avgRating = reviews.length > 0 ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : "0.0";

  return (
    <AgentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Reviews</h1>
          <p className="text-sm text-muted-foreground">{reviews.length} reviews from clients</p>
        </div>

        {reviews.length > 0 && (
          <div className="glass-card p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-heading font-bold text-primary">{avgRating}</p>
              <div className="flex gap-0.5 justify-center mt-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`h-4 w-4 ${s <= Math.round(Number(avgRating)) ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{reviews.length} reviews</p>
            </div>
            <div className="flex-1 space-y-2 w-full">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = reviews.filter(r => r.rating === rating).length;
                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-2 text-sm">
                    <span className="w-4 text-right text-muted-foreground">{rating}</span>
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-6 text-xs text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => {
              const userName = typeof r.user === "object" ? r.user.name : "User";
              const propTitle = typeof r.property === "object" ? r.property?.title : null;
              return (
                <div key={r._id} className="glass-card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                        {userName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{userName}</p>
                        <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{r.comment}</p>
                  {propTitle && <p className="text-xs text-primary">Property: {propTitle}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AgentLayout>
  );
}
