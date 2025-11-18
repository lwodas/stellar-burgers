import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getOrders } from '@slices';
import { fetchOrders } from '../../services/slices/orders/ordersActions';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(getOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
