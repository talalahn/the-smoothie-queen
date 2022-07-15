import { NextApiRequest, NextApiResponse } from 'next';
import {
  getAllScores,
  getPersonalScores,
  getUserByUsername,
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
  if (req.method === 'GET') {
    const allScores = await getAllScores();
    const personalScores = await getPersonalScores(req.body.userId);
    console.log(allScores);
    console.log(personalScores);
  }

  if (req.method === 'POST') {
    const score = req.body.score;
    console.log(score);

    const newScore = await saveScore(req.body.alias, score, req.body.userId);

    if (newScore === undefined) {
      res.status(400).json({ errors: [{ message: 'newScore is undefined' }] });
      return;
    }
    console.log('newScore', newScore);
    console.log('type of newScore', typeof newScore);

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
