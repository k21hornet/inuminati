import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth/auth0";

export default async function HomePage() {
  const session = await auth0.getSession();
  if (session) {
    redirect("/feed");
  } else {
    redirect("/auth/login");
  }
}
