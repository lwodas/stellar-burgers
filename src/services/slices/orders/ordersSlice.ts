import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../../utils/types';
import { fetchOrders } from './ordersActions';

type TOrderState = {
  orders: TOrder[];
  loading: boolean;
  error?: string | null;
};

const initialState: TOrderState = {
  orders: [],
  loading: false,
  error: null
};

export const ordersSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  selectors: {
    getOrders: (state) => state.orders,
    getOrdersLoading: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Unknown error';
      });
  }
});

export const { getOrders, getOrdersLoading } = ordersSlice.selectors;
