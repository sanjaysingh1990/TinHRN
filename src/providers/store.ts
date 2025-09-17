
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/presentation/state/auth.slice';
import sampleReducer from '../sample/presentation/state/sample.slice';
import themeReducer from '../theme/theme.slice';

export const store = configureStore({
  reducer: {
    sample: sampleReducer,
    auth: authReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
