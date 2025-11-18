import { FC, memo } from 'react';
import { Preloader } from '@ui';
import { OrdersListProps } from './type';
import { OrdersListUI } from '@ui';

export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  if (!orders.length) {
    return <Preloader />;
  }
  const orderByDate = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return <OrdersListUI orderByDate={orderByDate} />;
});
