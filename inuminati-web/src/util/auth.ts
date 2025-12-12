import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export const getAccessToken = async (): Promise<string> => {
  try {
    const accessToken = await auth0.getAccessToken();
    return accessToken.token;
  } catch {
    return redirect("/auth/login");
  }
};
