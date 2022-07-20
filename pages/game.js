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

const backButtonStyles = css`
  position: absolute;
  width: 50px;
  top: 1%;
  left: 1%;
  cursor: pointer;
`;

const rulesMenuStyles = css`
  pointer-events: none;
  /* opacity: 10%; */
`;

const logoutStyles = css`
  position: absolute;
  bottom: 0%;
  left: 40%;
  display: flex;
  gap: 10px;
  align-items: center;

  > p {
    color: #d23ccf;
  }
  img {
    cursor: pointer;
  }
`;

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

const scoreBannerStyles = css`
  position: absolute;
  top: 1%;
  left: 1%;
  z-index: 100000000;
`;

const scoreNumberStyles = css`
  position: absolute;
  top: 2%;
  left: 18%;
  font-size: 20px;
  color: #f28af1;
  z-index: 100000000;
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
  z-index: 103;

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
const tableStyles = css`
  pointer-events: none;
`;

const doorStyles = (doorButtonState) => css`
  position: absolute;
  width: ${doorButtonState ? '190px' : '173px'};
  height: ${doorButtonState ? '270px' : '158px'};
  transform: scale(0.5);
  top: ${doorButtonState ? '39%' : '60%'};
  left: ${doorButtonState ? '68%' : '70%'};
  padding: 0;
  background: none;
  border: none;
  z-index: 101;

  background-image: url(${doorButtonState ? 'box_open.png' : 'box_closed.png'});
`;

const pauseMenuStyles = css`
  width: 620px;
  height: 300px;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  background-color: none;
  color: white;
  background-image: url('/pause-menu.png');
  background-size: cover;
  text-align: center;
  text-justify: center;
  border-radius: 20px;
  div {
    position: relative;
    top: 75%;
    cursor: pointer;
  }
`;
const startMenuStyles = css`
  width: 640px;
  height: 380px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  background-image: url('/app-background.png');
  background-size: cover;
  color: white;
  text-align: center;
  text-justify: center;
`;

const startPageLinkStyles = css`
  position: absolute;
  top: 75%;
  left: 48%;
  transform: translate(-50%, -50%);
  display: flex;
  width: 400px;
  gap: 10px;

  img {
    cursor: pointer;
  }
`;

const gameOverMenuStyles = css`
  width: 640px;
  height: 380px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  background-image: url('game-over.png');
  background-size: cover;
  color: white;
  text-align: center;
  text-justify: center;

  > span {
    position: absolute;
    color: #d23ccf;
    font-size: 18px;
    top: 67%;
    left: 40%;
    font-weight: bold;
  }

  > input {
    position: absolute;
    top: 74.8%;
    left: 40%;
    border-radius: 10px;
    color: #d23ccf;
    border: 2px #d23ccf solid;
    width: 45px;
    background-color: transparent;
    text-align: center;
    font-size: 18px;
    text-transform: uppercase;
    font-weight: bold;
  }

  > button :first-of-type {
    position: absolute;
    background-color: transparent;
    width: 75px;
    height: 24px;
    box-shadow: none;
    border: none;
    top: 75.8%;
    left: 63.5%;
    cursor: pointer;
  }

  > button :nth-of-type(2) {
    position: absolute;
    width: 120px;
    height: 50px;
    box-shadow: none;
    border: none;
    background-color: transparent;
    top: 84%;
    left: 80%;
    cursor: pointer;
  }

  > div > div {
    display: grid;
    grid-template-columns: 50px 50px 50px;
    grid-template-rows: 5px 5px 5px;
    column-gap: 5px;
    row-gap: 5px;
  }
`;

const noUserGameOverMenuStyles = css`
  width: 640px;
  height: 380px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  background-image: url('game-over-1.png');
  background-size: cover;
  color: white;
  text-align: center;
  text-justify: center;

  > span {
    position: absolute;
    color: #d23ccf;
    font-size: 18px;
    top: 67%;
    left: 40%;
    font-weight: bold;
  }

  > input {
    position: absolute;
    top: 74.8%;
    left: 40%;
    border-radius: 10px;
    color: #d23ccf;
    border: 2px #d23ccf solid;
    width: 45px;
    background-color: transparent;
    text-align: center;
    font-size: 18px;
    text-transform: uppercase;
    font-weight: bold;
  }

  > button :first-of-type {
    position: absolute;
    width: 120px;
    height: 55px;
    box-shadow: none;
    border: none;
    background-color: transparent;
    top: 84%;
    left: 0%;
    cursor: pointer;
  }

  > button :nth-of-type(2) {
    position: absolute;
    width: 120px;
    height: 50px;
    box-shadow: none;
    border: none;
    background-color: transparent;
    top: 84%;
    left: 80%;
    cursor: pointer;
  }

  > div > div {
    display: grid;
    grid-template-columns: 50px 50px 50px;
    grid-template-rows: 5px 5px 5px;
    column-gap: 5px;
    row-gap: 5px;
  }
