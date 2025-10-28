import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';

type TModalState = {
  currentIngredient: TIngredient | null;
};

const initialState: TModalState = {
  currentIngredient: null
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setCurrentIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.currentIngredient = action.payload;
    },
    clearCurrentIngredient: (state) => {
      state.currentIngredient = null;
    }
  }
});

export const { setCurrentIngredient, clearCurrentIngredient } =
  modalSlice.actions;
export const modalReducer = modalSlice.reducer;
