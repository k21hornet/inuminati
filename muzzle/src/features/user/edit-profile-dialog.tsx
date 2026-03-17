"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@/lib/api/types";
import { updateProfile } from "@/features/user/actions";

type Props = { user: User };

export function EditProfileDialog({ user }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError("");

    startTransition(async () => {
      try {
        await updateProfile(user.id, fd);
        setOpen(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "更新に失敗しました");
      }
    });
  }

  const avatarSrc = preview ?? user.avatarUrl;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-gray-50">
        プロフィールを編集
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>プロフィールを編集</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>アバター画像</Label>
            <div
              className="flex cursor-pointer flex-col items-center gap-2"
              onClick={() => inputRef.current?.click()}
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-100">
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt="avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-2xl font-semibold text-gray-400">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-xs text-blue-500">写真を変更</span>
            </div>
            <input
              ref={inputRef}
              type="file"
              name="avatar"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="username">ユーザー名</Label>
            <Input
              id="username"
              name="username"
              defaultValue={user.username}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="bio">自己紹介</Label>
            <Textarea id="bio" name="bio" defaultValue={user.bio} rows={3} />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? "保存中..." : "保存"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
