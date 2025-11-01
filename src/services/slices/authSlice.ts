import {
  createSlice,
  createAsyncThunk,
  isRejectedWithValue,
  PayloadAction
} from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';
import { TUser } from '../../utils/types';

type TAuthState = {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthChecked: boolean;
  isUpdateSuccess: boolean;
};

const initialState: TAuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthChecked: false,
  isUpdateSuccess: false
};

// Проверка авторизации при старте приложения
export const checkUserAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      // токен истёк или отсутствует
      return rejectWithValue('Не авторизован');
    }
  }
);

// Логин
export const login = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      const accessToken = response.accessToken.split('Bearer ')[1];
      setCookie('accessToken', accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Регистрация
export const register = createAsyncThunk(
  'auth/register',
  async (
    data: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await registerUserApi(data);
      const accessToken = response.accessToken.split('Bearer ')[1];
      setCookie('accessToken', accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Обновление профиля
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (
    data: { name: string; email: string; password?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateUserApi(data);
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Выход
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
      return true;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isUpdateSuccess = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = false;
        state.isUpdateSuccess = false;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
          state.isUpdateSuccess = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(isRejectedWithValue, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as Error)?.message || 'Ошибка авторизации';
      });
  }
});

export const authReducer = authSlice.reducer;
