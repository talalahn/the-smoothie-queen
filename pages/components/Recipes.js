import { useEffect, useState } from 'react';

export function Recipes() {
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

  useEffect(() => {
    function generateIngredientCounters() {
      setIngredientCounters(
        ingredientCounters.map((ingredient) => {
          return { ...ingredient, amount: Math.floor(Math.random() * 4 + 1) };
        }),
      );
    }

    generateIngredientCounters();
  }, []);
  return (
    <div>
      {ingredientCounters.map((ingredient) => (
        <button
          onClick={() => {
            setIngredientCounters(
              ingredientCounters.map((oldIngredient) => {
                if (
                  ingredient.id === oldIngredient.id &&
                  ingredient.amount >= 1
                ) {
                  return { ...oldIngredient, amount: oldIngredient.amount - 1 };
                } else {
                  return { ...oldIngredient };
                }
              }),
            );
          }}
        >
          {ingredient.id}
          {ingredient.amount}
        </button>
      ))}
    </div>
  );
}
