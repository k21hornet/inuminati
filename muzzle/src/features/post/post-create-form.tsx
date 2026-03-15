"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/features/post/actions";

export function PostCreateForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!fd.get("image")) {
      setError("画像を選択してください");
      return;
    }
    setError("");
    startTransition(async () => {
      try {
        await createPost(fd);
      } catch (err) {
        if (err instanceof Error && err.message !== "NEXT_REDIRECT") {
          setError(err.message);
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      {/* 画像選択エリア */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition hover:bg-gray-100"
      >
        {preview ? (
          <Image src={preview} alt="プレビュー" fill className="object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <ImagePlus size={40} strokeWidth={1} />
            <span className="text-sm">タップして画像を選択</span>
          </div>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        name="image"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <Textarea
        name="caption"
        placeholder="キャプションを入力..."
        rows={3}
        className="resize-none"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={isPending || !preview}>
        {isPending ? "投稿中..." : "シェア"}
      </Button>
    </form>
  );
}
