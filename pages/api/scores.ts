import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByUsername, saveScore, Score } from '../../utils/database';

export type SaveScoreResponseBody =
  | { errors: { message: string }[] }
  | { newScore: Omit<Score, 'userId'> };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SaveScoreResponseBody>,
) {
  if (req.method === 'POST') {
    const score = req.body.score;

    const newScore = await saveScore(req.body.alias, score, req.body.userId);

    if (newScore === undefined) {
      res.status(400).json({ errors: [{ message: 'newScore is undefined' }] });
      return;
    }

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

    res.status(200).json({ newScore });
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
