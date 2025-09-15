import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  isDarkMode: boolean;
  isLoading: boolean;
}

const initialState: ThemeState = {
  isDarkMode: true, // Default to dark mode based on current app design
  isLoading: false,
};

// Async thunks for persistence
export const loadThemeFromStorage = createAsyncThunk(
  'theme/loadFromStorage',
  async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('isDarkMode');
      return savedTheme !== null ? JSON.parse(savedTheme) : true; // Default to dark
    } catch (error) {
      console.error('Error loading theme from storage:', error);
      return true; // Default to dark on error
    }
  }
);

export const saveThemeToStorage = createAsyncThunk(
  'theme/saveToStorage',
  async (isDarkMode: boolean) => {
    try {
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
      return isDarkMode;
    } catch (error) {
      console.error('Error saving theme to storage:', error);
      return isDarkMode;
    }
  }
);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadThemeFromStorage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadThemeFromStorage.fulfilled, (state, action) => {
        state.isDarkMode = action.payload;
        state.isLoading = false;
      })
      .addCase(loadThemeFromStorage.rejected, (state) => {
        state.isDarkMode = true; // Default to dark
        state.isLoading = false;
      })
      .addCase(saveThemeToStorage.fulfilled, (state, action) => {
        state.isDarkMode = action.payload;
      });
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;