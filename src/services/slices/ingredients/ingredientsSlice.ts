import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '../../../utils/types';
import { fetchIngredients } from './ingredientsActions';

type TIngredientState = {
  items: TIngredient[];
  loading: boolean;
  error?: string | null;
};

const initialState: TIngredientState = {
  items: [],
  loading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredientItems: (state) => state.items,
    getIsIngredientsLoading: (state) => state.loading,
    getBuns: (state) => state.items.filter((item) => item.type === 'bun'),
    getMains: (state) => state.items.filter((item) => item.type === 'main'),
    getSauce: (state) => state.items.filter((item) => item.type === 'sauce')
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Unknown error';
      });
  }
});

export const {
  getIngredientItems,
  getIsIngredientsLoading,
  getBuns,
  getMains,
  getSauce
} = ingredientsSlice.selectors;
