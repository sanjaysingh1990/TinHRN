# Stripe Payment Integration Documentation

## Overview
This document describes the Stripe payment integration implemented in the TiNHRn application. The integration adds a payment step before completing tour bookings in the CustomizeTour flow.

## Implementation Details

### 1. Dependencies
The integration uses the official Stripe React Native SDK:
- `@stripe/stripe-react-native`

### 2. Architecture
The implementation follows the clean architecture pattern of the application:

```
Presentation Layer (CustomizeTourScreen)
        ↓
ViewModel Layer (CustomizeTourViewModel)
        ↓
Repository Layer (CustomizeTourRepository)
        ↓
Service Layer (PaymentService)
```

### 3. Key Components

#### PaymentService
- Handles all Stripe-specific logic
- Initializes and presents the payment sheet
- Uses test environment by default

#### CustomizeTourRepository
- Updated to include `processPayment` method
- Integrates with PaymentService to handle payment processing

#### CustomizeTourViewModel
- Updated to include payment processing state and methods
- Manages the flow between customization and payment

#### CustomizeTourScreen
- Updated to show payment screen before booking
- Includes a new PaymentScreen component for payment processing

#### PaymentScreen
- New component for handling payment UI
- Allows users to select credit/debit card payment
- Collects customer email for payment processing

### 4. Flow

1. User completes tour customization (dates, tent, add-ons)
2. User taps "Continue to Payment" button
3. Payment screen is displayed with total amount
4. User enters email and confirms payment method
5. Stripe payment sheet is presented
6. User completes payment in the Stripe sheet
7. Upon successful payment, booking is created
8. User is redirected to bookings tab

### 5. Test Environment
The integration is configured to use Stripe's test environment by default:
- Test publishable key is used
- Test client secret is used for payment intents
- Test customer data is used

### 6. Current Limitation
Due to compatibility issues with Expo and the Stripe SDK on iOS, the actual Stripe payment sheet is currently mocked to prevent app crashes. The payment flow simulates a successful payment to allow users to complete the booking process. This is a temporary solution until the compatibility issues are resolved.

To enable the actual Stripe payment sheet:
1. Remove the mock implementation in PaymentService
2. Uncomment the actual Stripe SDK calls
3. Ensure proper configuration in app.json
4. Test thoroughly on both iOS and Android

### 7. Production Considerations
Before deploying to production, you must:
1. Replace test keys with production keys
2. Implement backend service to create real payment intents
3. Configure Apple Pay and Google Pay merchant identifiers
4. Test thoroughly with real payment methods
5. Remove the mock payment implementation and enable the actual Stripe SDK

## Files Modified/Added

### New Files
- `src/features/customizeTour/data/services/PaymentService.ts`
- `src/features/customizeTour/customizeTour.di.ts`
- `src/features/customizeTour/presentation/components/PaymentScreen.tsx`

### Modified Files
- `src/container.ts`
- `src/features/customizeTour/data/repositories/CustomizeTourRepository.ts`
- `src/features/customizeTour/domain/repositories/ICustomizeTourRepository.ts`
- `src/features/customizeTour/presentation/viewmodels/CustomizeTourViewModel.ts`
- `src/features/customizeTour/presentation/screens/CustomizeTourScreen.tsx`

## Testing
To test the payment flow:
1. Complete the tour customization process
2. Tap "Continue to Payment"
3. Enter a test email address
4. Confirm payment method (credit/debit card)
5. Click "Simulate Success" when prompted
6. Verify that the booking is completed and you're redirected to the bookings tab

## Security
- All payment processing is handled by Stripe
- No sensitive payment information is stored in the app
- Communication with Stripe uses HTTPS
- Test environment is used by default to prevent real transactions

## Troubleshooting
If you encounter issues:
1. Ensure all dependencies are installed correctly
2. Verify the Stripe publishable key is correct
3. Check that the app is configured with the correct URL scheme
4. Confirm test environment is enabled