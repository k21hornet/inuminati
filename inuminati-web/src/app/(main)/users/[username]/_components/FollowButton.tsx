"use client";

import { followUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Props = {
  targetUserName: string;
  isFollowing: boolean;
};

export default function FollowButton({
  targetUserName,
  isFollowing: initialIsFollowing,
}: Props) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  const handleFollow = async () => {
    await followUser(targetUserName);
    setIsFollowing(!isFollowing);
  };

  return (
    <Button className="flex-1 lg:w-48" onClick={handleFollow}>
      {isFollowing ? "フォロー中" : "フォローする"}
    </Button>
  );
}
