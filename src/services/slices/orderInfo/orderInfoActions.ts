import { createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';

export const fetchOrdersByNumber = createAsyncThunk(
  'order/fetchOrdersByNumber',
  async (number: number, { rejectWithValue }) => {
    const response = await getOrderByNumberApi(number);
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response.orders;
  }
);
