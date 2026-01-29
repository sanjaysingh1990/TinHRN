import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import container from '../../../container';
import { useTheme } from '../../../hooks/useTheme';
import { UploadService, UploadStatus } from '../../services/UploadService';

export const GlobalProgressBar: React.FC = () => {
    const { colors } = useTheme();
    const [status, setStatus] = useState<UploadStatus>({ isUploading: false, progress: 0 });
    const [width] = useState(new Animated.Value(0));

    useEffect(() => {
        const uploadService = container.resolve(UploadService);
        return uploadService.subscribe((newStatus) => {
            setStatus(newStatus);
            Animated.timing(width, {
                toValue: newStatus.progress,
                duration: 300,
                useNativeDriver: false,
            }).start();
        });
    }, []);

    if (!status.isUploading && status.progress === 0) return null;

    return (
        <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.borderColor }]}>
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                    {status.isUploading ? `Uploading: ${status.title}` : status.error ? 'Upload Failed' : 'Upload Complete'}
                </Text>
                <Text style={[styles.progressText, { color: colors.secondary }]}>{Math.round(status.progress)}%</Text>
            </View>
            <View style={[styles.barContainer, { backgroundColor: colors.inputBackground }]}>
                <Animated.View
                    style={[
                        styles.bar,
                        {
                            width: width.interpolate({
                                inputRange: [0, 100],
                                outputRange: ['0%', '100%']
                            }),
                            backgroundColor: status.error ? '#ef4444' : colors.primary
                        }
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        width: '100%',
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
    },
    progressText: {
        fontSize: 10,
    },
    barContainer: {
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
    },
});
