import { css } from '@emotion/react';
import Image from 'next/image.js';
import { useEffect, useState } from 'react';
import { Recipes } from './components/Recipes.js';

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

export default function GamePage() {
  const [score, setScore] = useState(0);
  const [ingredientCounters, setIngredientCounters] = useState([
    {
      id: 'bananas',
      amount: 0,
    },
    {
      id: 'strawberries',
      amount: 0,
    },
    {
      id: 'ice',
      amount: 0,
    },
    {
      id: 'peanutButter',
      amount: 0,
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
      state: true,
      position: Math.floor(Math.random() * (600 - 200 + 1) + 200),
    },
    {
      id: 2,
      state: true,
      position: Math.floor(Math.random() * (600 - 200 + 1) + 200),
    },
    {
      id: 3,
      state: true,
      position: Math.floor(Math.random() * (600 - 200 + 1) + 200),
    },
    {
      id: 4,
      state: true,
      position: Math.floor(Math.random() * (600 - 200 + 1) + 200),
    },
  ]);

  const ingredientInfo = containerCounters.map((container) => {
    return {
      ...container,
      amount: ingredientCounters.find(
        (ingredient) => ingredient.id === container.id,
      ).amount,
    };
  });
  console.log('ingredientCounters', ingredientCounters);
  console.log('containerCounters', containerCounters);
  console.log('ingredientInfo', ingredientInfo);

  function generateIngredientCounters() {
    setIngredientCounters(
      ingredientCounters.map((ingredient) => {
        return { ...ingredient, amount: Math.floor(Math.random() * 4 + 1) };
      }),
    );
  }
  useEffect(() => {
    generateIngredientCounters();
  }, []);
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
            css={dragQueenStyles(dragQueen)}
            onClick={() => {
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
                generateIngredientCounters();
                setScore(score + 10);
              }
            }}
          >
            {dragQueen.id}
          </div>
        ))}

        <div>
          {/* the ingredients */}
          {ingredientInfo.map((ingredient) => (
            <button
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
            onClick={() => {
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
            }}
          >
            Set Drag Queen {dragQueen.id} To True
            <br />
            state: {dragQueen.state.toString()}
          </button>
        ))}
      </div>
      <div css={containerIngredientsStyles}>
        {/* THE BACKUP INGREDIENTS */}
        {ingredientInfo.map((ingredient) => (
          <button
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
      </div>
    </div>
  );
}
