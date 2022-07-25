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

  .image {
    opacity: 1;
    display: block;
    width: 100%;
    height: auto;
    transition: 0.5s ease;
    backface-visibility: hidden;
  }

  .middle {
    transition: 0.5s ease;
    opacity: 0;
    position: absolute;
    top: 150%;
    left: 85%;
    width: 200px;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    text-align: center;
  }

  .container:hover .middle {
    opacity: 0.8;
  }

  .text {
    background-color: #d23ccf;
    color: white;
    font-size: 12px;
    padding: 12px 24px;
    border-radius: 20px;
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
          <div>
            <Link href="/register">
              <Image
                src="/register-btn.png"
                alt="register button"
                width="388"
                height="155"
              />
            </Link>
          </div>
          <div>
            <Link href="/login">
              <Image
                src="/login-btn.png"
                alt="login button"
                width="388"
                height="155"
              />
            </Link>
          </div>
          <div className="container">
            <Link href="/game">
              <Image
                className="image"
                src="/guest-btn.png"
                alt="continue as guest button"
                width="388"
                height="155"
              />
            </Link>
            <div className="middle">
              <div className="text">Your score won't be saved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
