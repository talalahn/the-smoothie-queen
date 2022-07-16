import { css } from '@emotion/react';
import Image from 'next/image.js';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  getAllScores,
  getPersonalScores,
  getUserByValidSessionToken,
} from '../utils/database';
// import { saveScore } from '../utils/database';
import { formatTimer } from '../utils/formatTimer';

const wrapperStyles = css`
  border: 5px solid black;
  top: 50%;
  left: 50%;
  position: absolute;
  width: 640px;
  height: 380px;
  transform: translate(-50%, -50%);

  > div {
    position: absolute;
    z-index: 100;
  }
  > button {
    position: absolute;
    z-index: 100;
    right: 0%;
  }
`;

const ingredientsStyles = css`
  position: absolute;
  bottom: 10%;
  left: 5%;
  display: grid;
  grid-template-columns: 100px 100px;
  grid-template-rows: 50px 50px;
  column-gap: 10px;
  row-gap: 15px;
`;
const backupButtonStyles = (openBackup) => css`
  position: relative;
  bottom: 10%;
  right: 5%;
  display: grid;
  grid-template-columns: 105px;
  grid-template-rows: 105px;
  margin-bottom: ${openBackup ? '100px' : '-100px'};
`;
const containerIngredientsStyles = css`
  position: absolute;
  bottom: 10%;
  right: 5%;
  display: grid;
  grid-template-columns: 50px 50px;
  grid-template-rows: 50px 50px;
  column-gap: 5px;
  row-gap: 5px;

  > button {
    font-size: 10px;
  }
`;

const fliesStyles = (flies) => css`
  position: absolute;
  bottom: 10%;
  left: ${flies.state ? '0%' : '50%'};

  border: 1px solid black;
  padding: 10px;
  background-color: ${flies.state ? 'red' : 'none'};
  z-index: ${flies.state ? '100' : '-100'};
`;

const flySwatterStyles = css`
  position: absolute;
  bottom: 20%;
  left: 60%;
  transform: rotate(45deg);
`;

const pauseMenuStyles = (paused) => css`
  width: 620px;
  height: 360px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  background-color: black;
  opacity: 90%;
  color: white;
  text-align: center;
  text-justify: center;
  z-index: ${paused ? '1000' : '-10'};
`;
const startMenuStyles = (paused, displayTime) => css`
  width: 620px;
  height: 360px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  background-color: black;
  opacity: 90%;
  color: white;
  text-align: center;
  text-justify: center;
  z-index: ${paused && displayTime === 0 ? '1000000' : '-1000000'};
`;

const gameOverMenuStyles = (gameOver) => css`
  width: 620px;
  height: 360px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  background-color: black;
  opacity: 90%;
  color: white;
  text-align: center;
  text-justify: center;
  z-index: ${gameOver ? '10000' : '-10'};

  > div > div {
    display: grid;
    grid-template-columns: 50px 50px;
    grid-template-rows: 50px 50px;
    column-gap: 5px;
    row-gap: 5px;
  }
`;
const highscoreMenuStyles = (scoreState, highscoreState) => css`
  width: 620px;
  height: 360px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  background-color: black;
  opacity: 90%;
  color: white;
  text-align: center;
  text-justify: center;
  z-index: ${scoreState || highscoreState ? '10000000' : '-10'};
`;

const dragQueenStyles = (dragQueen) => css`
  background-color: ${dragQueen.state ? 'pink' : 'white'};
  border: 1px solid black;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  text-align: center;
  position: absolute;
  transform: translateX(
      ${dragQueen.state ? `${dragQueen.position}px` : '800px'}
    )
    // between 200-600
    translateY(300px);
  left: ${dragQueen.state ? '20px' : '0'};
  :hover {
    cursor: pointer;
  }
  /* margin-bottom: 100px; */
`;

const ingredientButtonStyles = (ingredient) => css`
  background-color: ${ingredient.spoiled ? 'green' : 'none'};
`;

// TODOS:

