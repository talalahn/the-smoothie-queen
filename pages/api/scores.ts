import { NextApiRequest, NextApiResponse } from 'next';
import {
  getUserByValidSessionToken,
  saveScore,
  Score,
} from '../../utils/database';

export type SaveScoreResponseBody =
  | { errors: { message: string }[] }
  | { newScore: Omit<Score, 'userId'> };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SaveScoreResponseBody>,
) {
  if (req.method === 'POST') {
    const token = req.cookies.sessionToken;

    if (!token) {
      res
        .status(400)
        .json({ errors: [{ message: 'No session token passed' }] });
      return;
    }

    if (typeof req.body.alias !== 'string' || !req.body.alias) {
      res.status(400).json({ errors: [{ message: 'alias not provided' }] });
      return;
    }

    const user = await getUserByValidSessionToken(token);

    if (!user) {
      res
        .status(401)
        .json({ errors: [{ message: 'username or password invalid' }] });
      return;
    }

    const newScore = await saveScore(
      req.body.alias,
      req.body.score,
      req.body.userId,
    );

    if (newScore === undefined) {
      res.status(400).json({ errors: [{ message: 'newScore is undefined' }] });
      return;
    }

    res.status(200).json({ newScore });
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
