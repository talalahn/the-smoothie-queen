import camelcaseKeys from 'camelcase-keys';
import { config } from 'dotenv-safe';
import postgres from 'postgres';

// This loads all environment variables from a .env file
// for all code after this line
if (!process.env.FLY_IO) config();

// Type needed for the connection function below
declare module globalThis {
  let postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

// Connect only once to the database
// https://github.com/vercel/next.js/issues/7811#issuecomment-715259370
function connectOneTimeToDatabase() {
  if (!globalThis.postgresSqlClient) {
    globalThis.postgresSqlClient = postgres({
      transform: {
        ...postgres.camel,
        undefined: null,
      },
    });
  }
  return globalThis.postgresSqlClient;
}

// Connect to PostgreSQL
export const sql = connectOneTimeToDatabase();
export type User = {
  id: number;
  username: string;
};

type UserWithPasswordHash = User & {
  passwordHash: string;
};

export async function createUser(username: string, passwordHash: string) {
  const [user] = await sql<[User]>`
    INSERT INTO users
        ( username, password_hash)
    VALUES
        (${username}, ${passwordHash})
    RETURNING
        id,
        username
        `;

  return camelcaseKeys(user);
}

export async function getUserByUsername(username: string) {
  if (!username) return undefined;
  const [user] = await sql<[User | undefined]>`
    SELECT
      id,
      username
    FROM
      users
    WHERE
      username = ${username}
  `;
  return user && camelcaseKeys(user);
}
export async function getUserById(userId: number) {
  if (!userId) return undefined;

  const [user] = await sql<[User | undefined]>`
    SELECT
        id,
        username
    FROM
        users
    WHERE
        id = ${userId}
        `;

  return user && camelcaseKeys(user);
}

export async function getUserWithPasswordHashByUsername(username: string) {
  if (!username) return undefined;

  const [user] = await sql<[UserWithPasswordHash | undefined]>`
  SELECT
    *
  FROM
    users
  WHERE
    username = ${username}
`;
  return user && camelcaseKeys(user);
}

type Session = {
  id: number;
  token: string;
};

export async function createSession(
  token: string,
  userId: User['id'],
  // csrfSecret: string,
) {
  // if (!token) return undefined;
  const [session] = await sql<[Session]>`
  INSERT INTO sessions
      ( token, user_id)
  VALUES
      (${token}, ${userId} )
  RETURNING
      id,
      token
      `;

  await deleteExpiredSession();
  return camelcaseKeys(session);
}

// type SessionWithCSRFSecret = Session & { csrfSecret: string };

// export async function getValidSessionByToken(token: string) {
//   if (!token) return undefined;
//   const [session] = await sql<[SessionWithCSRFSecret | undefined]>`

//   SELECT
//       sessions.id,
//       sessions.token,
//       sessions.csrf_secret
//   FROM
//       sessions
//   WHERE
//   sessions.token = ${token} AND
//   sessions.expiry_timestamp > now();
//   `;

//   await deleteExpiredSession();
//   return session && camelcaseKeys(session);
// }

export async function getUserByValidSessionToken(token: string) {
  if (!token) return undefined;

  const [user] = await sql<[User | undefined]>`

  SELECT
      users.id,
      users.username
  FROM
      users,
      sessions
  WHERE
  sessions.token = ${token} AND
  sessions.user_id = users.id AND
  sessions.expiry_timestamp > now();
  `;

  await deleteExpiredSession();
  return user && camelcaseKeys(user);
}

export async function deleteSessionByToken(token: string) {
  const [session] = await sql<[Session | undefined]>`
  DELETE FROM
      sessions
  WHERE
      sessions.token = ${token}
  RETURNING *
      `;

  return session && camelcaseKeys(session);
}

export async function deleteExpiredSession() {
  const sessions = await sql<[Session[]]>`
  DELETE FROM
      sessions
  WHERE
      expiry_timestamp < now()
  RETURNING *
      `;

  return sessions.map((session) => camelcaseKeys(session));
}

export type Score = {
  alias: string;
  score: number;
  userId: number;
};
export async function saveScore(alias: string, score: number, userId: number) {
  if (!alias) return;
  const [scores] = await sql<[Score]>`
  INSERT INTO scores
      ( alias, score, user_id)
  VALUES
      (UPPER(${alias}), ${score}, ${userId} )
  RETURNING
      alias,
      score
      `;
  return scores;
}

export async function getAllScores() {
  const scores = await sql<[Omit<Score, 'userId'>]>`
  SELECT
      alias, score
  FROM
      scores
  ORDER BY
      score DESC
  LIMIT
      10
`;
  return scores;
}

export async function getPersonalScores(userId: number) {
  const scores = await sql<[Score]>`
  SELECT
      alias, score
  FROM
      scores
  WHERE
      user_id = ${userId}
  ORDER BY
      score DESC
   LIMIT
      10

`;
  return scores;
}

export async function deleteUserByUsername(username: string) {
  await sql<[User | undefined]>`
    DELETE FROM
        users
    WHERE
        username = ${username}
        `;
}
