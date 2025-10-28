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

export const checkUserAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      localStorage.setItem('accessToken', response.accessToken);
      document.cookie = `refreshToken=${response.refreshToken}; path=/;`;
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    data: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await registerUserApi(data);
      localStorage.setItem('accessToken', response.accessToken);
      document.cookie = `refreshToken=${response.refreshToken}; path=/;`;
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

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

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.clear();
      document.cookie =
        'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie =
        'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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
        state.error = (action.payload as Error).message || 'Ошибка авторизации';
      });
  }
});

export const authReducer = authSlice.reducer;
