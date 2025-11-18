import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { addIngredient, addBun } from '@slices';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const dispatch = useDispatch();

    const location = useLocation();

    const handleAdd = () => {
      ingredient.type === 'bun'
        ? dispatch(addBun(ingredient))
        : dispatch(addIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
