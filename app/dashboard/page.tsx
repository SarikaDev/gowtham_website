// import { auth } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";

export default async function Dashboard() {
  // const { userId } = await auth();
  redirect("/dashboard/overview");
}
