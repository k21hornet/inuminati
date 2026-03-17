"use client";

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { Comment } from "@/lib/api/types";
import { createComment, deleteComment } from "./actions";

type Props = {
  postId: string;
  initialComments: Comment[];
  myUserId: string | null;
};

export function CommentSection({ postId, initialComments, myUserId }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const content = inputRef.current?.value.trim();
    if (!content) return;

    startTransition(async () => {
      const newComment = await createComment(postId, content).catch(() => null);
      if (newComment) {
        setComments((prev) => [...prev, newComment]);
        if (inputRef.current) inputRef.current.value = "";
      }
    });
  }

  function handleDelete(commentId: string) {
    startTransition(async () => {
      await deleteComment(commentId, postId).catch(() => null);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    });
  }

  return (
    <div className="px-3 py-2">
      {/* コメント一覧 */}
      {comments.length > 0 && (
        <ul className="space-y-1 mb-2">
          {comments.map((c) => (
            <li key={c.id} className="flex items-start justify-between gap-2">
              <p className="text-sm">
                <Link
                  href={`/users/${c.userId}`}
                  className="font-semibold mr-1 hover:underline"
                >
                  {c.username}
                </Link>
                {c.content}
              </p>
              {myUserId === c.userId && (
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={isPending}
                  className="shrink-0 text-gray-400 hover:text-red-500"
                  aria-label="コメントを削除"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* コメント入力フォーム */}
      {myUserId && (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t pt-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="コメントを追加..."
            className="flex-1 text-sm outline-none bg-transparent"
            disabled={isPending}
          />
          <button
            type="submit"
            disabled={isPending}
            className="text-sm font-semibold text-blue-500 disabled:opacity-50"
          >
            投稿
          </button>
        </form>
      )}
    </div>
  );
}
