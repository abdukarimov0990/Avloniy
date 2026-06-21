"use client";

import { useState } from "react";
import { useDemo } from "@/lib/demo/use-demo";
import { ChannelPostCard } from "@/components/channel/channel-post-card";
import { ChannelCommentsSheet } from "@/components/channel/channel-comments-sheet";
import type { ChannelPostView } from "@/lib/demo/state";

/** Kanal postlari ro'yxati + like/izoh (store bilan ulangan). Qayta ishlatiladi. */
export function ChannelFeed({
  posts,
  showSeller = false,
  empty,
}: {
  posts: ChannelPostView[];
  showSeller?: boolean;
  empty?: React.ReactNode;
}) {
  const toggleLike = useDemo((s) => s.toggleChannelPostLike);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);

  if (posts.length === 0 && empty) return <>{empty}</>;

  return (
    <>
      <div className="flex flex-col gap-3">
        {posts.map((p) => (
          <ChannelPostCard
            key={p.id}
            post={p}
            showSeller={showSeller}
            onLike={toggleLike}
            onOpenComments={setCommentsPostId}
          />
        ))}
      </div>
      <ChannelCommentsSheet postId={commentsPostId} onClose={() => setCommentsPostId(null)} />
    </>
  );
}
