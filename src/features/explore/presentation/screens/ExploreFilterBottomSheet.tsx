import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../hooks/useTheme';
import { ExploreFilterViewModel } from './ExploreFilterViewModel';

const { width, height } = Dimensions.get('window');

interface ExploreFilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

const ExploreFilterBottomSheet: React.FC<ExploreFilterBottomSheetProps> = ({
  visible,
  onClose,
  onApplyFilters,
}) => {
  const { colors, isDarkMode } = useTheme();
  const [viewModel] = useState(() => new ExploreFilterViewModel());
  const [, forceUpdate] = useState({});
  const slideAnim = useRef(new Animated.Value(height)).current;
  
  useEffect(() => {
    viewModel.setUpdateCallback(() => forceUpdate({}));
    return () => viewModel.setUpdateCallback(() => {});
  }, [viewModel]);
  
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: height,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [visible]);
  
  const handleClearAll = useCallback(() => {
    viewModel.clearFilters();
  }, [viewModel]);
  
  const handleApplyFilters = useCallback(() => {
    const filters = viewModel.getFilters();
    onApplyFilters(filters);
    onClose();
  }, [viewModel, onApplyFilters, onClose]);
  
  const difficultyOptions = ['Easy', 'Moderate', 'Challenging'];
  const terrainOptions = ['Mountainous', 'Forest', 'River'];
  const amenityOptions = ['Restrooms', 'Water Sources'];
  
  const renderRadioButton = (label: string, selected: boolean, onPress: () => void) => (
    <TouchableOpacity key={label} style={styles.radioContainer} onPress={onPress}>
      <View style={[styles.radioOuter, { borderColor: selected ? colors.primary : colors.borderColor }]}>
        {selected && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
      </View>
      <Text style={[styles.radioLabel, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
  
  const renderCheckbox = (label: string, checked: boolean, onPress: () => void) => (
    <TouchableOpacity key={label} style={styles.checkboxContainer} onPress={onPress}>
      <View style={[
        styles.checkbox, 
        { 
          borderColor: checked ? colors.primary : colors.borderColor,
          backgroundColor: checked ? colors.primary : 'transparent'
        }
      ]}>
        {checked && (
          <MaterialIcons name="check" size={16} color="#ffffff" />
        )}
      </View>
      <Text style={[styles.checkboxLabel, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
  
  const renderDurationSlider = () => {
    const [min, max] = viewModel.durationRange;
    return (
      <View style={styles.sliderContainer}>
        <View style={styles.sliderRow}>
          <TouchableOpacity 
            style={[styles.durationButton, { backgroundColor: colors.cardBackgroundColor }]}
            onPress={() => viewModel.setDurationRange([Math.max(1, min - 1), max])}
          >
            <MaterialIcons name="remove" size={20} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.durationDisplay}>
            <Text style={[styles.durationText, { color: colors.text }]}>
              {min} - {max >= 14 ? '14+' : max} days
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.durationButton, { backgroundColor: colors.cardBackgroundColor }]}
            onPress={() => viewModel.setDurationRange([min, Math.min(14, max + 1)])}
          >
            <MaterialIcons name="add" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    bottomSheet: {
      backgroundColor: colors.backgroundColor,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: height * 0.85,
      paddingTop: 8,
    },
    handle: {
      width: 40,
      height: 4,
      backgroundColor: colors.borderColor,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      marginBottom: 24,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'SplineSans',
    },
    clearButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    clearButtonText: {
      fontSize: 16,
      color: colors.primary,
      fontFamily: 'NotoSans',
      fontWeight: '600',
    },
    content: {
      paddingHorizontal: 24,
      paddingBottom: 100,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
      fontFamily: 'SplineSans',
    },
    radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    radioOuter: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    radioLabel: {
      fontSize: 16,
      fontFamily: 'NotoSans',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    checkboxLabel: {
      fontSize: 16,
      fontFamily: 'NotoSans',
    },
    sliderContainer: {
      marginTop: 8,
    },
    sliderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    durationButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 16,
    },
    durationDisplay: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 12,
    },
    durationText: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'NotoSans',
    },
    applyButton: {
      position: 'absolute',
      bottom: 24,
      left: 24,
      right: 24,
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    applyButtonText: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? '#111714' : '#ffffff',
      fontFamily: 'SplineSans',
    },
  });
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={{ flex: 1 }} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <Animated.View 
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filters</Text>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Difficulty Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Difficulty</Text>
              {difficultyOptions.map((option) => 
                renderRadioButton(
                  option, 
                  viewModel.selectedDifficulty === option, 
                  () => viewModel.setDifficulty(option)
                )
              )}
            </View>
            
            {/* Terrain Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Terrain</Text>
              {terrainOptions.map((option) => 
                renderCheckbox(
                  option, 
                  viewModel.selectedTerrains.includes(option), 
                  () => viewModel.toggleTerrain(option)
                )
              )}
            </View>
            
            {/* Amenities Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              {amenityOptions.map((option) => 
                renderCheckbox(
                  option, 
                  viewModel.selectedAmenities.includes(option), 
                  () => viewModel.toggleAmenity(option)
                )
              )}
            </View>
            
            {/* Duration Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Duration</Text>
              {renderDurationSlider()}
            </View>
          </ScrollView>
          
          <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ExploreFilterBottomSheet;