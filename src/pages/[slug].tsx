import Head from "next/head";
import { api } from "~/utils/api";
import type { GetStaticProps, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { LoadingSpinner } from "~/components/loading";
import { PostView } from "~/components/postview";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

const ProfileFeed = (props: {userId: string}) => {
  
  const {data, isLoading} = api.posts.getPostsByUserId.useQuery({
    userId: props.userId
  })

  if (isLoading) return <LoadingSpinner/>

  if (!data || data.length === 0) return <div>No posts</div>

  return <div className="flex flex-col">
    {data.map((fullPost) => (<PostView key={fullPost.post.id} {...fullPost} />))}
  </div>
}
const ProfilePage: NextPage<{username: string}> = ({ username }) => {

  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });
  if (!data) return <div>404</div>

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="h-48 border-indigo-800 bg-indigo-700 bg-opacity-50 relative">
          <Image
            src={data.profileImageUrl}
            alt={`@${data.username}'s profile picture`}
            width={128}
            height={128}

            className="-mb-[64px] rounded-full border-2 border-indigo-900 absolute bottom-0 left-0 ml-4"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${data.username}`}
        </div>
        <div className="w-full border-b border-indigo-800"></div>
        <ProfileFeed userId={data.id}/>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug =  context.params?.slug;

  if (typeof slug !== "string") throw new Error("slug must be a string");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  }
};


export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default ProfilePage