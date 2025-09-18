import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import container from '../../../../container';
import { useTheme } from '../../../../hooks/useTheme';
import { CustomizeTourViewModelToken } from '../../data/di/tokens';
import { AddOn, SupportOption, TentOption } from '../../domain/entities/CustomizeTour';
import {
    AddOnsShimmer,
    CalendarShimmer,
    SupportCardsShimmer,
    TentOptionsShimmer,
} from '../components/CustomizeTourShimmers';
import { CustomizeTourViewModel } from '../viewmodels/CustomizeTourViewModel';

const { width } = Dimensions.get('window');

const CustomizeTourScreen: React.FC = () => {
  const router = useRouter();
  const { 
    tourId, 
    tourName, 
    tourImage, 
    tourDuration, 
    tourDifficulty, 
    tourAltitude,
    bestTime
  } = useLocalSearchParams();
  const { colors, isDarkMode } = useTheme();
  const [customizeTourViewModel] = useState(() => 
    container.resolve<CustomizeTourViewModel>(CustomizeTourViewModelToken)
  );
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [saving, setSaving] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [bestTimeMonths, setBestTimeMonths] = useState<string[]>([]);

  useEffect(() => {
    // Set up the update callback for ViewModel
    customizeTourViewModel.setUpdateCallback(() => {
      setForceUpdate(prev => prev + 1);
    });
    
    // Set tour ID in ViewModel
    if (tourId) {
      customizeTourViewModel.setTourId(tourId as string);
    }
    
    // Parse bestTime data
    if (bestTime) {
      try {
        const parsedBestTime = JSON.parse(bestTime as string);
        setBestTimeMonths(parsedBestTime);
      } catch (e) {
        console.error('Error parsing bestTime:', e);
        setBestTimeMonths([]);
      }
    }
    
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await customizeTourViewModel.loadCustomizationData();
    } catch (error) {
      console.error('Error loading customization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!customizeTourViewModel.isSelectionComplete()) {
      Alert.alert('Incomplete Selection', 'Please select a date and tent option before continuing.');
      return;
    }

    try {
      const result = await customizeTourViewModel.bookTour();
      if (result.success) {
        // Navigate to the Bookings tab in the Home screen
        router.replace('/(tabs)/bookings');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to book tour. Please try again.');
    }
  };

  const handleSupportAction = (option: SupportOption) => {
    if (option.action === 'chat') {
      Alert.alert('Chat Support', `Starting chat with ${option.contact}`);
    } else if (option.action === 'call') {
      Alert.alert('Call Support', `Calling ${option.contact}`);
    }
  };

  const renderCalendar = () => {
    if (loading) return <CalendarShimmer />;

    const data = customizeTourViewModel.customizationData;
    if (!data) return null;

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Check if current month is in bestTimeMonths
    const isCurrentMonthAvailable = bestTimeMonths.length === 0 || 
      bestTimeMonths.includes(monthNames[currentMonth.getMonth()]);

    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startDayOfWeek = firstDay.getDay();

      const days = [];
      
      // Add empty cells for days before the first day of month
      for (let i = 0; i < startDayOfWeek; i++) {
        days.push(null);
      }
      
      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        // All days are available now, but selection is restricted by month
        const isAvailable = isCurrentMonthAvailable;
        const isStartDate = customizeTourViewModel.selection.startDate?.toDateString() === date.toDateString();
        const isEndDate = customizeTourViewModel.selection.endDate?.toDateString() === date.toDateString();
        const isInSelectedRange = customizeTourViewModel.selection.startDate && customizeTourViewModel.selection.endDate &&
          date > customizeTourViewModel.selection.startDate && date < customizeTourViewModel.selection.endDate;
        
        days.push({ day, date, isAvailable, isStartDate, isEndDate, isInSelectedRange });
      }
      
      return days;
    };

    const days = getDaysInMonth(currentMonth);
    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const styles = StyleSheet.create({
      calendarContainer: {
        backgroundColor: colors.cardBackgroundColor,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.borderColor,
        borderStyle: 'dashed',
        margin: 20,
        padding: 20,
      },
      calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      },
      monthText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        fontFamily: 'SplineSans',
      },
      navButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
      },
      weekDaysRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
      },
      weekDayText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.secondary,
        width: 35,
        textAlign: 'center',
        fontFamily: 'NotoSans',
      },
      daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      },
      dayCell: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 2,
      },
      availableDay: {
        backgroundColor: 'transparent',
      },
      startDate: {
        backgroundColor: colors.primary,
      },
      endDate: {
        backgroundColor: colors.primary,
      },
      inRange: {
        backgroundColor: colors.primary + '40',
      },
      unavailableDay: {
        backgroundColor: 'transparent',
        opacity: 0.3,
      },
      dayText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'NotoSans',
      },
      availableDayText: {
        color: colors.text,
      },
      selectedDayText: {
        color: isDarkMode ? '#111714' : '#ffffff',
      },
      inRangeDayText: {
        color: colors.text,
      },
      unavailableDayText: {
        color: colors.secondary,
      },
    });

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => {
              const prevMonth = new Date(currentMonth);
              prevMonth.setMonth(prevMonth.getMonth() - 1);
              setCurrentMonth(prevMonth);
            }}
          >
            <MaterialIcons name="chevron-left" size={24} color={isDarkMode ? '#111714' : '#ffffff'} />
          </TouchableOpacity>
          
          <Text style={styles.monthText}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Text>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => {
              const nextMonth = new Date(currentMonth);
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              setCurrentMonth(nextMonth);
            }}
          >
            <MaterialIcons name="chevron-right" size={24} color={isDarkMode ? '#111714' : '#ffffff'} />
          </TouchableOpacity>
        </View>

        {!isCurrentMonthAvailable && bestTimeMonths.length > 0 && (
          <Text style={{ 
            color: colors.secondary, 
            textAlign: 'center', 
            marginBottom: 10,
            fontStyle: 'italic'
          }}>
            This month is not recommended for this tour. Best months: {bestTimeMonths.join(', ')}
          </Text>
        )}

        <View style={styles.weekDaysRow}>
          {weekDays.map((day, index) => (
            <Text key={index} style={styles.weekDayText}>{day}</Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {days.map((dayData, index) => {
            if (!dayData) {
              return <View key={index} style={styles.dayCell} />;
            }

            const { day, date, isAvailable, isStartDate, isEndDate, isInSelectedRange } = dayData;
            
            let dayCellStyle = styles.availableDay;
            let dayTextStyle = styles.availableDayText;
            
            if (isStartDate || isEndDate) {
              dayCellStyle = styles.startDate; // Both start and end use the same style
              dayTextStyle = styles.selectedDayText;
            } else if (isInSelectedRange) {
              dayCellStyle = styles.inRange;
              dayTextStyle = styles.inRangeDayText;
            } else if (!isAvailable) {
              dayCellStyle = styles.unavailableDay;
              dayTextStyle = styles.unavailableDayText;
            }
            
            return (
              <TouchableOpacity
                key={index}
                style={[styles.dayCell, dayCellStyle]}
                disabled={!isAvailable}
                onPress={() => {
                  if (!isAvailable) return;
                  
                  // If no start date selected, set as start date
                  if (!customizeTourViewModel.selection.startDate) {
                    customizeTourViewModel.selectStartDate(date);
                  } 
                  // If start date is selected but no end date, set as end date (if after start)
                  else if (!customizeTourViewModel.selection.endDate && date >= customizeTourViewModel.selection.startDate) {
                    customizeTourViewModel.selectEndDate(date);
                  } 
                  // If both dates selected, reset and set as new start date
                  else if (customizeTourViewModel.selection.startDate && customizeTourViewModel.selection.endDate) {
                    customizeTourViewModel.selectStartDate(date);
                    customizeTourViewModel.selectEndDate(null as any); // Reset end date
                  }
                }}
              >
                <Text style={[styles.dayText, dayTextStyle]}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderTentOptions = () => {
    if (loading) return <TentOptionsShimmer />;

    const data = customizeTourViewModel.customizationData;
    if (!data) return null;

    const styles = StyleSheet.create({
      tentContainer: {
        paddingHorizontal: 20,
        marginBottom: 30,
      },
      tentOption: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 25,
        borderWidth: 2,
        borderStyle: 'dashed',
        marginBottom: 12,
        alignItems: 'center',
      },
      unselectedTent: {
        borderColor: colors.borderColor,
        backgroundColor: 'transparent',
      },
      selectedTent: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '20',
      },
      tentName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        fontFamily: 'SplineSans',
      },
      unselectedTentText: {
        color: colors.text,
      },
      selectedTentText: {
        color: colors.primary,
      },
      tentPrice: {
        fontSize: 14,
        fontFamily: 'NotoSans',
      },
      unselectedTentPrice: {
        color: colors.secondary,
      },
      selectedTentPrice: {
        color: colors.primary,
      },
    });

    return (
      <View style={styles.tentContainer}>
        {data.tentOptions.map((tent: TentOption) => {
          const isSelected = customizeTourViewModel.selection.selectedTent?.id === tent.id;
          
          return (
            <TouchableOpacity
              key={tent.id}
              style={[
                styles.tentOption,
                isSelected ? styles.selectedTent : styles.unselectedTent
              ]}
              onPress={() => customizeTourViewModel.selectTent(tent)}
            >
              <Text style={[
                styles.tentName,
                isSelected ? styles.selectedTentText : styles.unselectedTentText
              ]}>
                {tent.name}
              </Text>
              <Text style={[
                styles.tentPrice,
                isSelected ? styles.selectedTentPrice : styles.unselectedTentPrice
              ]}>
                ${tent.pricePerNight}/night • Up to {tent.maxOccupancy} guests
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderAddOns = () => {
    if (loading) return <AddOnsShimmer />;

    const data = customizeTourViewModel.customizationData;
    if (!data) return null;

    const styles = StyleSheet.create({
      addOnsContainer: {
        paddingHorizontal: 20,
        marginBottom: 30,
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
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.borderColor,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
      },
      checkedBox: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
      },
      addOnContent: {
        flex: 1,
      },
      addOnName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
        fontFamily: 'SplineSans',
      },
      addOnDescription: {
        fontSize: 14,
        color: colors.secondary,
        fontFamily: 'NotoSans',
      },
      addOnPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
        fontFamily: 'SplineSans',
      },
    });

    return (
      <View style={styles.addOnsContainer}>
        {data.addOns.map((addOn: AddOn) => (
          <TouchableOpacity
            key={addOn.id}
            style={styles.addOnItem}
            onPress={() => customizeTourViewModel.toggleAddOn(addOn.id)}
          >
            <View style={[styles.checkbox, addOn.isSelected && styles.checkedBox]}>
              {addOn.isSelected && (
                <MaterialIcons name="check" size={16} color={isDarkMode ? '#111714' : '#ffffff'} />
              )}
            </View>
            <View style={styles.addOnContent}>
              <Text style={styles.addOnName}>{addOn.name}</Text>
              <Text style={styles.addOnDescription}>{addOn.description}</Text>
            </View>
            <Text style={styles.addOnPrice}>${addOn.price}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderSupportCards = () => {
    if (loading) return <SupportCardsShimmer />;

    const data = customizeTourViewModel.customizationData;
    if (!data) return null;

    const styles = StyleSheet.create({
      supportContainer: {
        paddingHorizontal: 20,
        marginBottom: 160, // Increased space for footer and prevent cutting
        paddingBottom: 20, // Additional padding
      },
      supportCard: {
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
      supportIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
      },
      supportContent: {
        flex: 1,
      },
      supportTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
        fontFamily: 'SplineSans',
      },
      supportSubtitle: {
        fontSize: 14,
        color: colors.secondary,
        fontFamily: 'NotoSans',
      },
    });

    return (
      <View style={styles.supportContainer}>
        {data.supportOptions.map((option: SupportOption) => (
          <TouchableOpacity
            key={option.id}
            style={styles.supportCard}
            onPress={() => handleSupportAction(option)}
          >
            <View style={styles.supportIcon}>
              <MaterialIcons 
                name={option.icon as any} 
                size={24} 
                color={isDarkMode ? '#111714' : '#ffffff'} 
              />
            </View>
            <View style={styles.supportContent}>
              <Text style={styles.supportTitle}>{option.title}</Text>
              <Text style={styles.supportSubtitle}>{option.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const mainStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      paddingTop: 40,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'SplineSans',
    },
    placeholder: {
      width: 40,
    },
    scrollContainer: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginLeft: 20,
      marginTop: 20,
      marginBottom: 16,
      fontFamily: 'SplineSans',
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.borderColor,
      paddingHorizontal: 20,
      paddingVertical: 16,
      paddingBottom: 30,
    },
    continueButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 10,
    },
    continueButtonDisabled: {
      opacity: 0.5,
    },
    continueButtonText: {
      color: isDarkMode ? '#111714' : '#ffffff',
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: 'SplineSans',
    },
    totalPrice: {
      fontSize: 16,
      color: colors.text,
      textAlign: 'center',
      fontFamily: 'NotoSans',
    },
  });

  return (
    <SafeAreaView style={mainStyles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={mainStyles.header}>
        <TouchableOpacity style={mainStyles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={mainStyles.headerTitle}>Customize Your Tour</Text>
        <View style={mainStyles.placeholder} />
      </View>

      <ScrollView style={mainStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Step 1: Choose Dates */}
        <Text style={mainStyles.sectionTitle}>Step 1: Choose Dates</Text>
        {renderCalendar()}

        {/* Step 2: Select Your Tent */}
        <Text style={mainStyles.sectionTitle}>Step 2: Select Your Tent</Text>
        {renderTentOptions()}

        {/* Step 3: Add-ons */}
        <Text style={mainStyles.sectionTitle}>Step 3: Add-ons</Text>
        {renderAddOns()}

        {/* Help Section */}
        <Text style={mainStyles.sectionTitle}>Need Help?</Text>
        {renderSupportCards()}
      </ScrollView>

      {/* Footer */}
      <View style={mainStyles.footer}>
        <Text style={mainStyles.totalPrice}>
          Total: ${customizeTourViewModel.selection.totalPrice}
        </Text>
        <TouchableOpacity
          style={[
            mainStyles.continueButton,
            (!customizeTourViewModel.isSelectionComplete() || customizeTourViewModel.isBookingLoading) && mainStyles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!customizeTourViewModel.isSelectionComplete() || customizeTourViewModel.isBookingLoading}
        >
          <Text style={mainStyles.continueButtonText}>
            {customizeTourViewModel.isBookingLoading ? 'Booking...' : 'Book your tour'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CustomizeTourScreen;