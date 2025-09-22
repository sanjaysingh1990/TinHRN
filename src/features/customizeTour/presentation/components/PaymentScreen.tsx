import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../hooks/useTheme';
import { showToast, showErrorToast, showSuccessToast } from '../../../../utils/toast';

interface PaymentScreenProps {
  totalPrice: number;
  onPaymentSuccess: () => void;
  onPaymentCancel: () => void;
  processPayment: (customerEmail: string) => Promise<{ success: boolean; error?: string }>;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({
  totalPrice,
  onPaymentSuccess,
  onPaymentCancel,
  processPayment
}) => {
  const { colors, isDarkMode } = useTheme();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const handlePayment = async () => {
    if (!email) {
      showErrorToast('Please enter your email address to proceed with payment.');
      return;
    }

    setIsProcessing(true);
    try {
      console.log('Initiating payment processing');
      const result = await processPayment(email);
      console.log('Payment processing result:', result);
      if (result.success) {
        console.log('Payment successful, calling onPaymentSuccess');
        showSuccessToast('Payment successful! Completing your booking...');
        // For successful payment, keep button disabled and proceed with booking
        setTimeout(() => {
          onPaymentSuccess();
        }, 1500);
      } else {
        console.log('Payment failed:', result.error);
        showErrorToast(result.error || 'Failed to process payment. Please try again.');
        // Re-enable button only on error
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      showErrorToast(error.message || 'An error occurred while processing your payment. Please try again.');
      // Re-enable button only on error
      setIsProcessing(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
      marginTop: 40,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginLeft: 10,
      fontFamily: 'SplineSans',
    },
    section: {
      backgroundColor: colors.cardBackgroundColor,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
      padding: 20,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 15,
      fontFamily: 'SplineSans',
    },
    paymentMethod: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
    },
    paymentMethodText: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      marginLeft: 15,
      fontFamily: 'NotoSans',
    },
    totalContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
    },
    totalText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'SplineSans',
    },
    totalAmount: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.primary,
      fontFamily: 'SplineSans',
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      color: isDarkMode ? '#111714' : '#ffffff',
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: 'SplineSans',
    },
    cancelButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 10,
    },
    cancelButtonText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: 'SplineSans',
    },
    input: {
      backgroundColor: colors.cardBackgroundColor,
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderRadius: 12,
      padding: 15,
      fontSize: 16,
      color: colors.text,
      fontFamily: 'NotoSans',
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      fontFamily: 'SplineSans',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onPaymentCancel}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Payment</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentMethod}>
          <MaterialIcons name="credit-card" size={24} color={colors.primary} />
          <Text style={styles.paymentMethodText}>Credit or Debit Card</Text>
          <MaterialIcons name="check" size={24} color={colors.primary} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor={colors.secondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isProcessing}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>${totalPrice.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, isProcessing && styles.buttonDisabled]}
        onPress={handlePayment}
        disabled={isProcessing}
      >
        <Text style={styles.buttonText}>
          {isProcessing ? 'Processing Payment...' : 'Pay Now'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onPaymentCancel}
        disabled={isProcessing}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentScreen;