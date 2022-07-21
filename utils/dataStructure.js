export function getScoresFromUser(scores) {
  const userScores = {
    id: scores[0].userId,
    scores: scores.map((score) => {
      return {
        alias: score.alias,
        scoreId: score.scoreId,
        score: score.score,
      };
    }),
  };
  return userScores;
}
