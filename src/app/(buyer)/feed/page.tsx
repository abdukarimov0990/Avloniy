"use client";

import { ReelsFeed } from "@/components/reels/reels-feed";

// Reels lentasi — vertikal, to'liq ekranli, swipe bilan o'tiladigan (store'dan o'qiydi).
export default function FeedPage() {
  return (
    <div className="h-full bg-black lg:mx-auto lg:max-w-[460px]">
      <ReelsFeed />
    </div>
  );
}
