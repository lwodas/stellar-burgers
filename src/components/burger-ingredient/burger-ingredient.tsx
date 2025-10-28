import { FC, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../services/store';
import { addBun, addIngredient } from '../../services/slices/constructorSlice';
import { setCurrentIngredient } from '../../services/slices/modalSlice';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { v4 as uuidv4 } from 'uuid';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredient));
      } else {
        const constructorIngredient = {
          ...ingredient,
          id: uuidv4()
        };
        dispatch(addIngredient(constructorIngredient));
      }
    };

    const handleIngredientClick = () => {
      dispatch(setCurrentIngredient(ingredient));
      navigate(`/ingredients/${ingredient._id}`, {
        state: { background: location }
      });
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
        onClick={handleIngredientClick}
      />
    );
  }
);
