import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Post, User } from "@/lib/api/types";

type Props = {
  post: Post;
  author?: User;
};

export function PostCard({ post, author }: Props) {
  return (
    <article className="border-b">
      {/* ヘッダー: アバター + ユーザー名 */}
      <div className="flex items-center gap-2 px-3 py-2">
        <Link href={`/users/${post.userId}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={author?.avatarUrl} alt={author?.username} />
            <AvatarFallback className="text-xs">
              {author?.username?.charAt(0).toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
        </Link>
        <Link
          href={`/users/${post.userId}`}
          className="text-sm font-semibold hover:underline"
        >
          {author?.username ?? post.userId}
        </Link>
      </div>

      {/* 画像 (正方形) */}
      <Link href={`/posts/${post.id}`}>
        <div className="relative aspect-square w-full bg-gray-100">
          <Image
            src={post.imageUrl}
            alt={post.caption}
            fill
            className="object-cover"
            sizes="430px"
          />
        </div>
      </Link>

      {/* キャプション */}
      {post.caption && (
        <div className="px-3 py-2">
          <span className="text-sm font-semibold mr-1">{author?.username}</span>
          <span className="text-sm">{post.caption}</span>
        </div>
      )}
    </article>
  );
}
