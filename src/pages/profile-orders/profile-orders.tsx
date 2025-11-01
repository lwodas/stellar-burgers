import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  fetchUserOrders,
  profileOrdersReducer
} from '../../services/slices/profileOrdersSlice';
import { ProfileOrdersUI } from '../../components/ui/pages/profile-orders';
import { Preloader } from '@ui';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.profileOrders);

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUserOrders());
  }, [dispatch]);

  console.log(orders.length);

  if (loading) {
    return <Preloader />;
  }
  return <ProfileOrdersUI orders={orders} />;
};
