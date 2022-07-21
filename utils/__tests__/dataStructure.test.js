import { getScoresFromUser } from '../dataStructure';

test("Reduce user's scores ", () => {
  const userScores = [
    {
      userId: 1,
      alias: 'ABC',
      scoreId: 12345,
      score: 30,
    },
    {
      userId: 1,
      alias: 'DEF',
      scoreId: 67890,
      score: 40,
    },
    {
      userId: 1,
      alias: 'GHI',
      scoreId: 13579,
      score: 120,
    },
  ];

  expect(getScoresFromUser(userScores)).toStrictEqual({
    id: 1,
    scores: [
      { alias: 'ABC', scoreId: 12345, score: 30 },
      { alias: 'DEF', scoreId: 67890, score: 40 },
      { alias: 'GHI', scoreId: 13579, score: 120 },
    ],
  });
});
