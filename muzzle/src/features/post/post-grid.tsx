import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/api/types";

type Props = { posts: Post[] };

export function PostGrid({ posts }: Props) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <p className="text-sm">投稿がありません</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-px">
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`} className="relative block aspect-square overflow-hidden bg-gray-100">
          <Image
            src={post.imageUrl}
            alt={post.caption}
            fill
            className="object-cover"
            sizes="143px"
          />
        </Link>
      ))}
    </div>
  );
}
