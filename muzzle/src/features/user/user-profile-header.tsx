import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { EditProfileDialog } from "@/features/user/edit-profile-dialog";
import { FollowButton } from "@/features/follow/follow-button";
import type { User, FollowStats } from "@/lib/api/types";

type Props = {
  user: User;
  postCount: number;
  isMe: boolean;
  followStats: FollowStats;
};

export function UserProfileHeader({ user, postCount, isMe, followStats }: Props) {
  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatarUrl} alt={user.username} />
          <AvatarFallback className="text-xl">
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* 統計 */}
        <div className="flex gap-6">
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold">{postCount}</span>
            <span className="text-xs text-gray-500">投稿</span>
          </div>
          <Link href={`/users/${user.id}/followers`} className="flex flex-col items-center hover:opacity-70">
            <span className="text-lg font-semibold">{followStats.followerCount}</span>
            <span className="text-xs text-gray-500">フォロワー</span>
          </Link>
          <Link href={`/users/${user.id}/following`} className="flex flex-col items-center hover:opacity-70">
            <span className="text-lg font-semibold">{followStats.followingCount}</span>
            <span className="text-xs text-gray-500">フォロー中</span>
          </Link>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <p className="font-semibold">{user.username}</p>
        {user.bio && <p className="text-sm whitespace-pre-wrap">{user.bio}</p>}
      </div>

      <div className="mt-3 flex gap-2">
        {isMe ? (
          <>
            <div className="flex-1">
              <EditProfileDialog user={user} />
            </div>
            <a
              href="/auth/logout"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              ログアウト
            </a>
          </>
        ) : (
          <>
            <div className="flex-1">
              <FollowButton
                targetUserId={user.id}
                initialIsFollowing={followStats.isFollowing}
              />
            </div>
            <Link
              href={`/messages/${user.id}`}
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-1.5 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              メッセージ
            </Link>
          </>
        )}
      </div>

      <Separator className="mt-4" />
    </div>
  );
}
