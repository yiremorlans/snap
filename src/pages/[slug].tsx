import Head from "next/head";
import { api } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import  superjson  from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { prisma } from "~/server/db";
import type { GetStaticProps, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Image from "next/image";


const ProfilePage: NextPage<{username: string}> = ({ username }) => {

  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
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
      
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {

  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null},
    transformer: superjson,
  })

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