import '../styles/globals.css';
import { css } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import Layout from './components/Layout';

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
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 100px;

  > a {
    text-decoration: none;
    text-decoration-color: none;
    padding: 10px;
    border: 1px solid black;
    border-radius: 10px;
    font-weight: bold;
    background-color: #f1f1f1;
    color: black;
    align-self: center;
    width: 80px;
    text-align: center;
    text-justify: center;
    box-shadow: 4px 4px;
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

function App({ Component, pageProps }) {
  const [user, setUser] = useState();

  const refreshUserProfile = useCallback(async () => {
    const profileResponse = await fetch('/api/profile');

    const profileResponseBody = await profileResponse.json();

    if (!('errors' in profileResponseBody)) {
      setUser(profileResponseBody.user);
    } else {
      profileResponseBody.errors.forEach((error) => console.log(error.message));
      setUser(undefined);
    }
  }, []);

  useEffect(() => {
    refreshUserProfile().catch(() => console.log('fetch api failed'));
  }, [refreshUserProfile]);

  return (
    <div>
      {[[], false, null, undefined]}
      <Layout user={user}>
        <Component {...pageProps} refreshUserProfile={refreshUserProfile} />
        <div css={gameScreenStyles}>
          {' '}
          <Image src="/background.png" width="640" height="380" />
          <div css={startPageLinkStyles}>
            <Link href="/register">REGISTER</Link>
            <a className="hoverElement" href="/game">
              CONTINUE AS GUEST
              <p className="hovertext">Your score won't be saved</p>
            </a>
            <Link href="/login">LOGIN</Link>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default App;
