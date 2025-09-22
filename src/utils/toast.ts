import { Alert, Platform, ToastAndroid } from 'react-native';

/**
 * Shows a toast message or alert based on the platform
 * @param message The message to display
 * @param isErrorMessage Whether this is an error message (affects duration on Android)
 */
export const showToast = (message: string, isErrorMessage: boolean = false) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(
      message,
      isErrorMessage ? ToastAndroid.LONG : ToastAndroid.SHORT
    );
  } else {
    // For iOS, we'll use a simple alert as there's no native toast
    Alert.alert(
      isErrorMessage ? 'Error' : 'Info',
      message,
      [{ text: 'OK' }]
    );
  }
};

/**
 * Shows an error toast message
 * @param message The error message to display
 */
export const showErrorToast = (message: string) => {
  showToast(message, true);
};

/**
 * Shows a success toast message
 * @param message The success message to display
 */
export const showSuccessToast = (message: string) => {
  showToast(message, false);
};