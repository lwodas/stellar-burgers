import { combineReducers } from 'redux';
import { ingredientsReducer } from '../slices/ingredientsSlice';
import { constructorReducer } from '../slices/constructorSlice';
import { ordersReducer } from '../slices/ordersSlice';
import { modalReducer } from '../slices/modalSlice';
import { feedReducer } from '../slices/feedSlice';
import { authReducer } from '../slices/authSlice';
import { profileOrdersReducer } from '../slices/profileOrdersSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  orders: ordersReducer,
  modal: modalReducer,
  feed: feedReducer,
  auth: authReducer,
  profileOrders: profileOrdersReducer
});
