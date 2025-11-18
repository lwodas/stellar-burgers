import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { register, login, fetchUser, updateUser, logout } from './authActions';
import { TUser } from '@utils-types';

type TAuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  loading: boolean;
  error?: string | null;
  request: boolean;
};

const initialState: TAuthState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null,
  request: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getIsAuthChecked: (state) => state.isAuthChecked
  },
  extraReducers: (builder) => {
    builder
      //Регистрация
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Unknown error';
      })

      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.loading = false;
      })
      // Логин
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.loading = false;
        state.error = action.error?.message || 'Unknown error';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.loading = false;
      })
      // Логаут
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.error?.message || 'Unknown error';
        state.loading = false;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      })
      // Получение данных пользователя
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.error?.message || 'Unknown error';
        state.loading = false;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })

      // Обновление профиля
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error?.message || 'Unknown error';
        state.loading = false;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.loading = false;
      });
  }
});

export const { setIsAuthChecked } = authSlice.actions;
export const { getUser, getIsAuthChecked } = authSlice.selectors;
