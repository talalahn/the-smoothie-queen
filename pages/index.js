import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';

// const registerLoginButtonStyles = css`
//   background: #e1e1e1;
//   border-radius: 4px;
//   display: flex;
//   justify-content: space-between;
//   max-width: 640px;

//   > a {
//     text-decoration: none;
//     text-decoration-color: none;
//     color: black;
//     padding: 10px;
//   }
// `;
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
      {/* <div css={registerLoginButtonStyles}>
        <Link href="/register">Register</Link>
        <Link href="/login">Login</Link>
      </div> */}
    </div>
  );
}
