import Timeline from "@/components/parts/Timeline";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/api/post";
import { getProfile, getUserName } from "@/lib/api/user";
import Image from "next/image";
import FollowButton from "./_components/FollowButton";
import Link from "next/link";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function Profile({ params }: Props) {
  const { username } = await params;

  const profile = await getProfile(username);
  const postsResponse = await getPosts(username);
  const posts = postsResponse.posts;

  const userNameResponse = await getUserName();
  const currentUserName = userNameResponse.userName;

  // ログイン中のユーザー自身のページかどうかを判定
  const isCurrentUser = currentUserName === username;

  // フォロー関係を取得
  const isFollowed = profile.isFollowed;
  const isFollowing = profile.isFollowing;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="lg:flex lg:items-center lg:justify-between mb-6 p-6 border-b border-gray-300">
        <div className="flex items-center gap-4 mb-4">
          {profile.profileImageUrl ? (
            <Image
              src={profile.profileImageUrl}
              alt="プロフィール画像"
              width={96}
              height={96}
              className="rounded-full"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200"></div>
          )}

          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{profile.nickname}</h1>
            <div className="flex items-center gap-2">
              <h2 className="text-gray-700">@{profile.userName}</h2>
              {isFollowed && (
                <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                  フォローされています
                </span>
              )}
            </div>
            {profile.selfIntroduction && (
              <p className="text-gray-700">{profile.selfIntroduction}</p>
            )}
            <div className="flex items-center gap-2">
              <span>フォロワー{profile.followerCount}人</span>
              <span>フォロー中{profile.followingCount}人</span>
            </div>
          </div>
        </div>
        {isCurrentUser && (
          <div className="flex lg:flex-col gap-2">
            <Button className="flex-1 lg:w-48">プロフィールを編集</Button>
            <Button className="flex-1 lg:w-48">
              <Link href="/posts/new">投稿する</Link>
            </Button>
          </div>
        )}
        {!isCurrentUser && (
          <div className="flex lg:flex-col gap-2">
            <FollowButton targetUserName={username} isFollowing={isFollowing} />
            <Button className="flex-1 lg:w-48">メッセージ</Button>
          </div>
        )}
      </div>

      <h2 className="text-xl font-bold px-6">投稿一覧</h2>
      <Timeline posts={posts} />
    </div>
  );
}
