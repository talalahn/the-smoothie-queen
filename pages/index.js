import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Smoothie Queen</title>
        <meta
          name="Smoothie Queen Game"
          content="Game where you need to create smoothies for the customers before they get angry"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}
