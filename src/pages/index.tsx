import Head from "next/head";
import { useState } from "react";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingSpinner } from "~/components/loading";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { PageLayout } from "~/components/layout";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {

  const {user} = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("")
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.message;
      if (errorMessage?.[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Something went wrong");
      }
      
    },
  });

  if (!user) return null;

  return (
    <div className="flex gap-3 w-full">
      <Image 
        src={user.profileImageUrl} 
        alt="Profile image" 
        className="rounded-full w-16 h-16" 
        width={56}
        height={56}/>
        <input 
          placeholder="Type a little" 
          type="text" 
          className="grow bg-transparent outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (input !== "") {
                mutate({content: input});
              }
            }
          }}
          disabled={isPosting}
        />
       {input !== "" && !isPosting && (<button onClick={() => mutate({content: input})}>Post</button>)} 

        {isPosting && (
          <div className="flex items-center justify-center">
            <LoadingSpinner size={20} />
          </div>  
        )}
    </div>
  )
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author} = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-indigo-800 p-4">
      <Image 
        src={author.profileImageUrl} 
        alt={`@${author.username}'s profile picture`}className="rounded-full w-16 h-16"
        width={56}
        height={56}/>
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <Link href={`/@${author.username}`}><span>{`@${author.username}`}</span></Link>
          <Link href={`/post/${post.id}`}><span className="font-thin">{`· ${dayjs(
            post.createdAt
          ).fromNow()}`}</span></Link>
        </div>
         <span className="text-2xl">{post.content}</span>
      </div> 
    </div>
    
  )
}

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingSpinner />;

  if (!data) return <div>Something went wrong</div>

  return (
    <div className="flex flex-col">
      {
        data?.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  )
  
};

export default function Home() {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching asap
  api.posts.getAll.useQuery();

  // Return empty div if BOTH aren't loaded
  if (!userLoaded) return <div />;

  return ( 
    <PageLayout>
      <div className="flex border-b border-indigo-800 p-4">
        {!isSignedIn && (
           <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          {isSignedIn && <CreatePostWizard />}
      </div>
      <Feed />
    </PageLayout>
  );
}

