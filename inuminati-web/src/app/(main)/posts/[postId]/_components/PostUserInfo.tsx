"use client";

import { useEffect, useRef, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { useRouter } from "next/navigation";

type Post = {
  postId: string;
  userName: string;
};

type Props = {
  post: Post;
  isCurrentUser: boolean;
};

export default function PostUserInfo({ post, isCurrentUser }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm("削除しますか？")) {
      console.log("削除");
    }
  };

  // モーダル外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div className="flex items-center justify-between gap-2 pb-4 border-b border-gray-300 relative">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push(`/users/${post.userName}`)}
        >
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          <div className="font-bold">@{post.userName}</div>
        </div>
        {isCurrentUser && (
          <div ref={buttonRef} className="inline-block">
            <FiMoreHorizontal className="cursor-pointer" onClick={handleOpen} />
          </div>
        )}
      </div>
      {isOpen && (
        <div
          ref={modalRef}
          className="absolute top-4 right-12 bg-white p-4 rounded-md shadow-md z-10"
        >
          <div
            className="mb-2 border-b border-gray-300 pb-2"
            onClick={handleDelete}
          >
            <span className="cursor-pointer">削除</span>
          </div>
          <button onClick={handleClose}>閉じる</button>
        </div>
      )}
    </>
  );
}