`;
const highscoreMenuStyles = css`
  width: 640px;
  height: 380px;
  top: 0%;
  left: 0%;
  position: absolute;
  text-align: center;
  text-justify: center;
  /* pointer-events: none; */
`;

const highscoreGridStyles = css`
  position: absolute;
  top: 16%;
  left: 38.5%;
  > div {
    /* height: 280px; */
    /* position: absolute; */
    /* border: 2px solid blue; */
    width: 160px;
    justify-content: center;
    /* position: relative; */
    display: grid;
    grid-template-columns: 50px 50px 50px;
    grid-template-rows: 5px 5px 5px;
    column-gap: 5px;
    row-gap: 5px;
    color: #f28af1;
    background-color: #d23ccf;
    font-weight: bold;
  }
`;

const personalGlobalScoresStyles = (highscoreGlobalScoresButton) => css`
  position: absolute;
  display: flex;
  width: 150px;
  border: 1px black solid;

  img {
    border: ${highscoreGlobalScoresButton ? 'white 2px solid' : 'none'};
  }
`;

const dragQueenStyles = (dragQueen) => css`
  border: none;
  padding: 0;
  background: none;
  background-color: none;
  height: 578px;
  width: 427px;
  position: absolute;
  top: -60%;
  right: ${dragQueen.position}px;
  transform: translate(-50%, -50%) translateX(765px)
    translateY(${dragQueen.state ? '0px' : '200px'}) scale(0.5);
  transition: transform 1000ms;
  transition-timing-function: linear;
  background-image: url('/dragQueens/${dragQueen.id}/${dragQueen.id}-${dragQueen.patienceMeter}.png');
  :hover {
    cursor: pointer;
  }
`;

const ingredientButtonStyles = (ingredient) => css`
  border: none;
  background: none;
  background-color: none;
  height: 100px;
  width: 200px;
  transform: scale(0.5);
  background-image: url(${ingredient.spoiled ? `greensmoke.png` : `/`}),
    url('/${ingredient.id}/${ingredient.id}-${ingredient.stock}.png');
  z-index: 101;
  cursor: pointer;
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
  border: none;
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
  border: none;
  font-size: 5px;
  z-index: 101;
  cursor: pointer;
`;
const containerButtonParentStyles = css`
  display: grid;
  grid-template-columns: 35px 35px;
  grid-template-rows: 35px 35px;
  column-gap: 1px;
  row-gap: 1px;
  position: absolute;
  left: 77%;
  bottom: 10%;
  z-index: 101;
`;
const playPauseButtonStyles = css`
  position: absolute;
  width: 50px;
  height: 52px;
  top: 1%;
  left: 91%;
  background-color: #d23ccf;
  border: none;
  padding: none;
  cursor: pointer;
