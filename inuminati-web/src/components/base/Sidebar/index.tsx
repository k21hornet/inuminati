import { IoIosHome } from "react-icons/io";
import { RiMessage2Fill } from "react-icons/ri";
import { MdAddBox } from "react-icons/md";
import { FaShoppingBag } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="flex flex-col w-72 h-screen p-4 border-r border-gray-300">
      <div className="mb-4 px-2 py-4 text-3xl">
        <Link href="/">Inuminati</Link>
      </div>

      <ul>
        <li className="px-2 py-3 text-lg hover:bg-gray-100 rounded">
          <Link href="/" className="flex gap-2 items-center block w-full">
            <IoIosHome />
            ホーム
          </Link>
        </li>
        <li className="px-2 py-3 text-lg hover:bg-gray-100 rounded">
          <Link
            href="/messages"
            className="flex gap-2 items-center block w-full"
          >
            <RiMessage2Fill />
            メッセージ
          </Link>
        </li>
        <li className="px-2 py-3 text-lg hover:bg-gray-100 rounded">
          <Link
            href="/posts/new"
            className="flex gap-2 items-center block w-full"
          >
            <MdAddBox />
            投稿
          </Link>
        </li>
        <li className="px-2 py-3 text-lg hover:bg-gray-100 rounded">
          <Link href="/shops" className="flex gap-2 items-center block w-full">
            <FaShoppingBag />
            ショップ
          </Link>
        </li>
      </ul>

      <ul className="mt-auto">
        <li className="px-2 py-3 text-lg hover:bg-gray-100 rounded">
          <Link
            href="/settings"
            className="flex gap-2 items-center block w-full"
          >
            <IoSettingsSharp />
            設定
          </Link>
        </li>
        <li className="px-2 py-3 text-lg hover:bg-gray-100 rounded">
          <Link
            href="/users/1"
            className="flex gap-2 items-center block w-full"
          >
            <MdAccountCircle />
            プロフィール
          </Link>
        </li>
      </ul>
    </div>
  );
}
