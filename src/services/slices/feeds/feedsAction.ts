import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';

export const fetchFeeds = createAsyncThunk(
  'feeds/fetch',
  async (_, { rejectWithValue }) => {
    const response = await getFeedsApi();
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response;
  }
);
