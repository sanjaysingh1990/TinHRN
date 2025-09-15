import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import container from '../../../../container';
import { useI18n } from '../../../../hooks/useI18n';
import { useTheme } from '../../../../hooks/useTheme';
import { Faq } from '../../domain/models/Faq';
import { FaqViewModelToken } from '../../profile.di';
import FaqItem from '../components/FaqItem';
import FaqShimmer from '../components/FaqShimmer';
import { FaqViewModel } from '../viewmodels/FaqViewModel';

const FaqScreen: React.FC = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { t } = useI18n();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const faqViewModel = container.resolve<FaqViewModel>(FaqViewModelToken);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    setIsLoading(true);
    try {
      const faqList = await faqViewModel.getFaqList();
      setFaqs(faqList);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFaq = ({ item }: { item: Faq }) => (
    <FaqItem faq={item} />
  );

  const renderShimmer = ({ index }: { index: number }) => (
    <FaqShimmer key={`shimmer-${index}`} />
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      paddingTop: 20, // Header margin requirement from memory
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
    },
    backButton: {
      padding: 8,
      marginRight: 8,
    },
    headerTitle: {
      flex: 1,
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginRight: 40, // Compensate for back button width
      fontFamily: 'SplineSans',
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginVertical: 24,
      fontFamily: 'SplineSans',
    },
    subtitle: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.secondary,
      textAlign: 'center',
      marginBottom: 32,
      paddingHorizontal: 20,
      fontFamily: 'NotoSans',
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingBottom: 40,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Header with back button and title */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ</Text>
      </View>

      <View style={styles.content}>
        {/* Title and subtitle */}
        <Text style={styles.title}>{t('faq.title')}</Text>
        <Text style={styles.subtitle}>
          {t('faq.subtitle')}
        </Text>

        {/* FAQ List */}
        {isLoading ? (
          <FlatList
            style={styles.list}
            data={Array.from({ length: 6 }, (_, i) => i)}
            renderItem={renderShimmer}
            keyExtractor={(_, index) => `shimmer-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <FlatList
            style={styles.list}
            data={faqs}
            renderItem={renderFaq}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default FaqScreen;