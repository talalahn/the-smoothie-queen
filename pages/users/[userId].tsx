import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { getUserById, User } from '../../utils/database';

type Props = {
  user?: User;
};

export default function UserDetails(props: Props) {
  if (!props.user) {
    return (
      <div>
        <Head>
          <title>User not found</title>
          <meta name="description" content="About the app" />
        </Head>
        <main>
          <h1>User not found</h1>
        </main>
      </div>
    );
  }
  return (
    <div>
      <Head>
        <title>{props.user.username}</title>
        <meta name="description" content="About the app" />
      </Head>
      <main>
        <h1>
          User #{props.user.id} (username: {props.user.username})
        </h1>
        <div> id: {props.user.id}</div>
        <div> username: {props.user.username}</div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  console.log(context.query);
  const userIdFromUrl = context.query.userId;

  if (!userIdFromUrl || Array.isArray(userIdFromUrl)) {
    return { props: {} };
  }
  console.log(userIdFromUrl);
  const user = await getUserById(parseInt(userIdFromUrl));

  if (!user) {
    context.res.statusCode = 404;
    return { props: {} };
  }

  return {
    props: {
      user: user,
    },
  };
}
