import Head from "next/head";
import { api } from "~/utils/api";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";


const CreatePostWizard = () => {
  const {user} = useUser();

  if (!user) return null;

  return (
    <div className="flex gap-3 w-full">
      <img src={user.profileImageUrl} alt="Profile image" className="rounded-full w-16 h-16" />
      <input placeholder="Type a little" type="text" className="grow bg-transparent outline-none"/>
    </div>
  )
}
export default function Home() {

  const user = useUser();

  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <div><span>Loading</span></div>

  if (!data) return <div><span>Something went wrong</span></div>


  return (
    <>
      <Head>
        <title>Snap</title>
        <meta name="description" content="Snap is a fun visitor snap book page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex justify-center h-screen">
        <div className="w-full border-x border-indigo-800 md:max-w-2xl ">
          <div className="flex border-b border-indigo-800 p-4 ">
            {!user.isSignedIn && <div className="flex justify-center"><SignInButton /></div>}
            {user.isSignedIn && <CreatePostWizard />}
          </div>
          <div className="flex flex-col">
            {data?.map((post) => (<div key={post.id} className="border-b border-indigo-800 p-8">{post.content}</div>))}
          </div>
        </div>     
      </main>
    </>
  );
}

