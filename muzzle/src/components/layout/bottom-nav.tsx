"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid3X3, Home, MessageCircle, PlusSquare, User } from "lucide-react";

type Props = { myUserId: string };

export function BottomNav({ myUserId }: Props) {
  const pathname = usePathname();

  const items = [
    { href: "/feed", icon: Home, label: "ホーム" },
    { href: "/explore", icon: Grid3X3, label: "投稿一覧" },
    { href: "/posts/new", icon: PlusSquare, label: "投稿" },
    { href: "/messages", icon: MessageCircle, label: "DM" },
    { href: `/users/${myUserId}`, icon: User, label: "プロフィール" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t bg-white">
      <ul className="flex">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-0.5 py-3 text-xs transition-colors ${
                  active ? "text-black" : "text-gray-400"
                }`}
                aria-label={label}
              >
                <Icon size={24} strokeWidth={active ? 2.5 : 1.5} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
