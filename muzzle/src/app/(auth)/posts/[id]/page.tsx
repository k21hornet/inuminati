import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth0 } from "@/lib/auth/auth0";
import { apiFetch } from "@/lib/api/fetcher";
import type { Post, User, LikeStatus, Comment } from "@/lib/api/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeletePostButton } from "@/features/post/delete-post-button";
import { LikeButton } from "@/features/like/like-button";
import { CommentSection } from "@/features/comment/comment-section";

type Props = { params: Promise<{ id: string }> };

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const { token } = await auth0.getAccessToken();

  const [post, me] = await Promise.all([
    apiFetch.get<Post>(`/api/v1/posts/${id}`, token).catch(() => null),
    apiFetch.get<User>("/api/v1/users/me", token).catch(() => null),
  ]);

  if (!post) notFound();

  const [author, likeStatus, comments] = await Promise.all([
    apiFetch.get<User>(`/api/v1/users/${post.userId}`, token).catch(() => null),
    apiFetch.get<LikeStatus>(`/api/v1/posts/${id}/likes`, token).catch(() => ({ count: 0, isLiked: false })),
    apiFetch.get<Comment[]>(`/api/v1/posts/${id}/comments`, token).catch(() => []),
  ]);

  const isMyPost = me?.id === post.userId;

  return (
    <div>
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-3">
        <Link href="/feed" className="text-sm text-gray-500">
          ←
        </Link>
        <h1 className="font-semibold">投稿</h1>
        {isMyPost ? (
          <DeletePostButton postId={post.id} />
        ) : (
          <span className="w-8" />
        )}
      </header>

      {/* 投稿者 */}
      <div className="flex items-center gap-2 px-3 py-2">
        <Link href={`/users/${post.userId}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={author?.avatarUrl} alt={author?.username} />
            <AvatarFallback>{author?.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <Link href={`/users/${post.userId}`} className="text-sm font-semibold">
          {author?.username ?? post.userId}
        </Link>
      </div>

      {/* 画像 */}
      <div className="relative aspect-square w-full bg-gray-100">
        <Image
          src={post.imageUrl}
          alt={post.caption}
          fill
          className="object-cover"
          priority
          sizes="430px"
        />
      </div>

      {/* いいねボタン */}
      <div className="px-3 py-2">
        <LikeButton
          postId={post.id}
          initialCount={likeStatus.count}
          initialIsLiked={likeStatus.isLiked}
        />
      </div>

      {/* キャプション */}
      {post.caption && (
        <div className="px-3 pb-2">
          <span className="text-sm font-semibold mr-1">{author?.username}</span>
          <span className="text-sm">{post.caption}</span>
        </div>
      )}

      {/* コメントセクション */}
      <CommentSection
        postId={post.id}
        initialComments={comments}
        myUserId={me?.id ?? null}
      />
    </div>
  );
}
