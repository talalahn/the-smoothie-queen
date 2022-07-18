import { css } from '@emotion/react';
import Image from 'next/image.js';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  getAllScores,
  getPersonalScores,
  getUserByValidSessionToken,
} from '../utils/database';
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
    /* z-index: 100; */
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
  /* z-index: 101; */

  /* > div > button {
    z-index: -10000;
  } */
`;

const fliesStyles = (flies) => css`
  position: absolute;
  height: 260px;
  width: 460px;
  bottom: 0%;
  right: ${flies.state ? '40%' : '80%'};
  z-index: ${flies.state ? '103' : '-100'};
  transition: 3000ms;
  transition-timing-function: ease-out;
  background-image: url('sprite-flies.png');
  transform: scale(0.4);
  animation: fly 0.5s steps(3) infinite;
  pointer-events: none;

  @keyframes fly {
    0% {
      background-position: 0 0;
    }

    100% {
      background-position: 0 -780px;
    }
  }
`;

const flySwatterStyles = css`
  position: absolute;
  bottom: 10%;
  left: 65%;
  height: 80px;
  width: 40px;
  cursor: pointer;
  z-index: 102;
  transform: rotate(30deg);

  :focus {
    animation: swat cubic-bezier(0, 1.01, 1, 1) 1s 1;
  }
  :active {
    animation: none;
  }
  @keyframes swat {
    50% {
      transform: translateX(-300px) rotate(-50deg);
    }
    100% {
      transform: translateX(0px) rotate(30deg);
    }
  }
`;
const blenderStyles = css`
  position: absolute;
  bottom: 7%;
  left: 45%;
  height: 130px;
  width: 55px;
  z-index: 101;
`;

const doorStyles = (doorButtonState) => css`
  position: absolute;
  width: 255px;
  height: ${doorButtonState ? '300px' : '160px'};
  transform: scale(0.5);
  top: ${doorButtonState ? '33%' : '60%'};
  left: 65%;
  padding: 0;
  background: none;
  border: none;
  z-index: 101;

  background-image: url(${doorButtonState
    ? 'door_open.png'
    : 'door_closed.png'});
`;

const pauseButtonStyles = css`
  border: 0;
  background: transparent;
  box-sizing: border-box;
  width: 0;
  height: 74px;
  border-color: transparent transparent transparent #aa336a;
  transition: 100ms all ease;
  cursor: pointer;
  border-style: double;
  border-width: 0px 0 0px 60px;
  transform: scale(0.3);
`;

const pauseMenuStyles = css`
  width: 620px;
  height: 360px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  background-color: #0042ff;
  /* opacity: 90%; */
  color: white;
  text-align: center;
  text-justify: center;
`;
const startMenuStyles = css`
  width: 620px;
  height: 360px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  background-color: #ffd117;
  opacity: 30%;
  color: white;
  text-align: center;
  text-justify: center;
`;

const gameOverMenuStyles = css`
  width: 620px;
  height: 360px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  background-color: #0042ff;
  /* opacity: 90%; */
  color: white;
  text-align: center;
  text-justify: center;

  > div > div {
    display: grid;
    grid-template-columns: 50px 50px 50px;
    grid-template-rows: 5px 5px 5px;
    column-gap: 5px;
    row-gap: 5px;
  }
`;
const highscoreMenuStyles = css`
  width: 620px;
  height: 360px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  background-color: #0042ff;
  /* opacity: 90%; */
  color: white;
  text-align: center;
  text-justify: center;
`;

const highscoreGridStyles = css`
  > div {
    position: relative;
    left: 37%;
    display: grid;
    grid-template-columns: 50px 50px 50px;
    grid-template-rows: 5px 5px 5px;
    column-gap: 5px;
    row-gap: 5px;
  }
`;

const dragQueenStyles = (dragQueen) => css`
  border: 1px solid black;
  border-radius: 50%;
  height: 200px;
  width: 100px;
  text-align: center;
  position: absolute;
  top: 10%;
  right: 100%;
  transform: translate(-50%, -50%)
    translateX(${dragQueen.state ? `${dragQueen.position}px` : '765px'});
  transition: 3000ms;
  transition-timing-function: linear;
  :hover {
    cursor: pointer;
  }
`;

const ingredientButtonStyles = (ingredient) => css`
  border: none;
  padding: 0;
  background: none;
  background-color: none;
  height: 100px;
  width: 200px;
  transform: scale(0.5);
  background-image: url(${ingredient.spoiled ? `greensmoke.png` : `/`}),
    url('/${ingredient.id}/${ingredient.id}-${ingredient.stock}.png');
  z-index: 101;
`;

const ingredientButtonParentStyles = css`
  display: grid;
  grid-template-columns: 100px 100px;
  grid-template-rows: 50px 50px;
  column-gap: 20px;
  row-gap: 10px;
  position: absolute;
  right: 13%;
  bottom: 12.5%;
`;

const numberLabelStyles = css`
  border: 1px solid black;
  font-size: 25px;
  padding: 0;
  background: none;
  background-color: none;
  height: 30px;
  width: 30px;
  z-index: 101;
`;

const numberLabelParentStyles = css`
  display: grid;
  grid-template-columns: 30px 30px;
  grid-template-rows: 30px 30px;
  column-gap: 120px;
  row-gap: 80px;
  position: absolute;
  right: 13%;
  bottom: 12.5%;
`;

const containerButtonStyles = css`
  height: 35px;
  width: 35px;
  background: none;
  font-size: 5px;
  z-index: 101;
`;
const containerButtonParentStyles = css`
  display: grid;
  grid-template-columns: 35px 35px;
  grid-template-rows: 35px 35px;
  column-gap: 1px;
  row-gap: 1px;
  position: absolute;
  /* transform: translate(-50%, -50%); */
  left: 77%;
  bottom: 10%;
  z-index: 101;
