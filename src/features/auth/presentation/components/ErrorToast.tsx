import React, { useEffect } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

interface ErrorToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ 
  message, 
  visible, 
  onHide, 
  duration = 4000 
}) => {
  const { colors, isDarkMode } = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? '#ff6b6b' : '#ff4757',
          borderColor: isDarkMode ? '#ff8e8e' : '#ff3838',
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 1000,
    elevation: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ErrorToast;