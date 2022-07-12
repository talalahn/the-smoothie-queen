import { css } from '@emotion/react';
import Image from 'next/image.js';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
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

const containerIngredientsStyles = css`
  margin-top: 400px;
  > button {
    margin-right: 10px;
  }
`;

const fliesStyles = (flies) => css`
  border: 1px solid black;
  padding: 10px;
  position: absolute;
  left: ${flies.state ? '200px' : '20px'};
`;
// TODOS:
// - save score into database
// - take score from database and display on menu
// - display score in game over screen
// - figure out how to make sprite work with patienceMeter
// - create array of coordinates for each ingredientPosition
// - create start menu
//        - start button
//        - not logged in? message: your score will not be saved
//        - button: rules -> rules show up
// - create game over Menu
//        - input field (varchar3) enter name
//        - save score into database
//        - take score from database and display on gameover menu
//        - sort scores on database
//        - take top 10 scores from database and display on gameoverMenu

// list state up of paused
let paused;
let displayTime;
let roundedDisplayTime;
let gameOver = false;
let intervalDependentFunctions = [];

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
function Timer() {
  const [startTime, setStartTime] = useState(0);
  const [pauseTime, setPauseTime] = useState(0);
  const router = useRouter();
  function handleRestart() {
    // page.reload
    router.reload(window.location.pathname);
  }

  paused = pauseTime !== undefined;
  const frameTime = useFrameTime();
  displayTime = paused ? pauseTime : frameTime - startTime;
  let timerId;
  function pause() {
    setPauseTime(displayTime);
    clearInterval(timerId);
  }
  function play() {
    setStartTime(performance.now() - pauseTime);
    setPauseTime(undefined);
  }

  if (!gameOver) {
    return (
      <>
        <div>{formatTimer(displayTime)}</div>
        <button onClick={paused ? play : pause}>
          {' '}
          {paused ? 'Play' : ' Pause'}
        </button>
        <div css={pauseMenuStyles(paused)}>PAUSE MENU</div>
      </>
    );
  } else {
    return (
      <div css={gameOverMenuStyles(gameOver)}>
        <div>GAME OVER</div>
        {/* get score from database */}
        <div>SCORE: </div>
        <button onClick={handleRestart}>PLAY AGAIN?</button>
      </div>
    );
  }
}

export default function GamePage() {
  const [score, setScore] = useState(0);
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
    console.log('GAME OVER');
    gameOver = true;
  }

  const spoilFood = useCallback(() => {
    if (flies.state) {
      setIngredientCounters((prevState) => {
        return prevState.map((ingredient) => {
          if (roundedDisplayTime >= flies.enterTime + 6000) {
            if (prevState.indexOf(ingredient) === flies.ingredientPosition) {
              console.log('foodSpoils');
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
    console.log(roundedDisplayTime);
    // use function as argument in useState (prevState)
    setDragQueens((prevState) => {
      return prevState.map((dragQueen) => {
        if (
          dragQueen.state &&
          roundedDisplayTime >= dragQueen.enterTime + 6000
        ) {
          console.log(`this drag is getting angry ${dragQueen.id} `);
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
          <Image src="/background.png" width="640" height="380" />
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

        <div>
          {/* the ingredients */}
          {ingredientInfo.map((ingredient) => (
            <button
              key={`ingredient-${ingredient.id}`}
              onClick={() => {
                setIngredientCounters(
                  ingredientCounters.map((oldIngredient) => {
                    // check if this is the one i'm clicking
                    if (ingredient.id === oldIngredient.id) {
                      if (oldIngredient.spoiled && !flies.state) {
                        console.log('food no longer spoiled');
                        return {
                          ...ingredient,
                          spoiled: false,
                        };
                      }
                      // check if the one i'm clicking has an amount of 0
                      else if (ingredient.amount > 0 && ingredient.stock > 0) {
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
                        console.log('food thrown away');
                        return {
                          ...container,
                          stock: 0,
                        };
                      }
                      // check if the one i'm clicking has an amount of 0
                      else if (container.stock > 0) {
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

        <br />

        <button
          onClick={() => {
            console.log(dragQueens);
            // dragQueens[1].patienceMeter = 3;
            console.log(flies);
            console.log(ingredientCounters);
            console.log(ingredientInfo);
          }}
        >
          console.log
        </button>
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
        <button
          onClick={() => {
            if (!flies.state) {
              setFlies({
                state: true,
                enterTime: roundedDisplayTime,
                ingredientPosition: Math.floor(
                  Math.random() * ingredientCounters.length,
                ),
              });
            }
          }}
        >
          Set flies to true
        </button>
        <button
          onClick={() => {
            setFlies({
              state: false,
              enterTime: 0,
              ingredientPosition: 0,
            });
          }}
        >
          Set flies to false
        </button>
        <div css={fliesStyles(flies)}>THE FLIES</div>

        <div>{Timer()}</div>
      </div>
    </div>
  );
}
