import { initPaymentSheet, presentPaymentSheet, confirmPaymentSheetPayment } from '@stripe/stripe-react-native';
import { Platform } from 'react-native';

export class PaymentService {
  private publishableKey: string;
  private merchantIdentifier: string;

  constructor() {
    // Test publishable key - replace with your actual key in production
    this.publishableKey = 'pk_test_51Pz4JbRvCfHkDdNn0XvDz6F3vY7Q2p9aB8cD1eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5'; // Test key
    this.merchantIdentifier = 'merchant.com.tentinhimalayas'; // iOS only
  }

  /**
   * Initialize the payment sheet with the provided payment intent
   */
  async initializePaymentSheet(amount: number, currency: string, customerEmail: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Initializing Stripe payment sheet...');
      
      // In a real implementation, you would call your backend to create a payment intent
      // and get the client secret. For this example, we're using a test client secret.
      const clientSecret = 'pi_3Pz4JbRvCfHkDdNn0XvDz6F3_secret_Y7Q2p9aB8cD1eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5'; // Test client secret

      // Add a check to ensure Stripe is properly initialized
      if (!clientSecret) {
        return { success: false, error: 'Payment configuration is incomplete' };
      }

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Tent in Himalayas',
        paymentIntentClientSecret: clientSecret,
        customerEphemeralKeySecret: 'ek_test_Y7Q2p9aB8cD1eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5', // Test ephemeral key
        customerId: 'cus_test_Y7Q2p9aB8cD1eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5', // Test customer ID
        applePay: Platform.OS === 'ios' ? {
          merchantCountryCode: 'US',
        } : undefined,
        googlePay: Platform.OS === 'android' ? {
          merchantCountryCode: 'US',
          testEnv: true, // Use test environment
        } : undefined,
        returnURL: 'tinhrn://stripe-redirect', // Custom scheme for redirect
        defaultBillingDetails: {
          email: customerEmail,
        },
        allowsDelayedPaymentMethods: true,
        appearance: {
          font: {
            scale: 1.1,
          },
          colors: {
            primary: '#007AFF',
            background: '#FFFFFF',
            componentBackground: '#F6F8FA',
            componentBorder: '#E1E8ED',
            componentDivider: '#E1E8ED',
            primaryText: '#14181E',
            secondaryText: '#68778D',
            componentText: '#14181E',
            placeholderText: '#9BA9BA',
            icon: '#68778D',
            error: '#FF3B30',
          },
          shapes: {
            borderRadius: 8,
            borderWidth: 1,
          },
          primaryButton: {
            colors: {
              background: '#007AFF',
              text: '#FFFFFF',
              border: '#007AFF',
            },
            shapes: {
              borderRadius: 8,
            },
          },
        },
      });

      if (error) {
        console.error('Error initializing payment sheet:', error);
        return { success: false, error: error.message };
      }

      console.log('Stripe payment sheet initialized successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error initializing payment sheet:', error);
      return { success: false, error: error.message || 'Failed to initialize payment sheet' };
    }
  }

  /**
   * Present the payment sheet to the user
   */
  async presentPaymentSheet(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Presenting Stripe payment sheet...');
      
      // Present the payment sheet
      const { error, paymentOption } = await presentPaymentSheet();
      
      if (error) {
        console.error('Error presenting payment sheet:', error);
        // Handle specific error cases
        if (error.code === 'Canceled') {
          return { success: false, error: 'Payment was canceled' };
        }
        return { success: false, error: error.message };
      }
      
      if (!paymentOption) {
        return { success: false, error: 'Payment was not completed' };
      }

      // Payment successful
      console.log('Payment option selected:', paymentOption);
      console.log('Stripe payment sheet presented successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error presenting payment sheet:', error);
      // Prevent app crash by handling the error gracefully
      return { success: false, error: error.message || 'Failed to present payment sheet' };
    }
  }
}