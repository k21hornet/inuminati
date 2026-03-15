"use client";

import { useState, useTransition } from "react";
import { followUser, unfollowUser } from "./actions";

type Props = {
  targetUserId: string;
  initialIsFollowing: boolean;
};

export function FollowButton({ targetUserId, initialIsFollowing }: Props) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      if (isFollowing) {
        setIsFollowing(false);
        await unfollowUser(targetUserId).catch(() => setIsFollowing(true));
      } else {
        setIsFollowing(true);
        await followUser(targetUserId).catch(() => setIsFollowing(false));
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`w-full rounded-md border px-4 py-1.5 text-sm font-semibold transition-colors ${
        isFollowing
          ? "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
          : "border-transparent bg-blue-500 text-white hover:bg-blue-600"
      } disabled:opacity-50`}
    >
      {isFollowing ? "フォロー中" : "フォロー"}
    </button>
  );
}
