import Head from "next/head";
import { api } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import  superjson  from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { prisma } from "~/server/db";
import type { GetStaticProps, NextPage } from "next";


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
      <main className="flex justify-center h-screen">
          <h3>{data.username}</h3>
      </main>
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