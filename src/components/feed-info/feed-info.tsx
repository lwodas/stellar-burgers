import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: any[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const dispatch = useAppDispatch();
  const { orders, total, totalToday } = useAppSelector((state) => ({
    orders: state.feed.orders,
    total: state.feed.total,
    totalToday: state.feed.totalToday
  }));

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
