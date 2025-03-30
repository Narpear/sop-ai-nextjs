import RegisterForm from "@/components/RegisterForm";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import {authOptions} from "../api/auth/[...nextauth]/auth-options";

export default async function Home() {

  const session = await getServerSession(authOptions);
  if(session) redirect("/dashboard");

  return (
    <main>
      <RegisterForm/>
    </main>
  );
}