// - figure out how to make sprite work with patienceMeter
// - create array of coordinates for each ingredientPosition
// - configure home, the login, and register pages
// - start menu
//        - not logged in? message: your score will not be saved
//        - button: rules -> rules show up
// - create a readme file

// list state up of paused
let paused;
let displayTime;
// let timerId
let roundedDisplayTime;
let gameOver = false;
let intervalDependentFunctions = [];
let scoreState = false;
let highscoreState = false;

// this function sets the time (frameTime) from the moment the page reloads
function useFrameTime() {
  const [frameTime, setFrameTime] = useState();

  useEffect(() => {
    let frameId;

    function frame(timestamp) {
      // round down timestamp to nearest thousandth
      roundedDisplayTime = Math.floor(displayTime / 1000) * 1000;
      if (!gameOver) {
        for (let i = 0; i < intervalDependentFunctions.length; i++) {
          if (i === 0) {
          }
          if (
            roundedDisplayTime % intervalDependentFunctions[i].interval === 0 &&
            roundedDisplayTime !==
              intervalDependentFunctions[i].preceedingInterval
          ) {
            intervalDependentFunctions[i].preceedingInterval =
              roundedDisplayTime;
            intervalDependentFunctions[i].function();
          }
        }
      }

      setFrameTime(timestamp);
      frameId = requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return cancelAnimationFrame(frameId);
  }, []);
  return frameTime;
}

// this function allows to pause and play the time (displayTime)
function Timer(
  score,
  username,
  userId,
  allScores,
  personalScores,
  pauseTime,
  setPauseTime,
  pause,
) {
  const [startTime, setStartTime] = useState(0);
  // const [pauseTime, setPauseTime] = useState(0);
  const [alias, setAlias] = useState();
  const [errors, setErrors] = useState([]);
  const router = useRouter();
  const [updatedGlobalScores, setUpdatedGlobalScores] = useState(allScores);
  const [updatedPersonalScores, setUpdatedPersonalScores] =
    useState(personalScores);
  const [highscoreGlobalScoresButton, setHighscoreGlobalScoresButton] =
    useState(true);
  function handleRestart() {
    // page.reload
    router.reload(window.location.pathname);
  }
  function handleHighscoreToggleButton() {
    setHighscoreGlobalScoresButton(!highscoreGlobalScoresButton);
  }

  function handleShowHighscores() {
    highscoreState = true;
  }
  async function handleSaveScore() {
    scoreState = true;
    if (userId) {
      const saveScoreResponse = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alias: alias,
          score: score,
          userId: userId,
        }),
      });

      const saveScoreResponseBody = await saveScoreResponse.json();

      if ('errors' in saveScoreResponseBody) {
        setErrors(saveScoreResponseBody.errors);
        return;
      }
      const finalUpdatedGlobalScores = updatedGlobalScores;
      if (saveScoreResponseBody.newScore.score > updatedGlobalScores[9].score) {
        finalUpdatedGlobalScores.pop();
        finalUpdatedGlobalScores.push(saveScoreResponseBody.newScore);
        finalUpdatedGlobalScores.sort((a, b) => {
          return b.score - a.score;
        });

        setUpdatedGlobalScores(finalUpdatedGlobalScores);
      }

      const finalUpdatedPersonalScores = updatedPersonalScores;
      if (
        saveScoreResponseBody.newScore.score > updatedPersonalScores[9].score
      ) {
        finalUpdatedPersonalScores.pop();
        finalUpdatedPersonalScores.push(saveScoreResponseBody.newScore);

        finalUpdatedPersonalScores.sort((a, b) => {
          return b.score - a.score;
        });
        setUpdatedPersonalScores(finalUpdatedPersonalScores);
      }
    }
  }

  paused = pauseTime !== undefined;
  const frameTime = useFrameTime();
  displayTime = paused ? pauseTime : frameTime - startTime;
  // timerId;
  // function pause() {
  //   setPauseTime(displayTime);
  //   clearInterval(timerId);
  // }
  function play() {
    setStartTime(performance.now() - pauseTime);
    setPauseTime(undefined);
  }

  if (!gameOver) {
    return (
      <>
        <div>{formatTimer(displayTime)}</div>

        <div css={pauseMenuStyles(paused)}>
          PAUSE MENU
          <button>RULES</button>
          <button onClick={handleShowHighscores}>HIGH SCORES</button>
          <button onClick={paused ? play : pause}>
            {paused ? 'Play' : ' Pause'}
          </button>
        </div>
        <div css={startMenuStyles(paused, displayTime)}>
          START MENU
          <button>RULES</button>
          <button onClick={handleShowHighscores}>HIGH SCORES</button>
          <button onClick={play}>START</button>
        </div>
      </>
    );
  } else if (gameOver && !scoreState && userId) {
    return (
      <div css={gameOverMenuStyles(gameOver)}>
        <div>GAME OVER</div>
        <div>SCORE: {score} </div>

        <label>
          ENTER NAME:
          <input
            value={alias}
            type="text"
            maxLength="3"
            onChange={(event) => {
              setAlias(event.currentTarget.value);
            }}
          />
        </label>

        <button onClick={() => handleSaveScore()}>SAVE SCORE</button>
        {errors.map((error) => (
          <span key={`error${error.message}`}>{error.message}</span>
        ))}
      </div>
    );
  } else if (gameOver && !scoreState && !userId) {
    return (
      <div css={gameOverMenuStyles(gameOver)}>
        <div>GAME OVER</div>
        <div>SCORE: {score} </div>
        <div>HIGH SCORES</div>
        <div>
          {allScores.map((globalScore) => {
            return (
              <div
                key={`global-${globalScore.alias}-${globalScore.score}-${
                  Math.random() * 1000
                }`}
              >
                <div>
                  {globalScore.alias}...
                  {globalScore.score}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={handleRestart}>PLAY AGAIN?</button>
      </div>
    );
  } else {
    return (
      <div css={highscoreMenuStyles(scoreState, highscoreState)}>
        <div>HIGH SCORES</div>
        {highscoreGlobalScoresButton ? (
          <div>
            TOP 10 GLOBAL SCORES
            {updatedGlobalScores.map((globalScore) => {
              return (
                <div
                  key={`global-${globalScore.alias}-${globalScore.score}-${
                    Math.random() * 1000
                  }`}
                >
                  <div>{globalScore.alias}</div>
                  <div>{globalScore.score}</div>
                  <div>{allScores.indexOf(globalScore) + 1}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            TOP 10 PERSONAL SCORES
            {updatedPersonalScores.map((personalScore) => {
              return (
                <div
                  key={`personal-${personalScore.alias}-${
                    personalScore.score
                  }-${Math.random() * 1000}`}
                >
                  <div>{personalScore.alias}</div>
                  <div>{personalScore.score}</div>
                  <div>{updatedPersonalScores.indexOf(personalScore) + 1}</div>
                </div>
              );
            })}
          </div>
        )}

        <button onClick={handleHighscoreToggleButton}>
          {highscoreGlobalScoresButton
            ? 'SHOW PERSONAL SCORES'
            : 'SHOW GLOBAL SCORES'}
        </button>
        <br />

        <button onClick={handleRestart}>PLAY AGAIN?</button>
      </div>
    );
  }
}

export default function GamePage(props) {
  const [score, setScore] = useState(0);
  const [pauseTime, setPauseTime] = useState(0);

  const [ingredientCounters, setIngredientCounters] = useState([
    {
      id: 'bananas',
      amount: 2,
      spoiled: false,
    },
    {
      id: 'strawberries',
      amount: 3,
      spoiled: false,
    },
    {
      id: 'ice',
      amount: 1,
      spoiled: false,
    },
    {
      id: 'peanutButter',
      amount: 3,
      spoiled: false,
    },
  ]);
  const [containerCounters, setContainerCounters] = useState([
    {
      id: 'bananas',
      stock: 12,
    },
    {
      id: 'strawberries',
      stock: 12,
    },
    {
      id: 'ice',
      stock: 12,
    },
    {
      id: 'peanutButter',
      stock: 12,
    },
  ]);
  const [dragQueens, setDragQueens] = useState([
    {
      id: 1,
      state: false,
      position: Math.floor(Math.random() * (600 - 200 + 1) + 200),
      enterTime: 0,
      patienceMeter: 0,
    },
    {
      id: 2,
      state: false,
      position: Math.floor(Math.random() * (600 - 200 + 1) + 200),
      enterTime: 0,
      patienceMeter: 0,
    },
    {
      id: 3,
      state: false,
      position: Math.floor(Math.random() * (600 - 200 + 1) + 200),
      enterTime: 0,
      patienceMeter: 0,
    },
    {
      id: 4,
      state: false,
      position: Math.floor(Math.random() * (600 - 200 + 1) + 200),
      enterTime: 0,
      patienceMeter: 0,
    },
  ]);
  const [flies, setFlies] = useState({
    state: false,
    enterTime: 0,
    ingredientPosition: 0,
    // create array of points on the game that the ingredients will be in and then randomly choose one of these for the flies to position to
  });
  const ingredientInfo = containerCounters.map((container) => {
    return {
      ...container,
      amount: ingredientCounters.find(
        (ingredient) => ingredient.id === container.id,
      ).amount,
      spoiled: ingredientCounters.find(
        (ingredient) => ingredient.id === container.id,
      ).spoiled,
    };
  });

  // FUNCTIONS
  let timerId;
  function pause() {
    setPauseTime(displayTime);
    clearInterval(timerId);
  }

  let openBackup = false;

  function handleOpenBackup() {
    openBackup = true;
  }

  const makeDragQueenTrue = useCallback(() => {
    // use function as argument in useState (prevState)
    setDragQueens((prevState) => {
      // creating array of drag queens that are false
      const falseDragQueens = prevState.filter((dragQueen) => {
        return !dragQueen.state;
      });
      // choose random queen from array of false drag queens
      const randomQueen =
        falseDragQueens[Math.floor(Math.random() * falseDragQueens.length)];
      return prevState.map((dragQueen) => {
        // explanation: code that makes sure the game runs when all drag queens are in the game
        if (falseDragQueens.length !== 0) {
          if (randomQueen.id === dragQueen.id) {
            return {
              ...dragQueen,
              state: true,
              enterTime: roundedDisplayTime,
            };
          } else {
            return {
              ...dragQueen,
            };
          }
        } else {
          return { ...dragQueen };
        }
      });
    });
  }, []);

  function makeFliesTrue() {
    setFlies((prevState) => {
      if (!prevState.state) {
        return {
          state: true,
          enterTime: roundedDisplayTime,
          ingredientPosition: Math.floor(
            Math.random() * ingredientCounters.length,
          ),
        };
      } else {
        return {
          ...prevState,
        };
      }
    });
  }

  function endGame() {
    gameOver = true;
  }

  const spoilFood = useCallback(() => {
    if (flies.state) {
      setIngredientCounters((prevState) => {
        return prevState.map((ingredient) => {
          if (roundedDisplayTime >= flies.enterTime + 6000) {
            if (prevState.indexOf(ingredient) === flies.ingredientPosition) {
              return { ...ingredient, spoiled: true };
            } else {
              return { ...ingredient };
            }
          } else {
            return { ...ingredient };
          }
        });
      });
    }
  }, [flies]);

  const makeDragQueenAngrier = useCallback(() => {
    // use function as argument in useState (prevState)
    setDragQueens((prevState) => {
      return prevState.map((dragQueen) => {
        if (
          dragQueen.state &&
          roundedDisplayTime >= dragQueen.enterTime + 6000
        ) {
          return {
            ...dragQueen,
            enterTime: roundedDisplayTime,
            patienceMeter: dragQueen.patienceMeter + 1,
          };
        } else {
          return dragQueen;
        }
      });
    });
  });

  useEffect(() => {
    for (let i = 0; i < dragQueens.length; i++) {
      if (dragQueens[i].patienceMeter === 3) {
        endGame();
      }
    }
  }, [dragQueens]);

  useEffect(() => {
    intervalDependentFunctions = [
      {
        id: 1,
        function: makeDragQueenTrue,
        interval: 5000,
        preceedingInterval: 0,
      },
      { id: 2, function: makeFliesTrue, interval: 8000, preceedingInterval: 0 },
      {
        id: 3,
        function: makeDragQueenAngrier,
        interval: 1000,
        preceedingInterval: 0,
      },
      { id: 4, function: spoilFood, interval: 1000, preceedingInterval: 0 },
    ];
  }, []);

  useEffect(() => {
    intervalDependentFunctions = intervalDependentFunctions.map((dependant) => {
      if (dependant.id === 4) {
        return { ...dependant, function: spoilFood };
      } else {
        return dependant;
      }
    });
    // add flies to dependencies so that every time flies (state) updates => the spoilFood() function resets and has the current state of the flies
  }, [flies]);

  useEffect(() => {
    if (score >= 50) {
      intervalDependentFunctions[0].interval = 4000;
      intervalDependentFunctions[1].interval = 7000;
    } else if (score >= 100) {
      intervalDependentFunctions[0].interval = 3000;
      intervalDependentFunctions[1].interval = 6000;
    } else {
      // intervalDependentFunction.interval === new interval value
    }
  }, [score]);

  return (
    <div>
      <div>
        <div css={wrapperStyles}>
          <div>Score: {score}</div>
          <button onClick={pause}>PAUSE</button>
          <div css={ingredientsStyles}>
            {/* the ingredients */}
            {ingredientInfo.map((ingredient) => (
              <button
                key={`ingredient-${ingredient.id}`}
                css={ingredientButtonStyles(ingredient)}
                onClick={() => {
                  setIngredientCounters(
                    ingredientCounters.map((oldIngredient) => {
                      // check if this is the one i'm clicking
                      if (ingredient.id === oldIngredient.id) {
                        if (oldIngredient.spoiled && !flies.state) {
                          return {
                            ...ingredient,
                            spoiled: false,
                          };
                        }
                        // check if the one i'm clicking has an amount of 0
                        else if (
                          ingredient.amount > 0 &&
                          ingredient.stock > 0 &&
                          !ingredient.spoiled
                        ) {
                          return {
                            ...oldIngredient,
                            amount: oldIngredient.amount - 1,
                          };
                        } else if (
                          ingredient.amount > 0 &&
                          ingredient.stock === 0
                        ) {
                          return { ...oldIngredient };
                        } else if (
                          ingredient.amount === 0 &&
                          ingredient.stock > 0
                        ) {
                          // reduce score by 5
                          if (score !== 0) {
                            setScore(score - 5);
                            return { ...oldIngredient };
                          } else {
                            setScore(0);
                            return { ...oldIngredient };
                          }
                        } else {
                          return {
                            ...oldIngredient,
                          };
                        }
                      } else {
                        return { ...oldIngredient };
                      }
                    }),
                  );
                  setContainerCounters(
                    containerCounters.map((container) => {
                      // check if this is the one i'm clicking
                      if (ingredient.id === container.id) {
                        if (ingredient.spoiled && !flies.state) {
                          return {
                            ...container,
                            stock: 0,
                          };
                        }
                        // check if the one i'm clicking has an amount of 0
                        else if (container.stock > 0 && !ingredient.spoiled) {
                          return {
                            ...container,
                            stock: container.stock - 1,
                          };
                        } else {
                          return { ...container };
                        }
                      } else {
                        return { ...container };
                      }
                    }),
                  );
                }}
              >
                {ingredientInfo.map((singleIngredientInfo) => {
                  if (ingredient.id === singleIngredientInfo.id) {
                    return (
                      <>
                        <span>{singleIngredientInfo.id}</span>
                        <br />
                        <span>amount: {singleIngredientInfo.amount}</span>
                        <br />
                        {/* for some reason this isn't showing */}
                        <span>spoiled: {singleIngredientInfo.spoiled}</span>
                      </>
                    );
                  }
                })}
              </button>
            ))}
          </div>
          <div css={backupButtonStyles(openBackup)}>
            <button onClick={handleOpenBackup}>BACKUP</button>
          </div>
          <div css={containerIngredientsStyles}>
            {/* THE BACKUP INGREDIENTS */}
            {ingredientInfo.map((ingredient) => (
              <button
                key={`backupIngredient-${ingredient.id}`}
                onClick={() => {
                  setContainerCounters(
                    containerCounters.map((container) => {
                      // check if this is the one i'm clicking
                      if (ingredient.id === container.id) {
                        // check if the stock is below 9
                        if (container.stock <= 9) {
                          return {
                            ...container,
                            stock: container.stock + 3,
                          };
                        } else {
                          return { ...container, stock: 12 };
                        }
                      } else {
                        return { ...container };
                      }
                    }),
                  );
                }}
              >
                {' '}
                {ingredientInfo.map((singleIngredientInfo) => {
                  if (ingredient.id === singleIngredientInfo.id) {
                    return (
                      <>
                        <span>{singleIngredientInfo.id}</span>
                        <br />
                        <span>stock: {singleIngredientInfo.stock}</span>
                      </>
                    );
                  }
                })}
              </button>
            ))}
          </div>
          <div css={fliesStyles(flies)}>THE FLIES</div>
          <div css={flySwatterStyles}>
            <button
              css={flySwatterStyles}
              onClick={() => {
                setFlies({
                  state: false,
                  enterTime: 0,
                  ingredientPosition: 0,
                });
              }}
            >
              FLY SWATTER
            </button>
          </div>
          <Image src="/background.png" width="640" height="380" />
        </div>
        <div>
          {Timer(
            score,
            props.username,
            props.userId,
            props.allScores,
            props.personalScores,
            pauseTime,
            setPauseTime,
            pause,
          )}
        </div>
        {/* the drag queens */}
        {dragQueens.map((dragQueen) => (
          <div
            // move this to button later
            key={`dragQueen-${dragQueen.id}`}
          >
            <div>
              DragQueen: {dragQueen.id} Anger: {dragQueen.patienceMeter} Time to
              get angrier: {(dragQueen.enterTime + 6000) / 1000}
            </div>
            <button
              css={dragQueenStyles(dragQueen)}
              onMouseDown={() => {
                if (
                  ingredientCounters.every(
                    (ingredient) => ingredient.amount === 0,
                  )
                ) {
                  setDragQueens(
                    dragQueens.map((clickedDragQueen) => {
                      // check if this is the one i'm clicking
                      if (dragQueen.id === clickedDragQueen.id) {
                        // check if the one i'm clicking is true
                        if (dragQueen.state) {
                          return {
                            ...clickedDragQueen,
                            state: false,
                            position: Math.floor(
                              Math.random() * (600 - 200 + 1) + 200,
                            ),
                            enterTime: 0,
                            patienceMeter: 0,
                          };
                        } else {
                          return { ...clickedDragQueen };
                        }
                      } else {
                        return { ...clickedDragQueen };
                      }
                    }),
                  );
                  setIngredientCounters(
                    ingredientCounters.map((ingredient) => {
                      return {
                        ...ingredient,
                        amount: Math.floor(Math.random() * 4 + 1),
                      };
                    }),
                  );
                  setScore(score + 10);
                }
              }}
            >
              {dragQueen.id}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  const allScores = await getAllScores();

  if (!user) {
    return { props: { allScores: allScores } };
  }

  const personalScores = await getPersonalScores(user.id);

  return {
    props: {
      username: user.username,
      userId: user.id,
      allScores: allScores,
      personalScores: personalScores,
    },
  };
}
