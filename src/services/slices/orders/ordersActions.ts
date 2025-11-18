import { createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async () => await getOrdersApi()
);
