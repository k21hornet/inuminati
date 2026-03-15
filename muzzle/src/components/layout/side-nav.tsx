"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid3X3, Home, MessageCircle, PlusSquare, User } from "lucide-react";

type Props = { myUserId: string };

export function SideNav({ myUserId }: Props) {
  const pathname = usePathname();

  const items = [
    { href: "/feed", icon: Home, label: "ホーム" },
    { href: "/explore", icon: Grid3X3, label: "投稿一覧" },
    { href: "/posts/new", icon: PlusSquare, label: "投稿する" },
    { href: "/messages", icon: MessageCircle, label: "DM" },
    { href: `/users/${myUserId}`, icon: User, label: "プロフィール" },
  ];

  return (
    <nav className="flex flex-col gap-1">
      {items.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
              active
                ? "bg-gray-100 font-semibold text-black"
                : "text-gray-500 hover:bg-gray-50 hover:text-black"
            }`}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.5} />
            {label}
          </Link>
        );
      })}

      <a
        href="/auth/logout"
        className="mt-auto flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-400 hover:text-black"
      >
        ログアウト
      </a>
    </nav>
  );
}
