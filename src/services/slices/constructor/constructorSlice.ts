import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TIngredient,
  TConstructorIngredient,
  TOrder
} from '../../../utils/types';
import { postOrderBurger } from './constructorActions';
import { v4 as uuid } from 'uuid';

type TConstructorItems = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

type TConstrutorState = {
  items: TConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error?: string | null;
};

const initialState: TConstrutorState = {
  items: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.items.bun = action.payload;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.items.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuid() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.items.ingredients = state.items.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveUpIngredient: (state, action: PayloadAction<number>) => {
      [
        state.items.ingredients[action.payload - 1],
        state.items.ingredients[action.payload]
      ] = [
        state.items.ingredients[action.payload],
        state.items.ingredients[action.payload - 1]
      ];
    },
    moveDownIngredient: (state, action: PayloadAction<number>) => {
      [
        state.items.ingredients[action.payload + 1],
        state.items.ingredients[action.payload]
      ] = [
        state.items.ingredients[action.payload],
        state.items.ingredients[action.payload + 1]
      ];
    },
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    resetOrderModalData: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  selectors: {
    getBurgerItems: (state) => state.items,
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(postOrderBurger.fulfilled, (state, action) => {
        state.orderModalData = action.payload;
        state.orderRequest = false;
        state.items.bun = null;
        state.items.ingredients = [];
      })
      .addCase(postOrderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error?.message || 'Unknown error';
      });
  }
});

export const {
  addBun,
  addIngredient,
  moveUpIngredient,
  moveDownIngredient,
  removeIngredient,
  resetOrderModalData,
  setOrderRequest
} = burgerConstructorSlice.actions;

export const { getBurgerItems, getOrderRequest, getOrderModalData } =
  burgerConstructorSlice.selectors;
function uuid4(): unknown {
  throw new Error('Function not implemented.');
}
