import { createSlice } from '@reduxjs/toolkit';
import { fetchFeeds } from './feedsAction';
import { TOrdersData } from '../../../utils/types';

type TFeedsState = {
  ordersData: TOrdersData;
  loading: boolean;
  error?: string | null;
};

const initialState: TFeedsState = {
  ordersData: { orders: [], total: 0, totalToday: 0 },
  loading: false,
  error: null
};

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {
    getFeedOrders: (state) => state.ordersData.orders,
    getFeedOrdersData: (state) => state.ordersData
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.ordersData = action.payload;
        state.loading = false;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Unknown error';
      });
  }
});

export const { getFeedOrders, getFeedOrdersData } = feedsSlice.selectors;
