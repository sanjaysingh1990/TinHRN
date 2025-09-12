
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SampleState {
  data: string;
  loading: boolean;
  error: string | null;
}

const initialState: SampleState = {
  data: '',
  loading: false,
  error: null,
};

const sampleSlice = createSlice({
  name: 'sample',
  initialState,
  reducers: {
    fetchDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDataSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchDataFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchDataStart, fetchDataSuccess, fetchDataFailure } = sampleSlice.actions;
export default sampleSlice.reducer;
