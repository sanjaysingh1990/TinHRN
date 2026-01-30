
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

const ShimmerBookingDetails = () => {
    const { colors, isDarkMode } = useTheme();
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

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-400, 400],
    });

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 30,
        },
        backIcon: {
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: colors.shimmerColor,
        },
        titleLine: {
            height: 20,
            width: '60%',
            backgroundColor: colors.shimmerColor,
            borderRadius: 10,
            marginLeft: 20,
        },
        image: {
            width: '100%',
            height: 200,
            borderRadius: 16,
            backgroundColor: colors.shimmerColor,
            marginBottom: 20,
        },
        tourInfo: {
            marginBottom: 30,
        },
        lineLarge: {
            height: 24,
            width: '70%',
            backgroundColor: colors.shimmerColor,
            borderRadius: 12,
            marginBottom: 10,
        },
        lineMedium: {
            height: 16,
            width: '40%',
            backgroundColor: colors.shimmerColor,
            borderRadius: 8,
            marginBottom: 10,
        },
        badge: {
            height: 28,
            width: 80,
            backgroundColor: colors.shimmerColor,
            borderRadius: 8,
        },
        card: {
            borderRadius: 16,
            height: 150,
            backgroundColor: colors.shimmerColor,
            opacity: 0.5,
            marginBottom: 20,
        },
        footer: {
            height: 60,
            borderRadius: 12,
            backgroundColor: colors.shimmerColor,
            marginTop: 20,
        }
    });

    const Shimmer = () => (
        <Animated.View
            style={{
                ...StyleSheet.absoluteFillObject,
                transform: [{ translateX }],
            }}
        >
            <LinearGradient
                colors={isDarkMode
                    ? ['transparent', 'rgba(255, 255, 255, 0.05)', 'transparent']
                    : ['transparent', 'rgba(255, 255, 255, 0.6)', 'transparent']
                }
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ flex: 1 }}
            />
        </Animated.View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.backIcon} />
                    <View style={styles.titleLine} />
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.image} />
                    <View style={styles.tourInfo}>
                        <View style={styles.lineLarge} />
                        <View style={styles.lineMedium} />
                        <View style={styles.badge} />
                    </View>
                    <View style={styles.card} />
                    <View style={styles.card} />
                    <View style={styles.footer} />
                </ScrollView>
            </View>
            <Shimmer />
        </View>
    );
};

export default ShimmerBookingDetails;
