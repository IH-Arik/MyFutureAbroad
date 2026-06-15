import React, { useEffect, useState, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon, Delete02Icon } from "@hugeicons/core-free-icons";
import { useAuth } from "@/components/auth-context";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";
import type { ServiceReview } from "@/lib/types";

const REVIEWS_PER_PAGE = 10;

interface Props {
  serviceId: string;
  providerId?: string | null;
}

export const ServiceReviews: React.FC<Props> = ({ serviceId, providerId }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number | null>(null);
  const [body, setBody] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReviews = useCallback(async (append = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);

    try {
      const from = append ? reviews.length : 0;
      const to = from + REVIEWS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from("service_reviews")
        .select("*, profile:profiles!client_id(id, full_name, avatar_url)", { count: "exact" })
        .eq("service_id", serviceId)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      const typed = (data as unknown as ServiceReview[]) || [];
      if (append) {
        setReviews((prev) => [...prev, ...typed]);
      } else {
        setReviews(typed);
      }

      if (count !== null) {
        setHasMore((append ? reviews.length + typed.length : typed.length) < count);
      } else {
        setHasMore(typed.length === REVIEWS_PER_PAGE);
      }
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [serviceId, reviews.length]);

  useEffect(() => {
    fetchReviews(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

  const submit = async () => {
    if (!user) return;
    if (rating < 1 || rating > 5) return;
    setSubmitting(true);
    try {
      const { data: serviceData } = await supabase
        .from("services")
        .select("provider_id")
        .eq("id", serviceId)
        .single();

      const pid = providerId || serviceData?.provider_id || null;

      const { data: created, error } = await supabase
        .from("service_reviews")
        .insert({
          service_id: serviceId,
          provider_id: pid,
          client_id: user.id,
          rating,
          body: body || null,
        })
        .select("*, profile:profiles!client_id(id, full_name, avatar_url)")
        .single();

      if (error) throw error;

      setReviews((prev) => [created as unknown as ServiceReview, ...prev]);
      setRating(0);
      setBody("");
      setHasMore(true);
    } catch (err) {
      console.error("Submit review failed", err);
      alert((err as Error).message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!user) return;
    if (!confirm(t("reviews.delete_confirm", "Are you sure you want to delete your review?"))) return;
    setDeletingId(reviewId);
    try {
      const { error } = await supabase
        .from("service_reviews")
        .delete()
        .eq("id", reviewId)
        .eq("client_id", user.id);

      if (error) throw error;

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error("Delete review failed", err);
      alert((err as Error).message || "Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-white/10 p-8 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{t("reviews.title", "Reviews")}</h3>

      {/* Review form - show if user is signed in */}
      {user && (
        <div className="mb-8 p-5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
            {t("reviews.write_review", "Write a review")}
          </p>
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHover(i + 1)}
                onMouseLeave={() => setHover(null)}
                className="p-0.5 transition-transform hover:scale-110"
                aria-label={`Rate ${i + 1} stars`}
              >
                <HugeiconsIcon
                  icon={StarIcon}
                  className={`w-7 h-7 ${i < (hover ?? rating) ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-xs text-slate-400">
                ({rating}/5)
              </span>
            )}
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t("reviews.optional_comment", "Optional comment...")}
            className="w-full rounded-lg border border-slate-200 dark:border-white/10 p-3 mb-3 text-sm bg-white dark:bg-[#121212] text-slate-900 dark:text-white placeholder-slate-400 resize-none"
            rows={3}
          />
          <div className="flex justify-end">
            <button
              onClick={submit}
              disabled={submitting || rating < 1}
              className="rounded-lg bg-[#1f4865] hover:bg-[#173b55] text-white px-5 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting
                ? t("reviews.submitting", "Submitting...")
                : t("reviews.submit", "Submit review")}
            </button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-4">
        {loading && (
          <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
            {t("reviews.loading", "Loading reviews...")}
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
            {t("reviews.no_reviews", "No reviews yet. Be the first to review!")}
          </div>
        )}

        {reviews.map((r) => {
          const isOwn = user && r.client_id === user.id;
          return (
            <div
              key={r.id}
              className="rounded-xl border border-slate-100 dark:border-white/10 p-5 bg-white dark:bg-[#0d0d0d]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 flex-shrink-0 overflow-hidden">
                      {r.profile?.avatar_url ? (
                        <img src={r.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        (r.profile?.full_name || r.client_id).substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-sm text-slate-900 dark:text-white truncate">
                        {r.profile?.full_name || r.client_id.slice(0, 8)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(r.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <HugeiconsIcon
                        key={i}
                        icon={StarIcon}
                        className={`w-4 h-4 ${i < r.rating ? "text-amber-400" : "text-slate-200 dark:text-slate-700"}`}
                      />
                    ))}
                    <span className="text-xs text-slate-400 ml-1">({r.rating}/5)</span>
                  </div>
                  {r.body && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                      {r.body}
                    </p>
                  )}
                </div>

                {/* Delete button - only for the review author */}
                {isOwn && (
                  <button
                    onClick={() => deleteReview(r.id)}
                    disabled={deletingId === r.id}
                    className="flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    aria-label="Delete review"
                    title="Delete review"
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Load more pagination */}
        {hasMore && !loading && (
          <div className="text-center pt-2">
            <button
              onClick={() => fetchReviews(true)}
              disabled={loadingMore}
              className="text-sm text-[#1f4865] hover:text-[#173b55] dark:text-sky-400 dark:hover:text-sky-300 font-medium disabled:opacity-50 transition-colors"
            >
              {loadingMore
                ? t("reviews.loading_more", "Loading more...")
                : t("reviews.load_more", "Load more reviews")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceReviews;
