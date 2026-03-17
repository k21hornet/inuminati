import { notFound } from "next/navigation";
import { auth0 } from "@/lib/auth/auth0";
import { apiFetch } from "@/lib/api/fetcher";
import type { User, Post, FollowStats } from "@/lib/api/types";
import { UserProfileHeader } from "@/features/user/user-profile-header";
import { PostGrid } from "@/features/post/post-grid";

type Props = { params: Promise<{ id: string }> };

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;

  const { token } = await auth0.getAccessToken();

  const [user, posts, me, followStats] = await Promise.all([
    apiFetch.get<User>(`/api/v1/users/${id}`, token).catch(() => null),
    apiFetch.get<Post[]>(`/api/v1/users/${id}/posts`, token).catch(() => []),
    apiFetch.get<User>("/api/v1/users/me", token).catch(() => null),
    apiFetch.get<FollowStats>(`/api/v1/users/${id}/follow-stats`, token).catch(() => ({
      followerCount: 0,
      followingCount: 0,
      isFollowing: false,
    })),
  ]);

  if (!user) notFound();

  return (
    <>
      <UserProfileHeader
        user={user}
        postCount={posts?.length ?? 0}
        isMe={me?.id === user.id}
        followStats={followStats}
      />
      <PostGrid posts={posts ?? []} />
    </>
  );
}
