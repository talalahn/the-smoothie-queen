import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LoginResponseBody } from './api/login';
import { Props } from './register';

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

  > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
  }
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

export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  const router = useRouter();

  async function loginHandler() {
    const loginResponse = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const loginResponseBody: LoginResponseBody = await loginResponse.json();

    if ('errors' in loginResponseBody) {
      setErrors(loginResponseBody.errors);
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
      // redirect user to user profile
      // if you want to use userProfile with username redirect to /users/username
      // await router.push(`/users/${loginResponseBody.user.id}`);
      await props.refreshUserProfile();
      await router.push(`/game`);
      // console.log(getUserByUsername(username));
    }
  }

  return (
    <div>
      <Head>
        <title>Login</title>
        <meta name="login" content="Login a new user" />
      </Head>

      <main />
      <div css={registerLoginStyles}>
        <Image src="/background.png" width="640" height="380" />

        <Link href="/">Back</Link>

        <div>
          <label>
            username:
            <input
              value={username}
              onChange={(event) => {
                setUsername(event.currentTarget.value);
              }}
            />
          </label>
          <br />
          <label>
            password:
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.currentTarget.value);
              }}
            />
          </label>
          <br />

          {errors.map((error) => (
            <span key={`error-${error.message}`}>{error.message}</span>
          ))}
        </div>
        <button onClick={() => loginHandler()}>Login</button>
      </div>
    </div>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  if (
    context.req.headers.host &&
    context.req.headers['x-forwarded-proto'] &&
    context.req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return {
      redirect: {
        destination: `https://${context.req.headers.host}/login}`,
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
