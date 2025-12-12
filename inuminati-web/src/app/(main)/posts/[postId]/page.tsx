import { getPost } from "@/lib/api/post";
import Image from "next/image";
import PostUserInfo from "./_components/PostUserInfo";
import { getUserName } from "@/lib/api/user";
import CommentInput from "./_components/CommentInput";
import { MdFavoriteBorder } from "react-icons/md";
import { FaRegCommentAlt } from "react-icons/fa";

type Props = {
  params: Promise<{ postId: string }>;
};

export default async function Post({ params }: Props) {
  const { postId } = await params;

  const post = await getPost(postId);

  const response = await getUserName();
  const currentUserName = response.userName;

  const isCurrentUser = currentUserName === post.userName;

  return (
    <div className="flex gap-4 w-full h-full">
      <div className="max-w-2xl h-full bg-black">
        <div
          key={post.postImages[0].postImageId}
          className="flex items-center h-full"
        >
          <Image
            src={post.postImages[0].imageUrl}
            alt={post.postImages[0].imageUrl}
            width={1000}
            height={1000}
            className="my-auto w-full max-h-full"
          />
        </div>
      </div>

      <div className="flex-1 h-full">
        <PostUserInfo post={post} isCurrentUser={isCurrentUser} />

        <div className="py-4 border-b border-gray-300">
          {post.content && <p className="mb-2">{post.content}</p>}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <MdFavoriteBorder />
              <span>{post.likeCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaRegCommentAlt />
              <span>{post.commentCount}</span>
            </div>
          </div>
        </div>

        <CommentInput />
      </div>
    </div>
  );
}
