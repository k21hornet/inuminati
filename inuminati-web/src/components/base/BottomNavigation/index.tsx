import Link from "next/link";
import { IoIosHome } from "react-icons/io";
import { RiMessage2Fill } from "react-icons/ri";
import { MdAddBox } from "react-icons/md";
import { FaShoppingBag } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { getUserName } from "@/lib/api/user";

const navigationItems = [
  { href: "/home", icon: IoIosHome },
  { href: "/messages", icon: RiMessage2Fill },
  { href: "/posts/new", icon: MdAddBox },
  { href: "/shops", icon: FaShoppingBag },
];

export default async function BottomNavigation() {
  const userNameResponse = await getUserName();
  const userName = userNameResponse.userName;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-between gap-4 h-16 px-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full"
            >
              <Icon className="text-2xl" />
            </Link>
          );
        })}
        <Link
          href={`/users/${userName}`}
          className="flex flex-col items-center justify-center w-full h-full"
        >
          <MdAccountCircle className="text-2xl" />
        </Link>
      </div>
    </nav>
  );
}
