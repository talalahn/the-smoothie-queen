import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

const gameScreenStyles = css`
  border: 5px solid black;
  top: 50%;
  left: 50%;
  position: absolute;
  width: 640px;
  height: 380px;
  transform: translate(-50%, -50%);
  z-index: -1000;
`;
const startPageLinkStyles = css`
  position: absolute;
  top: 75%;
  left: 48%;
  transform: translate(-50%, -50%);
  display: flex;
  width: 400px;
  gap: 10px;

  img {
    cursor: pointer;
  }
  > .hoverElement {
    margin-top: 100px;
    font-size: 10px;
  }

  > .hoverElement > .hovertext {
    position: absolute;
    bottom: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    visibility: hidden;
  }

  .hoverElement:hover .hovertext {
    visibility: visible;
  }
`;

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
      <div css={gameScreenStyles}>
        {' '}
        <Image src="/app-background.png" width="640" height="380" />
        <div css={startPageLinkStyles}>
          <Link href="/register">
            <Image
              src="/register-btn.png"
              alt="register button"
              width="388"
              height="155"
            />
          </Link>
          <Link href="/login">
            <Image
              src="/login-btn.png"
              alt="login button"
              width="388"
              height="155"
            />
          </Link>
          <Link className="hoverElement" href="/game">
            <Image
              src="/guest-btn.png"
              alt="continue as guest button"
              width="388"
              height="155"
            />
          </Link>
          {/* <p className="hovertext">Your score won't be saved</p> */}
        </div>
      </div>
    </div>
  );
}
