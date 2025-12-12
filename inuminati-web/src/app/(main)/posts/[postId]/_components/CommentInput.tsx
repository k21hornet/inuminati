import { IoSend } from "react-icons/io5";

export default function CommentInput() {
  return (
    <div className="py-4 flex items-center gap-2">
      <textarea
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder="コメントする"
        rows={1}
      />
      <IoSend />
    </div>
  );
}
