export type User = {
  id: string;
  username: string;
  bio: string;
  avatarUrl: string;
};

export type Post = {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
};

export type LikeStatus = {
  count: number;
  isLiked: boolean;
};

export type Comment = {
  id: string;
  postId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
};

export type FollowStats = {
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
};

export type UserIdList = {
  userIds: string[];
};

export type ConversationSummary = {
  partnerId: string;
  partnerUsername: string;
  partnerAvatarUrl: string;
  lastContent: string;
  lastMessageAt: string;
};

export type DirectMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
};
