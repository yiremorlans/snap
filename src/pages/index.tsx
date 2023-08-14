import Head from "next/head";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { SignInButton, useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {

  const {user} = useUser();

  console.log(user);

  if (!user) return null;

  return (
    <div className="flex gap-3 w-full">
      <img src={user.profileImageUrl} alt="Profile image" className="rounded-full w-16 h-16" />
      <input placeholder="Type a little" type="text" className="grow bg-transparent outline-none"/>
    </div>
  )
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author} = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-indigo-800 p-4">
      <img src={author.profileImageUrl} alt="Profile image" className="rounded-full w-16 h-16"/>
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <span>{`@${author.username}`}</span>
          <span className="font-thin">{`· ${dayjs(
            post.createdAt
          ).fromNow()}`}</span>
        </div>
      </div>
      <span>{post.content}</span>
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
            {data?.map((fullPost) => (
              <PostView key={fullPost.post.id} {...fullPost} />
            ))}
          </div>
        </div>     
      </main>
    </>
  );
}

