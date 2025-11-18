import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';

export const postOrderBurger = createAsyncThunk(
  'burgerConstructor/postOrderBurger',
  async (data: string[], { rejectWithValue }) => {
    const response = await orderBurgerApi(data);
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response.order;
  }
);
