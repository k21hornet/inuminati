"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deletePost } from "@/features/post/actions";

type Props = { postId: string };

export function DeletePostButton({ postId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("投稿を削除しますか？")) return;
    startTransition(async () => {
      await deletePost(postId);
      router.push("/feed");
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-red-500 disabled:opacity-40"
      aria-label="削除"
    >
      <Trash2 size={18} />
    </button>
  );
}
