import { configureStore, combineSlices } from '@reduxjs/toolkit';
import {
  authSlice,
  ingredientsSlice,
  burgerConstructorSlice,
  feedsSlice,
  ordersSlice,
  orderInfoSlice
} from '@slices';

import {
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const rootReducer = combineSlices(
  ingredientsSlice,
  burgerConstructorSlice,
  authSlice,
  ordersSlice,
  feedsSlice,
  orderInfoSlice
);

const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();

export default store;
