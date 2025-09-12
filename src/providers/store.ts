
import { configureStore } from '@reduxjs/toolkit';
import sampleReducer from '../sample/presentation/state/sample.slice';
import authReducer from '../auth/presentation/state/auth.slice';

export const store = configureStore({
  reducer: {
    sample: sampleReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
