import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../../utils/types';
import { fetchOrdersByNumber } from './orderInfoActions';

type TOrderState = {
  order: TOrder[];
  loading: boolean;
  error?: string | null;
};

const initialState: TOrderState = {
  order: [],
  loading: false,
  error: null
};

export const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {},
  selectors: {
    getOrderInfo: (state) => state.order,
    getOrderInfoLoading: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersByNumber.pending, (state) => {
        state.order = [];
        state.loading = true;
      })
      .addCase(fetchOrdersByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrdersByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Unknown error';
      });
  }
});

export const { getOrderInfo, getOrderInfoLoading } = orderInfoSlice.selectors;
