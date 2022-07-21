import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createSerializedRegisterSessionTokenCookie } from '../../utils/cookies';
import {
  createSession,
  createUser,
  getUserByUsername,
} from '../../utils/database';

export type RegisterResponseBody =
  | { errors: { message: string }[] }
  | { user: { id: number } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponseBody>,
) {
  if (req.method === 'POST') {
    if (
      typeof req.body.username !== 'string' ||
      typeof req.body.password !== 'string' ||
      !req.body.password ||
      !req.body.username
    ) {
      res
        .status(400)
        .json({ errors: [{ message: 'username or password not provided' }] });
      return;
    }
    if (await getUserByUsername(req.body.username)) {
      res
        .status(401)
        .json({ errors: [{ message: 'username or password invalid' }] });
      return;
    }

    // hash the password
    const passwordHash = await bcrypt.hash(req.body.password, 12);

    // create the user
    const newUser = await createUser(req.body.username, passwordHash);

    const token = crypto.randomBytes(80).toString('base64');

    const session = await createSession(token, newUser.id);

    const serializedCookie = await createSerializedRegisterSessionTokenCookie(
      session.token,
    );

    res
      .status(200)
      .setHeader('set-Cookie', serializedCookie)
      .json({ user: { id: newUser.id } });
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
