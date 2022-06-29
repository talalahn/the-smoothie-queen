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
`;

const boxStyles = css`
  height: 100px;
  width: 50px;
  position: absolute;
  margin-top: -200px;
  margin-left: 400px;
`;
const dragQueenStyles = (dragQueen) => css`
  background-color: pink;
  border: 1px solid black;
  border-radius: 50%;
  padding: ${dragQueen.state ? '10px' : 0};
  text-align: center;
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

  const [dragQueens, setDragQueens] = useState([
    {
      id: 1,
      state: true,
    },
    {
      id: 2,
      state: true,
    },
    {
      id: 3,
      state: true,
    },
    {
      id: 4,
      state: true,
    },
  ]);

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
      {score}
      <div>
        <div>
          <Image src="/background.png" width="640" height="380" />
        </div>
        <div css={boxStyles}>
          {dragQueens.map((dragQueen) => (
            <div css={dragQueenStyles(dragQueen)}>{dragQueen.id}</div>
          ))}
        </div>

        <div>
          {ingredientCounters.map((ingredient) => (
            <button
              onClick={() => {
                setIngredientCounters(
                  ingredientCounters.map((oldIngredient) => {
                    // check if this is the one i'm clicking
                    if (ingredient.id === oldIngredient.id) {
                      // check if the one i'm clicking has an amount of 0
                      if (ingredient.amount > 0) {
                        return {
                          ...oldIngredient,
                          amount: oldIngredient.amount - 1,
                        };
                      } else {
                        setScore(score - 5);
                        return { ...oldIngredient };
                      }
                    } else {
                      return { ...oldIngredient };
                    }
                  }),
                );
              }}
            >
              {ingredient.id}
              <br />
              {ingredient.amount}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            ingredientCounters.map((ingredient) => {
              if (ingredient.amount === 0) {
                generateIngredientCounters();
                setScore(score + 10);
              }
            });
          }}
        >
          GIVE TO CUSTOMER
        </button>
        <br />
        {dragQueens.map((dragQueen) => (
          <button
            onClick={() => {
              setDragQueens(
                dragQueens.map((clickedDragQueen) => {
                  // check if this is the one i'm clicking
                  if (dragQueen.id === clickedDragQueen.id) {
                    // check if the one i'm clicking is true
                    if (dragQueen.state) {
                      return {
                        ...clickedDragQueen,
                        state: false,
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
            Move Drag Queen{dragQueen.id}
            <br />
            {dragQueen.state.toString()}
          </button>
        ))}
      </div>
    </div>
  );
}
