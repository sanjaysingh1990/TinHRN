# Terms and Conditions Implementation

## Overview

Implemented functionality to open Terms and Conditions in an external web view when tapped from the Profile screen.

## Implementation Details

### 1. **Profile Screen Updates**

**File**: `src/features/profile/presentation/screens/ProfileScreen.tsx`

**Changes Made**:
- Added `Linking` import from React Native
- Created `handleTermsAndConditions` function to handle URL opening
- Connected the function to the Terms and Conditions AccountItem

### 2. **Functionality**

**URL**: `https://www.tentinhimalayas.com/term_and_condition.html`

**Features**:
- ✅ **URL Validation**: Checks if the URL can be opened before attempting
- ✅ **Error Handling**: Shows user-friendly error messages if URL cannot be opened
- ✅ **External Browser**: Opens in device's default browser
- ✅ **Cross-Platform**: Works on both iOS and Android

### 3. **Code Implementation**

```typescript
const handleTermsAndConditions = async () => {
  const url = 'https://www.tentinhimalayas.com/term_and_condition.html';
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Unable to open the Terms and Conditions page. Please try again later.');
    }
  } catch (error) {
    console.error('Error opening Terms and Conditions:', error);
    Alert.alert('Error', 'Unable to open the Terms and Conditions page. Please try again later.');
  }
};
```

### 4. **User Experience Flow**

1. **Navigation**: Profile → Others → Terms and Conditions
2. **Tap Action**: User taps "Terms and Conditions"
3. **URL Check**: App validates if URL can be opened
4. **External Browser**: Opens default browser with Terms & Conditions page
5. **Error Handling**: Shows alert if unable to open URL

### 5. **Error Handling**

- **URL Validation**: Uses `Linking.canOpenURL()` to check URL support
- **Try-Catch**: Wraps the operation in error handling
- **User Feedback**: Shows meaningful error messages via Alert
- **Console Logging**: Logs errors for debugging purposes

### 6. **Benefits**

- **External Viewing**: Opens in full browser for better reading experience
- **Platform Native**: Uses device's default browser
- **Reliable**: Includes proper error handling and validation
- **Consistent**: Follows existing app patterns and user experience
- **Accessible**: Works across different devices and accessibility settings

## Usage

1. Open the app and navigate to Profile screen
2. Scroll to "Others" section
3. Tap "Terms and Conditions"
4. The device's default browser will open with the Terms & Conditions page

The implementation follows React Native best practices and integrates seamlessly with the existing codebase architecture.