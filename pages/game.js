import { css } from '@emotion/react';
import Image from 'next/image.js';
import React, { useEffect, useState } from 'react';
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
  left: ${flies ? '200px' : '20px'};
`;

// TO DO: DONE
//   - create array of objects intervalDependantFunctions
//       - function: makeDragQueenTrue()
//       - interval: 5000
const intervalDependentFunctions = [];

// list state up of paused
let paused;
let displayTime;

// this function sets the time (frameTime) from the moment the page reloads
function useFrameTime() {
  const [frameTime, setFrameTime] = useState();
  useEffect(() => {
    let frameId;
    function frame(timestamp) {
      // TO DO:
      // - round down timestamp to nearest thousandth
      const roundedDisplayTime = Math.floor(displayTime / 1000) * 1000;
      if (!paused) {
        console.log('RoundedTime', roundedDisplayTime);
      }

      for (let i = 0; i < intervalDependentFunctions.length; i++) {
        if (i === 0) {
        }
        if (
          roundedDisplayTime % intervalDependentFunctions[i].interval === 0 &&
          roundedDisplayTime !==
            intervalDependentFunctions[i].preceedingInterval
        ) {
          // TODO:
          // - call function that has function
          // - variable = true
          // - if variable true
          // - do function
          // - set the timeCalledNext
          // - set the new function to a new singletonFunction
          intervalDependentFunctions[i].preceedingInterval = roundedDisplayTime;
          intervalDependentFunctions[i].function();
          // console.log('WORKED');
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
  // console.log(displayTime);
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
}

export default function GamePage() {
  const [score, setScore] = useState(0);
  // TODO:
  // add useState for timeCalledNext

  // add random numbers instead of set values
  const [ingredientCounters, setIngredientCounters] = useState([
    {
      id: 'bananas',
      amount: 2,
    },
    {
      id: 'strawberries',
      amount: 3,
    },
    {
      id: 'ice',
      amount: 1,
    },
    {
      id: 'peanutButter',
      amount: 3,
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
    },
    {
      id: 2,
      state: false,
      position: Math.floor(Math.random() * (600 - 200 + 1) + 200),
    },
    {
      id: 3,
      state: false,
      position: Math.floor(Math.random() * (600 - 200 + 1) + 200),
    },
    {
      id: 4,
      state: false,
      position: Math.floor(Math.random() * (600 - 200 + 1) + 200),
    },
    {
      id: 5,
      state: false,
      position: Math.floor(Math.random() * (600 - 200 + 1) + 200),
    },
    {
      id: 6,
      state: false,
      position: Math.floor(Math.random() * (600 - 200 + 1) + 200),
    },
    {
      id: 7,
      state: false,
      position: Math.floor(Math.random() * (600 - 200 + 1) + 200),
    },
    {
      id: 8,
      state: false,
      position: Math.floor(Math.random() * (600 - 200 + 1) + 200),
    },
    {
      id: 9,
      state: false,
      position: Math.floor(Math.random() * (600 - 200 + 1) + 200),
    },
    {
      id: 10,
      state: false,
      position: Math.floor(Math.random() * (600 - 200 + 1) + 200),
    },
    {
      id: 11,
      state: false,
      position: Math.floor(Math.random() * (600 - 200 + 1) + 200),
    },
    {
      id: 12,
      state: false,
      position: Math.floor(Math.random() * (600 - 200 + 1) + 200),
    },
  ]);
  const [flies, setFlies] = useState(false);

  const ingredientInfo = containerCounters.map((container) => {
    return {
      ...container,
      amount: ingredientCounters.find(
        (ingredient) => ingredient.id === container.id,
      ).amount,
    };
  });

  // FUNCTIONS:
  function makeDragQueenTrue() {
    const falseDragQueens = dragQueens.filter((dragQueen) => {
      return !dragQueen.state;
    });
    const randomQueen =
      falseDragQueens[Math.floor(Math.random() * falseDragQueens.length)];

    // use function as argument in useState (prevState)
    setDragQueens((prevState) =>
      prevState.map((dragQueen) => {
        if (randomQueen.id === dragQueen.id) {
          return {
            ...dragQueen,
            state: true,
          };
        } else {
          return {
            ...dragQueen,
          };
        }
      }),
    );
  }
  // setDragQueens(
  //   dragQueens.map((dragQueen) => {
  //     // check if the one i'm clicking is true
  //     if (!dragQueen.state) {
  //       return {
  //         ...dragQueen,
  //         state: true,
  //       };
  //     } else {
  //       return { ...dragQueen };
  //     }
  //   }),
  // );

  function makeFliesTrue() {
    setFlies(true);
  }

  function makeDragQueenAngrier() {}

  // - add function and interval to array intervalDependentFunction...in useEffect

  // TODO:
  // add timeCalledNext which will be set to timeCalledNext+interval
  useEffect(() => {
    // add function and interval value to intervalDependentFunction
    intervalDependentFunctions.push(
      {
        function: makeDragQueenTrue,
        interval: 5000,
        preceedingInterval: 0,
      },
      { function: makeFliesTrue, interval: 8000 },
      { function: makeDragQueenAngrier, interval: 6000 },
    );
  }, []);

  // TO DO:
  // - create useEffect with dependency [score]
  // - change intervalDependentFunction.interval to new value

  useEffect(() => {
    if (score >= 50) {
      // intervalDependentFunction.interval === new interval value
    } else if (score >= 100) {
      // intervalDependentFunction.interval === new interval value
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
          <button
            // key={`dragQueen-${dragQueens.id}`}
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
        ))}

        <div>
          {/* the ingredients */}
          {ingredientInfo.map((ingredient) => (
            <button
              // key={`ingredient-${ingredientInfo.id}`}
              onClick={() => {
                setIngredientCounters(
                  ingredientCounters.map((oldIngredient) => {
                    // check if this is the one i'm clicking
                    if (ingredient.id === oldIngredient.id) {
                      // check if the one i'm clicking has an amount of 0
                      if (ingredient.amount > 0 && ingredient.stock > 0) {
                        return {
                          ...oldIngredient,
                          amount: oldIngredient.amount - 1,
                          // stock: oldIngredient.stock - 1,
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
                        setScore(score - 5);
                        return { ...oldIngredient };
                      } else {
                        return {
                          ...oldIngredient,
                          // stock: oldIngredient.stock - 1,
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
                      // check if the one i'm clicking has an amount of 0
                      if (ingredient.amount > 0 && container.stock > 0) {
                        return {
                          ...container,
                          stock: container.stock - 1,
                        };
                      } else if (
                        // ingredient.amount > 0 &&
                        container.stock === 0
                      ) {
                        return { ...container };
                      } else {
                        return {
                          ...container,
                          stock: container.stock - 1,
                        };
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
                    </>
                  );
                }
              })}
            </button>
          ))}
        </div>

        <br />
        {/* the buttons to set the drag queens back to true */}
        {dragQueens.map((dragQueen) => (
          <button
            // key={`dragQueenButton-${dragQueens.id}`}
            onClick={() => {
              // if (displayTime % 7 === 0) {
              setDragQueens(
                dragQueens.map((clickedDragQueen) => {
                  // check if this is the one i'm clicking
                  if (dragQueen.id === clickedDragQueen.id) {
                    // check if the one i'm clicking is true
                    if (!dragQueen.state) {
                      return {
                        ...clickedDragQueen,
                        state: true,
                      };
                    } else {
                      return { ...clickedDragQueen };
                    }
                  } else {
                    return { ...clickedDragQueen };
                  }
                }),
              );
              // }
            }}
          >
            Set Drag Queen {dragQueen.id} To True
            <br />
            state: {dragQueen.state.toString()}
          </button>
        ))}

        {/*  button that will set a random queen to true */}
        <button
          onClick={() => {
            const falseDragQueens = dragQueens.filter((dragQueen) => {
              return !dragQueen.state;
            });
            const randomQueen =
              falseDragQueens[
                Math.floor(Math.random() * falseDragQueens.length)
              ];

            setDragQueens(
              dragQueens.map((dragQueen) => {
                if (randomQueen.id === dragQueen.id) {
                  return {
                    ...dragQueen,
                    state: true,
                  };
                } else {
                  return {
                    ...dragQueen,
                  };
                }
              }),
            );
          }}
        >
          random drag queen to true
        </button>
        <button
          onClick={() => {
            console.log(dragQueens);
          }}
        >
          console.log
        </button>
      </div>
      <div css={containerIngredientsStyles}>
        {/* THE BACKUP INGREDIENTS */}
        {ingredientInfo.map((ingredient) => (
          <button
            // key={`backupIngredient-${ingredient.id}`}
            onClick={() => {
              setContainerCounters(
                containerCounters.map((container) => {
                  // check if this is the one i'm clicking
                  if (ingredient.id === container.id) {
                    // check if the stock is below 9
                    if (ingredient.stock <= 9) {
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
            setFlies(true);
          }}
        >
          Set flies to true
        </button>
        <button
          onClick={() => {
            setFlies(false);
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