`;

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
  // random positions commented out until collision detection is donne
  const [dragQueens, setDragQueens] = useState([
    {
      id: 1,
      state: false,
      position: 480,
      // Math.floor(Math.random() * (450 - 100 + 1) + 100),
      enterTime: 0,
      patienceMeter: 0,
    },
    {
      id: 2,
      state: false,
      position: 350,
      // Math.floor(Math.random() * (450 - 100 + 1) + 100),
      enterTime: 0,
      patienceMeter: 0,
    },
    {
      id: 3,
      state: false,
      position: 200,
      // Math.floor(Math.random() * (450 - 100 + 1) + 100),
      enterTime: 0,
      patienceMeter: 0,
    },
    {
      id: 4,
      state: false,
      position: 70,
      // Math.floor(Math.random() * (450 - 100 + 1) + 100),
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
    gameOver = false;
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
  function handleRulesToggleButtonButton() {
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
              // position: Math.floor(Math.random() * (450 - 100 + 1) + 100),
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
          if (roundedDisplayTime >= flies.enterTime + 8000) {
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
          roundedDisplayTime >= dragQueen.enterTime + 10000
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
        interval: 7000,
        preceedingInterval: 0,
      },
      {
        id: 2,
        function: makeFliesTrue,
        interval: 12000,
        preceedingInterval: 0,
      },
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
      intervalDependentFunctions[0].interval = 6000;
      intervalDependentFunctions[1].interval = 10000;
    } else if (score >= 100) {
      intervalDependentFunctions[0].interval = 5000;
      intervalDependentFunctions[1].interval = 8000;
    } else if (score >= 150) {
      intervalDependentFunctions[0].interval = 4000;
      intervalDependentFunctions[1].interval = 6000;
    }
  }, [score]);

  return (
    <div>
      <div>
        <div css={wrapperStyles}>
          <div css={scoreBannerStyles}>
            <Image src="/score.png" width="186" height="33" alt="score" />
          </div>
          <div css={scoreNumberStyles}>
            <span>{score}</span>
          </div>

          {paused ? (
            <button css={playPauseButtonStyles} onClick={play}>
              <Image src="/play-btn.png" width="50" height="52" />
            </button>
          ) : (
            <button css={playPauseButtonStyles} onClick={pause}>
              <Image src="/pause-btn.png" width="50" height="52" />
            </button>
          )}

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
                          // hit test Code to implement later
                          // function click(e = null) {
                          //   if (
                          //     dragQueen.hitTest(
                          //       (0, 0),
                          //       0xfe,
                          //       (e.pageX, e.pageY),
                          //     )
                          //   ) {
                          //     console.log(e.pageX, e.pageY);
                          //   }
                          // }
                          // check if this is the one i'm clicking
                          if (dragQueen.id === clickedDragQueen.id) {
                            // check if the one i'm clicking is true
                            if (dragQueen.state) {
                              return {
                                ...clickedDragQueen,
                                state: false,
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
                />
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
                  {/* {' '}
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
                  })} */}
                </button>
              ))}
            </div>
          ) : (
            <div />
          )}

          <div css={fliesStyles(flies)} />
          <div css={flySwatterStyles}>
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
          <div css={tableStyles}>
            <Image src="/table-4.png" width="640" height="380" />
          </div>
        </div>
        {!gameOver && paused && displayTime > 0 ? (
          <div css={pauseMenuStyles}>
            <div>
              <Image
                onClick={handleRestart}
                src="/start-over-btn.png"
                width="140"
                height="60"
              />
            </div>
          </div>
        ) : (
          <div />
        )}
        {!gameOver && paused && displayTime === 0 ? (
          <div>
            <div css={startMenuStyles}>
              <div>
                {props.userId ? (
                  <div css={logoutStyles}>
                    <p>{props.username}</p>

                    <Link href="/logout">
                      <Image
                        src="/logout.png"
                        height="20"
                        width="70"
                        alt="logout"
                      />
                    </Link>
                  </div>
                ) : (
                  <div />
                )}
              </div>
              <div css={startPageLinkStyles}>
                <Image
                  onClick={handleRulesToggleButtonButton}
                  src="/rules-btn.png"
                  alt="rules button"
                  width="388"
                  height="155"
                />

                <Image
                  onClick={handleShowHighscores}
                  src="/highscores-btn.png"
                  alt="highscores button"
                  width="388"
                  height="155"
                />

                <Image
                  onClick={play}
                  src="/start-btn.png"
                  alt="start button"
                  width="388"
                  height="155"
                />
              </div>

              {rulesButton ? (
                <div>
                  <div css={backButtonStyles}>
                    <div>
                      <Image
                        onClick={handleRulesToggleButtonButton}
                        src="/x-btn.png"
                        width="50"
                        height="52"
                      />
                    </div>
                  </div>
                  <div css={rulesMenuStyles}>
                    <Image src="/rules.png" width="640" height="380" />
                  </div>
                </div>
              ) : (
                <div />
              )}
              {highscoreButton ? (
                <div>
                  <div css={backButtonStyles}>
                    <div>
                      <div css={highscoreMenuStyles}>
                        <Image src="/highscores.png" width="640" height="380" />
                      </div>
                      <Image
                        onClick={handleShowHighscores}
                        src="/x-btn.png"
                        width="50"
                        height="52"
                      />
                    </div>
                  </div>
                  {highscoreGlobalScoresButton ? (
                    <div css={highscoreGridStyles}>
                      <div>
                        <div>RANK</div>
                        <div>NAME</div>
                        <div>SCORE</div>
                      </div>
                      {updatedGlobalScores.map((globalScore) => {
                        return (
                          <div
                            key={`global-${globalScore.alias}-${
                              globalScore.score
                            }-${Math.random() * 1000}`}
                          >
                            <div>
                              {props.allScores.indexOf(globalScore) + 1}
                            </div>
                            <div>{globalScore.alias}</div>
                            <div>{globalScore.score}</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div css={highscoreGridStyles}>
                      <div>
                        <div>RANK</div>
                        <div>NAME</div>
                        <div>SCORE</div>
                      </div>
                      {updatedPersonalScores.map((personalScore) => {
                        return (
                          <div
                            key={`personal-${personalScore.alias}-${
                              personalScore.score
                            }-${Math.random() * 1000}`}
                          >
                            <div>
                              {updatedPersonalScores.indexOf(personalScore) + 1}
                            </div>
                            <div>{personalScore.alias}</div>
                            <div>{personalScore.score}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {props.userId ? (
                    <div>
                      <div>
                        {highscoreGlobalScoresButton ? (
                          <Image
                            src="/personal-scores-btn.png"
                            width="265"
                            height="48"
                            alt="personal scores button"
                          />
                        ) : (
                          <Image
                            src="/global-scores-btn.png"
                            width="265"
                            height="48"
                            alt="global scores button"
                          />
                        )}
                      </div>
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
            </div>
          </div>
        ) : (
          <div />
        )}
        {gameOver && !scoreState && props.userId ? (
          <div>
            <div css={gameOverMenuStyles}>
              <span> {score} </span>
              <input
                value={alias}
                maxLength="3"
                required
                onChange={(event) => {
                  setAlias(event.currentTarget.value);
                }}
              />
              <button onClick={() => handleSaveScore()}>
                <Image
                  src="/submit-btn.png"
                  height="24"
                  width="78"
                  alt="submit button"
                />
              </button>

              {errors.map((error) => (
                <span key={`error${error.message}`}>{error.message}</span>
              ))}
              <button onClick={handleRestart}>
                <Image
                  src="/restart-btn.png"
                  height="118"
                  width="278"
                  alt="restart button"
                />
              </button>
            </div>
          </div>
        ) : (
          <div />
        )}
        {gameOver && !scoreState && !props.userId ? (
          <div>
            <div css={noUserGameOverMenuStyles}>
              <span>{score} </span>
              {/* <div>HIGH SCORES</div>
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
              </div> */}
              <button onClick={handleShowHighscores}>
                <Image
                  src="/highscores-btn.png"
                  width="388"
                  height="155"
                  alt="highscores button"
                />
              </button>
              <button onClick={handleRestart}>
                <Image
                  src="/restart-btn.png"
                  height="118"
                  width="278"
                  alt="restart button"
                />
              </button>
            </div>
          </div>
        ) : (
          <div />
        )}
        {scoreState ? (
          <div>
            <div css={gameOverMenuStyles}>
              <div css={highscoreMenuStyles}>
                <Image src="/highscores.png" width="640" height="380" />
              </div>
              {highscoreGlobalScoresButton ? (
                <div css={highscoreGridStyles}>
                  <div>
                    <div>RANK</div>
                    <div>NAME</div>
                    <div>SCORE</div>
                  </div>
                  {updatedGlobalScores.map((globalScore) => {
                    return (
                      <div
                        key={`global-${globalScore.alias}-${
                          globalScore.score
                        }-${Math.random() * 1000}`}
                      >
                        <div>{props.allScores.indexOf(globalScore) + 1}</div>
                        <div>{globalScore.alias}</div>
                        <div>{globalScore.score}</div>
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
              <div
                css={personalGlobalScoresStyles(highscoreGlobalScoresButton)}
              >
                <Image
                  src="/personal-scores-btn.png"
                  width="132"
                  height="24"
                  alt="personal scores button"
                />

                <Image
                  src="/global-scores-btn.png"
                  width="265"
                  height="48"
                  alt="global scores button"
                />
              </div>
              <button onClick={handleHighscoreToggleButton}>
                {highscoreGlobalScoresButton
                  ? 'SHOW PERSONAL SCORES'
                  : 'SHOW GLOBAL SCORES'}
              </button>
            </div>
          </div>
        ) : (
          <div />
        )}
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
