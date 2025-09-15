import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Animated, LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { Faq } from '../../domain/models/Faq';

interface FaqItemProps {
  faq: Faq;
}

const FaqItem: React.FC<FaqItemProps> = ({ faq }) => {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.cardBackgroundColor,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderStyle: 'dashed',
      marginBottom: 16,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
    },
    questionContainer: {
      flex: 1,
      marginRight: 12,
    },
    question: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      lineHeight: 22,
      fontFamily: 'SplineSans',
    },
    category: {
      fontSize: 12,
      color: colors.primary,
      marginTop: 4,
      fontWeight: '500',
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    answer: {
      fontSize: 14,
      lineHeight: 22,
      color: colors.secondary,
      fontFamily: 'NotoSans',
    },
    divider: {
      height: 1,
      backgroundColor: colors.borderColor,
      marginHorizontal: 20,
      marginBottom: 20,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleExpanded} activeOpacity={0.7}>
        <View style={styles.questionContainer}>
          <Text style={styles.question}>{faq.question}</Text>
          {faq.category && <Text style={styles.category}>{faq.category}</Text>}
        </View>
        <View style={styles.iconContainer}>
          <MaterialIcons 
            name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
            size={20} 
            color={colors.background} 
          />
        </View>
      </TouchableOpacity>
      
      {isExpanded && (
        <>
          <View style={styles.divider} />
          <View style={styles.content}>
            <Text style={styles.answer}>{faq.answer}</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default FaqItem;