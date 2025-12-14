"use client";

import { MdFavoriteBorder } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import { likePost } from "@/actions/post";

type Props = {
  postId: string;
  likeCount: number;
  isLiked: boolean;
};

export default function LikeButton({ postId, likeCount, isLiked }: Props) {
  const handleLikeClick = async () => {
    await likePost(postId);
  };

  return (
    <div className="flex items-center gap-2" onClick={handleLikeClick}>
      {isLiked ? (
        <MdFavorite className="text-red-500 fill-red-500" />
      ) : (
        <MdFavoriteBorder />
      )}
      <span>{likeCount}</span>
    </div>
  );
}
