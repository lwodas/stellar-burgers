import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { postOrderBurger } from '../../services/slices/constructor/constructorActions';
import {
  getBurgerItems,
  getOrderRequest,
  getOrderModalData,
  resetOrderModalData
} from '@slices';

import { getUser } from '@slices';
export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  /*
  const constructorItems = {
    bun: {
      price: 0
    },
    ingredients: []
  };

  const orderRequest = false;

  const orderModalData = null;
  */
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const constructorItems = useSelector(getBurgerItems);

  const orderRequest = useSelector(getOrderRequest);

  const orderModalData = useSelector(getOrderModalData);

  const user = useSelector(getUser);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (!constructorItems.bun || orderRequest) return;
    const ingredientIds: string[] = [constructorItems.bun._id];
    constructorItems.ingredients.forEach((item) =>
      ingredientIds.push(item._id)
    );
    dispatch(postOrderBurger(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(resetOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
