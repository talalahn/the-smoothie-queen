import { NextApiRequest, NextApiResponse } from 'next';
import {
  getUserByUsername,
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
    const score = req.body.score;
    // check cookie and verify that user authentication is valid and then use id from cookie
    const validUser = await getUserByValidSessionToken(
      req.cookies.sessionToken,
    );
    if (typeof req.body.alias !== 'string' || !req.body.alias) {
      res.status(400).json({ errors: [{ message: 'alias not provided' }] });
      return;
    }
    if (await getUserByUsername(req.body.username)) {
      res
        .status(401)
        .json({ errors: [{ message: 'username or password invalid' }] });
      return;
    }
    if (validUser) {
      const newScore = await saveScore(req.body.alias, score, validUser.id);

      if (newScore === undefined) {
        res
          .status(400)
          .json({ errors: [{ message: 'newScore is undefined' }] });
        return;
      }
      res.status(200).json({ newScore });
    } else {
      res.status(405).json({ errors: [{ message: 'method not allowed' }] });
    }
  }
}
