import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import { createOrder, clearOrder } from '../../services/slices/ordersSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';
import {
  addProfileOrder,
  fetchUserOrders
} from '../../services/slices/profileOrdersSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { bun, ingredients } = useAppSelector(
    (state) => state.burgerConstructor
  );
  const { orderRequest, orderModalData } = useAppSelector(
    (state) => state.orders
  );
  const user = useAppSelector((state) => state.auth.user);

  const onOrderClick = async () => {
    if (!bun || orderRequest) return;

    if (!user || !user.email) {
      navigate('/login');
      return;
    }

    const ingredientsIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    const resultAction = await dispatch(createOrder(ingredientsIds));

    if (createOrder.fulfilled.match(resultAction)) {
      const normalizedOrder = {
        ...resultAction.payload,
        ingredients: resultAction.payload.ingredients || []
      };

      dispatch(addProfileOrder(normalizedOrder));
      dispatch(fetchUserOrders());
    }
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce((acc, item) => acc + item.price, 0),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
