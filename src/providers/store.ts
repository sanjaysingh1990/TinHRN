
import { configureStore } from '@reduxjs/toolkit';
import sampleReducer from '../sample/presentation/state/sample.slice';

export const store = configureStore({
  reducer: {
    sample: sampleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
