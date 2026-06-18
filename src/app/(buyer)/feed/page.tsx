import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getFeedReels } from "@/lib/reels";
import { ReelsFeed } from "@/components/reels/reels-feed";

// Reels lentasi — vertikal, to'liq ekranli, swipe bilan o'tiladigan.
export default async function FeedPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const reels = await getFeedReels(user.id);

  return (
    <div className="h-full bg-black">
      <ReelsFeed initialReels={reels} />
    </div>
  );
}
