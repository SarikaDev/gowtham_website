// import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  // const { userId } = await auth();

  if (!true) {
    return redirect("/auth/sign-in");
  } else {
    redirect("/dashboard/overview");
  }
}
