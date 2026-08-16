import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { FeedbackStatusControl } from "@/components/dashboard/FeedbackStatusControl";
import { FEEDBACK_STATUS_LABELS, FEEDBACK_STATUS_TONE } from "@/lib/display";
import { formatDateTime } from "@/lib/utils";
import type { FeedbackStatus } from "@/types/database";

export const metadata = { title: "Feedback" };

interface FeedbackRow {
  id: string;
  rating: number;
  message: string | null;
  status: FeedbackStatus;
  created_at: string;
  devices: { name: string } | null;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-gray-200">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default async function FeedbackPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?next=/dashboard/feedback");

  const supabase = createClient();
  const { data: feedback } = await supabase
    .from("feedback")
    .select("id, rating, message, status, created_at, devices!inner(name, user_id)")
    .eq("devices.user_id", currentUser.id)
    .order("created_at", { ascending: false })
    .limit(200)
    .returns<FeedbackRow[]>();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink-900">Feedback</h1>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        Ratings and messages guests leave on your Pro chooser page, alongside (not instead of) their
        public review. Use this to catch and follow up on anything that didn&apos;t make it to a
        public platform.
      </p>

      {!feedback || feedback.length === 0 ? (
        <div className="card mt-6 py-16 text-center text-sm text-gray-500">
          No feedback yet. It&apos;ll show up here as visitors rate their experience on your Pro
          chooser page.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {feedback.map((row) => (
            <div key={row.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Stars rating={row.rating} />
                  <p className="mt-1 text-xs text-gray-400">
                    {row.devices?.name ?? "Unknown device"} · {formatDateTime(row.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={FEEDBACK_STATUS_TONE[row.status]}>{FEEDBACK_STATUS_LABELS[row.status]}</Badge>
                  <FeedbackStatusControl id={row.id} status={row.status} />
                </div>
              </div>
              {row.message && <p className="mt-3 text-sm text-ink-900">{row.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
