"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { likePost, unlikePost } from "./actions";

type Props = {
  postId: string;
  initialCount: number;
  initialIsLiked: boolean;
};

export function LikeButton({ postId, initialCount, initialIsLiked }: Props) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      if (isLiked) {
        setIsLiked(false);
        setCount((c) => c - 1);
        await unlikePost(postId).catch(() => {
          setIsLiked(true);
          setCount((c) => c + 1);
        });
      } else {
        setIsLiked(true);
        setCount((c) => c + 1);
        await likePost(postId).catch(() => {
          setIsLiked(false);
          setCount((c) => c - 1);
        });
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="flex items-center gap-1 text-sm"
      aria-label={isLiked ? "いいねを取り消す" : "いいねする"}
    >
      <Heart
        className={`h-6 w-6 transition-colors ${
          isLiked ? "fill-red-500 text-red-500" : "text-gray-700"
        }`}
      />
      {count > 0 && <span className="font-semibold">{count}</span>}
    </button>
  );
}
