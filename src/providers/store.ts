
import { configureStore } from '@reduxjs/toolkit';
import sampleReducer from '../sample/presentation/state/sample.slice';
import authReducer from '../auth/presentation/state/auth.slice';
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
