import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const params = useParams();
  const ingredientData = useSelector((state) =>
    state.ingredients.items.find((item) => item._id === params.id)
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
