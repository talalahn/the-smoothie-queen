import { NextApiRequest, NextApiResponse } from 'next';
import {
  getAllScores,
  getPersonalScores,
  getUserByUsername,
  saveScore,
} from '../../utils/database';

export type SaveScoreResponseBody =
  | { errors: { message: string }[] }
  | { user: { id: number } };

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SaveScoreResponseBody>,
) {
  if (req.method === 'POST') {
    const score = req.body.score;
    console.log(score);

    const newScore = await saveScore(req.body.alias, score, req.body.userId);
    console.log('newScore', newScore);

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

    res.status(200);
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}

export async function scoreShower(
  req: NextApiRequest,
  res: NextApiResponse<SaveScoreResponseBody>,
) {
  if (req.method === 'GET') {
    const score = req.body.score;
    console.log(score);

    const allScores = await getAllScores();
    console.log('allScores', allScores);
    // const personalScores = await getPersonalScores(
    //   req.body.alias,
    //   score,
    //   req.body.userId,
    // );
    // console.log('personalScores', personalScores);
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
