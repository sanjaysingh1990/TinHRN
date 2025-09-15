import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

const { width } = Dimensions.get('window');

const useShimmerAnimation = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });
};

const ShimmerBase: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDarkMode } = useTheme();
  const translateX = useShimmerAnimation();

  const gradientColors = isDarkMode 
    ? ['transparent', 'rgba(255, 255, 255, 0.1)', 'transparent'] as const
    : ['transparent', 'rgba(255, 255, 255, 0.8)', 'transparent'] as const;

  return (
    <View style={{ overflow: 'hidden' }}>
      {children}
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
};

export const CalendarShimmer: React.FC = () => {
  const { colors } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
    calendarHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    monthText: {
      width: 120,
      height: 24,
      backgroundColor: colors.shimmerColor,
      borderRadius: 4,
    },
    navButton: {
      width: 40,
      height: 40,
      backgroundColor: colors.shimmerColor,
      borderRadius: 20,
    },
    weekDays: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 15,
    },
    weekDay: {
      width: 30,
      height: 16,
      backgroundColor: colors.shimmerColor,
      borderRadius: 4,
    },
    datesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
    dateCell: {
      width: 40,
      height: 40,
      backgroundColor: colors.shimmerColor,
      borderRadius: 20,
      margin: 2,
    },
  });

  return (
    <View style={styles.container}>
      <ShimmerBase>
        <View style={styles.calendarHeader}>
          <View style={styles.navButton} />
          <View style={styles.monthText} />
          <View style={styles.navButton} />
        </View>
        
        <View style={styles.weekDays}>
          {Array.from({ length: 7 }, (_, i) => (
            <View key={i} style={styles.weekDay} />
          ))}
        </View>
        
        <View style={styles.datesGrid}>
          {Array.from({ length: 35 }, (_, i) => (
            <View key={i} style={styles.dateCell} />
          ))}
        </View>
      </ShimmerBase>
    </View>
  );
};

export const TentOptionsShimmer: React.FC = () => {
  const { colors } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    option: {
      height: 48,
      backgroundColor: colors.shimmerColor,
      borderRadius: 24,
      marginBottom: 12,
      width: '80%',
      alignSelf: 'center',
    },
  });

  return (
    <View style={styles.container}>
      {Array.from({ length: 3 }, (_, i) => (
        <ShimmerBase key={i}>
          <View style={styles.option} />
        </ShimmerBase>
      ))}
    </View>
  );
};

export const AddOnsShimmer: React.FC = () => {
  const { colors } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    addOnItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
    },
    checkbox: {
      width: 24,
      height: 24,
      backgroundColor: colors.shimmerColor,
      borderRadius: 4,
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      width: '60%',
      height: 16,
      backgroundColor: colors.shimmerColor,
      borderRadius: 4,
      marginBottom: 8,
    },
    description: {
      width: '80%',
      height: 14,
      backgroundColor: colors.shimmerColor,
      borderRadius: 4,
    },
    price: {
      width: 60,
      height: 20,
      backgroundColor: colors.shimmerColor,
      borderRadius: 4,
    },
  });

  return (
    <View style={styles.container}>
      {Array.from({ length: 4 }, (_, i) => (
        <ShimmerBase key={i}>
          <View style={styles.addOnItem}>
            <View style={styles.checkbox} />
            <View style={styles.textContainer}>
              <View style={styles.title} />
              <View style={styles.description} />
            </View>
            <View style={styles.price} />
          </View>
        </ShimmerBase>
      ))}
    </View>
  );
};

export const SupportCardsShimmer: React.FC = () => {
  const { colors } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    card: {
      backgroundColor: colors.cardBackgroundColor,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderStyle: 'dashed',
      padding: 20,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: 48,
      height: 48,
      backgroundColor: colors.shimmerColor,
      borderRadius: 24,
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      width: '70%',
      height: 18,
      backgroundColor: colors.shimmerColor,
      borderRadius: 4,
      marginBottom: 8,
    },
    subtitle: {
      width: '50%',
      height: 14,
      backgroundColor: colors.shimmerColor,
      borderRadius: 4,
    },
  });

  return (
    <View style={styles.container}>
      {Array.from({ length: 2 }, (_, i) => (
        <ShimmerBase key={i}>
          <View style={styles.card}>
            <View style={styles.icon} />
            <View style={styles.textContainer}>
              <View style={styles.title} />
              <View style={styles.subtitle} />
            </View>
          </View>
        </ShimmerBase>
      ))}
    </View>
  );
};