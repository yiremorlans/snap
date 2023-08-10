import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { SignIn, SignOutButton, useUser } from "@clerk/nextjs";


export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const user = useUser();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {!user && <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />}
        {!!user && <SignOutButton className="text-slate-100" />}
      </main>
    </>
  );
}

