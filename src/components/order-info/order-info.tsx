import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { fetchFeeds } from '../../services/slices/feedSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useAppDispatch();

  const feedOrders = useAppSelector((state) => state.feed.orders);
  const feedLoading = useAppSelector((state) => state.feed.loading);
  const ingredients = useAppSelector((state) => state.ingredients.items);

  useEffect(() => {
    if (feedOrders.length === 0) {
      dispatch(fetchFeeds());
    }
  }, [dispatch, feedOrders.length]);

  const orderData = useMemo(
    () => feedOrders.find((order) => order.number === Number(number)),
    [feedOrders, number]
  );

  const orderInfo = useMemo(() => {
    if (!orderData || ingredients.length === 0) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, itemId) => {
        const ingredient = ingredients.find((ing) => ing._id === itemId);
        if (!ingredient) return acc;

        if (!acc[itemId]) {
          acc[itemId] = {
            ...ingredient,
            count: 1
          };
        } else {
          acc[itemId].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo || feedLoading) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
