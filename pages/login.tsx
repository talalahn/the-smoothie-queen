// import { GetServerSidePropsContext } from 'next';
import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LoginResponseBody } from './api/login';
import { Props } from './register';

const registerLoginStyles = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 2;
  background-color: pink;
  max-width: 640px;
  min-height: 250px;
  align-content: center;
  justify-content: center;
  opacity: 0.8;
  position: absolute;
  margin: 5%;

  > div > a {
    color: black;
    padding: 10px;
    font-weight: bold;
    border: 1px solid black;
    border-radius: 10px;
    width: 40px;
    transition: all 0.2s linear 0s;
    box-shadow: 4px 4px;
    background-color: #efefef;
    position: absolute;
    z-index: 2;
    text-decoration: none;

    :hover {
      box-shadow: 0 0.5em 0.5em -0.4em var(--hover);
      transform: translateY(0.25em);
      transition: 0.3s;
    }
  }
  > div > button {
    width: 70px;
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
        <div>
          <Link href="/">Back</Link>
        </div>
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
          <label>
            password:
            <input
              value={password}
              onChange={(event) => {
                setPassword(event.currentTarget.value);
              }}
            />
          </label>
          <button onClick={() => loginHandler()}>Login</button>
          <br />

          {errors.map((error) => (
            <span key={`error-${error.message}`}>{error.message}</span>
          ))}
        </div>
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
