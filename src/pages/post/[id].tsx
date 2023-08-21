import Head from "next/head";

export default function SinglePostPage() {

  return (
    <>
      <Head>
        <title>Snap</title>
        <meta name="description" content="Snap is a fun visitor snap book page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex justify-center h-screen">
        <h3>SIngle post page</h3>  
      </main>
    </>
  );
}

