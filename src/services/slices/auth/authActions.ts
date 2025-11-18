import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TRegisterData,
  TLoginData
} from '@api';
import { setCookie, getCookie, deleteCookie } from '../../../utils/cookie';
import { setIsAuthChecked } from './authSlice';

export const register = createAsyncThunk(
  'auth/register',
  async (userData: TRegisterData, { rejectWithValue }) => {
    const response = await registerUserApi(userData);
    if (!response?.success) {
      return rejectWithValue(response);
    }
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: TLoginData, { rejectWithValue }) => {
    const response = await loginUserApi(credentials);
    if (!response?.success) {
      return rejectWithValue(response);
    }
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    const response = await logoutApi();
    if (!response?.success) {
      return rejectWithValue(response);
    }
    localStorage.clear();
    deleteCookie('accessToken');
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data: { email: string }, { rejectWithValue }) => {
    const response = await forgotPasswordApi(data);
    if (!response?.success) {
      return rejectWithValue(response);
    }
    //return true;
    window.location.href = '/reset-password';
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    const response = await resetPasswordApi(data);
    if (!response?.success) {
      return rejectWithValue(response);
    }
    //return true;
    window.location.href = '/login';
  }
);

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    const response = await getUserApi();
    if (!response?.success) {
      localStorage.clear();
      deleteCookie('accessToken');
      return rejectWithValue(response);
    }
    return response.user;
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    const response = await updateUserApi(user);
    if (!response?.success) {
      return rejectWithValue(response);
    }
    return response.user;
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(fetchUser()).finally(() => {
        dispatch(setIsAuthChecked(true));
      });
    } else {
      dispatch(setIsAuthChecked(true));
    }
  }
);
