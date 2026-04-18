import { Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function ReviewsList({
  reviews,
}: {
  reviews: Array<{
    id: string;
    title: string;
    body: string;
    rating: number;
    authorName: string;
    verifiedPurchase: boolean;
    createdAt: Date;
  }>;
}) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <article key={review.id} className="rounded-[24px] border border-border/70 bg-panel/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${index < review.rating ? "fill-current" : "text-foreground/20"}`}
                  />
                ))}
              </div>
              <h3 className="mt-3 text-base font-semibold text-foreground">{review.title}</h3>
            </div>
            <div className="text-right text-xs text-muted">
              <p>{review.authorName}</p>
              <p>{formatDate(review.createdAt)}</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">{review.body}</p>
          {review.verifiedPurchase ? (
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-accent">Verified purchase</p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
