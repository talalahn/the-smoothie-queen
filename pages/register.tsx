import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RegisterResponseBody } from './api/register';

const errorStyles = css`
  position: absolute;
  background-color: #d23ccf;
  color: pink;
  bottom: 2.5%;
  left: 17%;
  padding: 2px;
`;
const backButtonStyles = css`
  position: absolute;
  width: 50px;
  top: 1%;
  left: 1%;
  cursor: pointer;
`;

const registerLoginStyles = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 640px;
  height: 380px;
  align-content: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  /* > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
  } */
  > a {
    top: 10%;
    left: 10%;
    transform: translate(-50%, -50%);
    box-shadow: 4px 4px;
    position: absolute;
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
  }
  > button {
    position: absolute;
    top: 80%;
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
    cursor: pointer;
  }
`;

const usernamePasswordStyles = css`
  position: absolute;
  display: grid;
  grid-template-rows: 50% 50%;
  grid-template-columns: 50% 50%;
  width: 225px;
  height: 50px;
  top: 68%;
  left: 15%;
  row-gap: 10px;
  column-gap: 10px;

  input {
    justify-self: center;
    width: 100%;
    background: none;
    border: 1px pink solid;
    border-radius: 10px;
    color: pink;
    font-size: 20px;
  }
`;

const registerButtonStyles = css`
  position: absolute;
  width: 126px;
  top: 69%;
  left: 60%;
  cursor: pointer;
`;

export type Props = {
  refreshUserProfile: () => Promise<void>;
};
export default function Register(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<
    {
      message: string;
    }[]
  >([]);
  const router = useRouter();

  async function registerHandler() {
    const registerResponse = await fetch(`/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const registerResponseBody: RegisterResponseBody =
      await registerResponse.json();

    if ('errors' in registerResponseBody) {
      setErrors(registerResponseBody.errors);
      return;
    }

    const returnTo = router.query.returnTo;

    if (
      returnTo &&
      !Array.isArray(returnTo) &&
      // Security: Validate returnTo parameter against valid path
      // (because this is untrusted user input)
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
    ) {
      await props.refreshUserProfile();
      await router.push(returnTo);
    } else {
      await props.refreshUserProfile();
      // redirect user to game page
      await router.push(`/game`);
    }
  }
  return (
    <div>
      <Head>
        <title>Register</title>
        <meta name="registration" content="Register a new user" />
      </Head>
      <main />
      <div css={registerLoginStyles}>
        <Image src="/app-background.png" width="640" height="380" />
        <div css={backButtonStyles}>
          <Link href="/">
            <Image src="/back-btn.png" width="50" height="52" />
          </Link>
        </div>
        <div css={usernamePasswordStyles}>
          <Image src="/username.png" height="50" width="225" alt="username" />
          <input
            // css={inputRegisterStyles}
            value={username}
            onChange={(event) => {
              setUsername(event.currentTarget.value);
            }}
          />
          <Image src="/password.png" height="50" width="225" alt="password" />

          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
            }}
          />
        </div>
        {errors.map((error) => (
          <span css={errorStyles} key={`error${error.message}`}>
            {error.message}
          </span>
        ))}
        <div css={registerButtonStyles}>
          <Image
            src="/register-btn.png"
            alt="register button"
            width="388"
            height="155"
            onClick={() => registerHandler()}
          />
        </div>
      </div>
    </div>
  );
}