`;

// TODOS:

// - figure out how to make sprite work with patienceMeter
// - create a readme file

// list state up of paused
let paused;
let displayTime;
let roundedDisplayTime;
let gameOver = false;
let intervalDependentFunctions = [];
let scoreState = false;

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

export default function GamePage(props) {
  const router = useRouter();
  const [startTime, setStartTime] = useState(0);
  const [pauseTime, setPauseTime] = useState(0);
  paused = pauseTime !== undefined;
  const frameTime = useFrameTime();
  displayTime = paused ? pauseTime : frameTime - startTime;
  const [score, setScore] = useState(0);
  const [alias, setAlias] = useState();
  const [errors, setErrors] = useState([]);
  const [highscoreGlobalScoresButton, setHighscoreGlobalScoresButton] =
    useState(true);
  const [highscoreButton, setHighscoreButton] = useState(false);
  const [ingredientCounters, setIngredientCounters] = useState([
    {
      id: 'strawberries',
      amount: 3,
      spoiled: false,
    },
    {
      id: 'bananas',
      amount: 2,
      spoiled: false,
    },
    {
      id: 'peanutButter',
      amount: 3,
      spoiled: false,
    },
    {
      id: 'spinach',
      amount: 1,
      spoiled: false,
    },
  ]);
  const [containerCounters, setContainerCounters] = useState([
    {
      id: 'strawberries',
      stock: 12,
    },
    {
      id: 'bananas',
      stock: 12,
    },
    {
      id: 'peanutButter',
      stock: 12,
    },
    {
      id: 'spinach',
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
  const [rulesButton, setRulesButton] = useState(false);
  const [doorButtonState, setDoorButtonState] = useState(false);
  const [updatedGlobalScores, setUpdatedGlobalScores] = useState(
    props.allScores,
  );
  const [updatedPersonalScores, setUpdatedPersonalScores] = useState(
    props.personalScores,
  );

  async function handleSaveScore() {
    scoreState = true;
    if (props.userId) {
      const saveScoreResponse = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alias: alias,
          score: score,
          userId: props.userId,
        }),
      });

      const saveScoreResponseBody = await saveScoreResponse.json();

      if ('errors' in saveScoreResponseBody) {
        setErrors(saveScoreResponseBody.errors);
        return;
      }
      const finalUpdatedGlobalScores = updatedGlobalScores;
      if (
        saveScoreResponseBody.newScore.score > finalUpdatedGlobalScores[9].score
      ) {
        finalUpdatedGlobalScores.pop();
        finalUpdatedGlobalScores.push(saveScoreResponseBody.newScore);
        finalUpdatedGlobalScores.sort((a, b) => {
          return b.score - a.score;
        });

        setUpdatedGlobalScores(finalUpdatedGlobalScores);
      }

      const finalUpdatedPersonalScores = updatedPersonalScores;
      if (finalUpdatedPersonalScores.length > 9) {
        if (
          saveScoreResponseBody.newScore.score >
          finalUpdatedPersonalScores[9].score
        ) {
          finalUpdatedPersonalScores.pop();
          finalUpdatedPersonalScores.push(saveScoreResponseBody.newScore);

          finalUpdatedPersonalScores.sort((a, b) => {
            return b.score - a.score;
          });
          setUpdatedPersonalScores(finalUpdatedPersonalScores);
        }
      } else {
        finalUpdatedPersonalScores.push(saveScoreResponseBody.newScore);
        finalUpdatedPersonalScores.sort((a, b) => {
          return b.score - a.score;
        });
        setUpdatedPersonalScores(finalUpdatedPersonalScores);
      }
    }
  }

  // FUNCTIONS

  function handleRestart() {
    // page.reload
    router.reload(window.location.pathname);
  }

  function handleShowHighscores() {
    setHighscoreButton(!highscoreButton);
    setRulesButton(false);
  }
  function handleBackupDoor() {
    setDoorButtonState(!doorButtonState);
  }

  function handleHighscoreToggleButton() {
    setHighscoreGlobalScoresButton(!highscoreGlobalScoresButton);
  }
  function handleRulesToggleButton() {
    setRulesButton(!rulesButton);
    setHighscoreButton(false);
  }
  function play() {
    setStartTime(performance.now() - pauseTime);
    setPauseTime(undefined);
    setRulesButton(false);
    setHighscoreButton(false);
  }

  let timerId;
  function pause() {
    setPauseTime(displayTime);
    clearInterval(timerId);
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
    setPauseTime(displayTime);
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
      if (dragQueens[i].patienceMeter === 5) {
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
          <button css={pauseButtonStyles} onClick={pause} />
          <div css={ingredientsStyles}>
            {/* the drag queens */}
            {dragQueens.map((dragQueen) => (
              <div
                // move this to button later
                key={`dragQueen-${dragQueen.id}`}
              >
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
            ))}{' '}
            {/* the ingredients */}
            <div css={ingredientButtonParentStyles}>
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
                        <div css={numberLabelParentStyles}>
                          <p css={numberLabelStyles}>
                            {singleIngredientInfo.amount}
                          </p>
                        </div>
                      );
                    }
                  })}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleBackupDoor}
            css={doorStyles(doorButtonState)}
          />

          {/* THE BACKUP INGREDIENTS */}
          {doorButtonState ? (
            <div css={containerButtonParentStyles}>
              {ingredientInfo.map((ingredient) => (
                <button
                  css={containerButtonStyles}
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
          ) : (
            <div />
          )}

          <div css={fliesStyles(flies)} />
          <div tabIndex="0" css={flySwatterStyles}>
            <Image
              src="/flyswatter.png"
              width="100"
              height="210"
              onClick={() => {
                setFlies({
                  state: false,
                  enterTime: 0,
                  ingredientPosition: 0,
                });
              }}
            />
          </div>
          <div css={blenderStyles}>
            <Image src="/blender.png" width="145" height="300" />
          </div>

          <Image src="/table.png" width="640" height="380" />
        </div>
        {!gameOver && paused && displayTime > 0 ? (
          <div css={pauseMenuStyles}>
            PAUSE MENU
            <button onClick={handleRulesToggleButton}>RULES</button>
            <button onClick={handleShowHighscores}>HIGH SCORES</button>
            <button onClick={play}>Resume</button>
            <button onClick={handleRestart}>START OVER</button>
            {rulesButton ? <div>THE RULES</div> : <div />}
            {highscoreButton ? (
              <div>
                <div>HIGH SCORES</div>
                {highscoreGlobalScoresButton ? (
                  <div css={highscoreGridStyles}>
                    TOP 10 GLOBAL SCORES
                    {updatedGlobalScores.map((globalScore) => {
                      return (
                        <div
                          key={`global-${globalScore.alias}-${
                            globalScore.score
                          }-${Math.random() * 1000}`}
                        >
                          <div>{globalScore.alias}</div>
                          <div>{globalScore.score}</div>
                          <div>{props.allScores.indexOf(globalScore) + 1}</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div css={highscoreGridStyles}>
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
                          <div>
                            {updatedPersonalScores.indexOf(personalScore) + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {props.userId ? (
                  <button onClick={handleHighscoreToggleButton}>
                    {highscoreGlobalScoresButton
                      ? 'SHOW PERSONAL SCORES'
                      : 'SHOW GLOBAL SCORES'}
                  </button>
                ) : (
                  <div />
                )}
              </div>
            ) : (
              <div />
            )}
          </div>
        ) : (
          <div />
        )}
        {!gameOver && paused && displayTime === 0 ? (
          <div>
            <div css={startMenuStyles}>
              START MENU
              <button onClick={handleRulesToggleButton}>RULES</button>
              <button onClick={handleShowHighscores}>HIGH SCORES</button>
              <button onClick={play}>START</button>
              {rulesButton ? <div>THE RULES</div> : <div />}
              {highscoreButton ? (
                <div>
                  <div>HIGH SCORES</div>
                  {highscoreGlobalScoresButton ? (
                    <div css={highscoreGridStyles}>
                      TOP 10 GLOBAL SCORES
                      <div>
                        <div>NAME</div>
                        <div>SCORE</div>
                        <div>RANK</div>
                      </div>
                      {updatedGlobalScores.map((globalScore) => {
                        return (
                          <div
                            key={`global-${globalScore.alias}-${
                              globalScore.score
                            }-${Math.random() * 1000}`}
                          >
                            <div>{globalScore.alias}</div>
                            <div>{globalScore.score}</div>
                            <div>
                              {props.allScores.indexOf(globalScore) + 1}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div css={highscoreGridStyles}>
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
                            <div>
                              {updatedPersonalScores.indexOf(personalScore) + 1}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {props.userId ? (
                    <div>
                      <button onClick={handleHighscoreToggleButton}>
                        {highscoreGlobalScoresButton
                          ? 'SHOW PERSONAL SCORES'
                          : 'SHOW GLOBAL SCORES'}
                      </button>
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              ) : (
                <div />
              )}
              <div>
                {props.userId ? (
                  <div>
                    <span>{props.username}</span>

                    <Link href="/logout">logout</Link>
                  </div>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div />
        )}
        {gameOver && !scoreState && props.userId ? (
          <div>
            <div css={gameOverMenuStyles}>
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
              <button onClick={handleRestart}>RESTART</button>
            </div>
          </div>
        ) : (
          <div />
        )}
        {!scoreState && !props.userId ? (
          <div>
            <div css={gameOverMenuStyles}>
              <div>GAME OVER</div>
              <div>SCORE: {score} </div>
              <div>HIGH SCORES</div>
              <div css={highscoreGridStyles}>
                {props.allScores.map((globalScore) => {
                  return (
                    <div
                      key={`global-${globalScore.alias}-${globalScore.score}-${
                        Math.random() * 1000
                      }`}
                    >
                      <div>{globalScore.alias}</div>
                      <div>{globalScore.score}</div>
                      <div>{props.allScores.indexOf(globalScore) + 1}</div>
                    </div>
                  );
                })}
              </div>

              <button onClick={handleRestart}>PLAY AGAIN?</button>
            </div>
          </div>
        ) : (
          <div />
        )}
        {scoreState ? (
          <div>
            <div css={highscoreMenuStyles}>
              <div>HIGH SCORES</div>
              {highscoreGlobalScoresButton ? (
                <div css={highscoreGridStyles}>
                  TOP 10 GLOBAL SCORES
                  {updatedGlobalScores.map((globalScore) => {
                    return (
                      <div
                        key={`global-${globalScore.alias}-${
                          globalScore.score
                        }-${Math.random() * 1000}`}
                      >
                        <div>{globalScore.alias}</div>
                        <div>{globalScore.score}</div>
                        <div>{props.allScores.indexOf(globalScore) + 1}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div css={highscoreGridStyles}>
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
                        <div>
                          {updatedPersonalScores.indexOf(personalScore) + 1}
                        </div>
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
          </div>
        ) : (
          <div />
        )}
      </div>
      <div>
        {dragQueens.map((dragQueen) => (
          <div
            // move this to button later
            key={`dragQueen-${dragQueen.id}`}
          >
            <div>
              DragQueen: {dragQueen.id} Anger: {dragQueen.patienceMeter}
            </div>
          </div>
        ))}
      </div>
      <div>{formatTimer(displayTime)}</div>
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
