import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { useTheme } from '../../../../hooks/useTheme';
import ExploreScreen from '../screens/ExploreScreen';
import MapViewExploreScreenFallback from '../screens/MapViewExploreScreenFallback';

const { width } = Dimensions.get('window');

interface ExploreTabViewProps {
  onSearchPress?: () => void;
}

const ExploreTabView: React.FC<ExploreTabViewProps> = ({ onSearchPress }) => {
  const { colors, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const tabs = [
    { key: 'list', title: 'List' },
    { key: 'map', title: 'Map' }
  ];

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    pagerRef.current?.setPage(index);
    
    // Animate indicator
    Animated.spring(animatedValue, {
      toValue: index,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handlePageSelected = (e: any) => {
    const index = e.nativeEvent.position;
    setActiveTab(index);
    
    // Animate indicator
    Animated.spring(animatedValue, {
      toValue: index,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: activeTab === 1 ? 'transparent' : colors.backgroundColor,
    },
    tabBarContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'transparent',
      borderBottomWidth: 0,
      paddingTop: 40,
      paddingHorizontal: 20,
      paddingBottom: 0,
      zIndex: 1000,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: colors.cardBackgroundColor,
      borderRadius: 12,
      padding: 4,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabText: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'SplineSans',
    },
    activeTabText: {
      color: isDarkMode ? '#111714' : '#ffffff',
    },
    inactiveTabText: {
      color: colors.secondary,
    },
    pagerView: {
      flex: 1,
      marginTop: 0,
    },
    tabContent: {
      flex: 1,
    },
    listTabContent: {
      flex: 1,
      marginTop: 120,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === index && styles.activeTab,
              ]}
              onPress={() => handleTabPress(index)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === index ? styles.activeTabText : styles.inactiveTabText,
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        <View key="list" style={styles.listTabContent}>
          <ExploreScreen hideHeader={true} onSearchPress={onSearchPress} />
        </View>

        <View key="map" style={styles.tabContent}>
          <MapViewExploreScreenFallback hideHeader={true} />
        </View>
      </PagerView>
    </View>
  );
};

export default ExploreTabView;