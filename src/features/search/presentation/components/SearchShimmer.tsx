import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

const SearchShimmer: React.FC = () => {
    const { colors } = useTheme();
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            padding: 15,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
            borderStyle: 'dashed',
        },
        imagePlaceholder: {
            width: 80,
            height: 80,
            borderRadius: 12,
            backgroundColor: colors.inputBackground,
        },
        content: {
            flex: 1,
            marginLeft: 15,
        },
        titlePlaceholder: {
            height: 18,
            width: '70%',
            backgroundColor: colors.inputBackground,
            borderRadius: 4,
            marginBottom: 8,
        },
        subtitlePlaceholder: {
            height: 14,
            width: '50%',
            backgroundColor: colors.inputBackground,
            borderRadius: 4,
        }
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.imagePlaceholder, { opacity }]} />
            <View style={styles.content}>
                <Animated.View style={[styles.titlePlaceholder, { opacity }]} />
                <Animated.View style={[styles.subtitlePlaceholder, { opacity }]} />
            </View>
        </View>
    );
};

export default SearchShimmer;
