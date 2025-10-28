import { RootState } from '../store';

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;
