import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import ExploreListContent from '../components/ExploreListContent';
import ExploreMapContent from '../components/ExploreMapContent';

const ExploreScreenWithTabs: React.FC = () => {
  const { colors, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');

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
      paddingHorizontal: 20,
      paddingVertical: 16,
      paddingTop: 40,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'SplineSans',
      textAlign: 'center',
      marginBottom: 20,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.cardBackgroundColor,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderStyle: 'dashed',
      padding: 4,
      marginHorizontal: 20,
      marginBottom: 16,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    inactiveTab: {
      backgroundColor: 'transparent',
    },
    tabText: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'SplineSans',
      marginLeft: 6,
    },
    activeTabText: {
      color: isDarkMode ? '#111714' : '#ffffff',
    },
    inactiveTabText: {
      color: colors.secondary,
    },
    contentContainer: {
      flex: 1,
    },
  });

  const renderContent = () => {
    if (activeTab === 'list') {
      return <ExploreListContent />;
    } else {
      return <ExploreMapContent />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        
        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'list' ? styles.activeTab : styles.inactiveTab,
            ]}
            onPress={() => setActiveTab('list')}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="view-list"
              size={20}
              color={activeTab === 'list' 
                ? (isDarkMode ? '#111714' : '#ffffff')
                : colors.secondary
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'list' ? styles.activeTabText : styles.inactiveTabText,
              ]}
            >
              List
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'map' ? styles.activeTab : styles.inactiveTab,
            ]}
            onPress={() => setActiveTab('map')}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="map"
              size={20}
              color={activeTab === 'map' 
                ? (isDarkMode ? '#111714' : '#ffffff')
                : colors.secondary
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'map' ? styles.activeTabText : styles.inactiveTabText,
              ]}
            >
              Map
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

export default ExploreScreenWithTabs;