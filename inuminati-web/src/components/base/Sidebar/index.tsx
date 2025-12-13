import { IoIosHome } from "react-icons/io";
import { RiMessage2Fill } from "react-icons/ri";
import { MdAddBox } from "react-icons/md";
import { FaShoppingBag } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import Link from "next/link";
import { getUserName } from "@/lib/api/user";

const navigationTopItems = [
  { href: "/home", icon: IoIosHome, label: "ホーム" },
  { href: "/messages", icon: RiMessage2Fill, label: "メッセージ" },
  { href: "/posts/new", icon: MdAddBox, label: "投稿" },
  { href: "/shops", icon: FaShoppingBag, label: "ショップ" },
];
const navigationBottomItems = [
  { href: "/settings", icon: IoSettingsSharp, label: "設定" },
  { href: "/auth/logout", icon: MdLogout, label: "ログアウト" },
];

export default async function Sidebar() {
  const userNameResponse = await getUserName();
  const userName = userNameResponse.userName;

  return (
    <div className="hidden md:flex md:flex-col w-72 h-screen p-4 border-r border-gray-300">
      <div className="mb-4 px-2 py-4 text-3xl">
        <Link href="/home">Inuminati</Link>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navigationTopItems.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.href}
                className="p-2 text-lg hover:bg-gray-100 rounded"
              >
                <Link
                  href={item.href}
                  className="flex gap-2 items-center block w-full"
                >
                  <Icon />
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="p-2 text-lg hover:bg-gray-100 rounded">
            <Link
              href={`/users/${userName}`}
              className="flex gap-2 items-center block w-full"
            >
              <MdAccountCircle />
              プロフィール
            </Link>
          </li>
        </ul>
      </nav>

      <nav className="mt-auto">
        <ul className="space-y-2">
          {navigationBottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.href}
                className="p-2 text-lg hover:bg-gray-100 rounded"
              >
                <Link
                  href={item.href}
                  className="flex gap-2 items-center block w-full"
                >
                  <Icon />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
