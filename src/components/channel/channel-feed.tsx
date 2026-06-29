"use client";

import { useState } from "react";
import { useDemo } from "@/lib/demo/use-demo";
import { ChannelPostCard } from "@/components/channel/channel-post-card";
import { ChannelCommentsSheet } from "@/components/channel/channel-comments-sheet";
import type { ChannelPostView } from "@/lib/demo/state";

/** Kanal postlari ro'yxati + reaksiya/izoh/boshqaruv (store bilan ulangan). */
export function ChannelFeed({
  posts,
  showSeller = false,
  empty,
}: {
  posts: ChannelPostView[];
  showSeller?: boolean;
  empty?: React.ReactNode;
}) {
  const reactToPost = useDemo((s) => s.reactToPost);
  const pinPost = useDemo((s) => s.pinPost);
  const editPost = useDemo((s) => s.editPost);
  const deletePost = useDemo((s) => s.deletePost);
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
            onReact={reactToPost}
            onOpenComments={setCommentsPostId}
            onPin={pinPost}
            onEdit={editPost}
            onDelete={deletePost}
          />
        ))}
      </div>
      <ChannelCommentsSheet postId={commentsPostId} onClose={() => setCommentsPostId(null)} />
    </>
  );
}
