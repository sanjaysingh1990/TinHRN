import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../hooks/useTheme';

interface SearchBarProps {
  onSearch: (query: string) => void;
  searching: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searching }) => {
  const { colors, isDarkMode } = useTheme();
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    onSearch(searchText);
  };

  const clearSearch = () => {
    setSearchText('');
    onSearch('');
  };

  const styles = StyleSheet.create({
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 15,
    },
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBackground,
      borderRadius: 10,
      // Reduce height by 20% (from paddingVertical: 8 to paddingVertical: 6.4, rounded to 6)
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderStyle: 'dashed',
    },
    searchInput: {
      flex: 1,
      color: colors.text,
      marginLeft: 10,
    },
    filterButton: {
      marginLeft: 10,
      backgroundColor: colors.inputBackground,
      // Reduce height by 20% (from padding: 10 to padding: 8)
      padding: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    searchLoader: {
      marginRight: 10,
    },
    clearButton: {
      marginRight: 10,
    },
  });

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={24} color={colors.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search destinations"
          placeholderTextColor={colors.secondary}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        {searching && <ActivityIndicator style={styles.searchLoader} />}
        {searchText.length > 0 && !searching && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <MaterialIcons name="close" size={24} color={colors.secondary} />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={() => console.log('Filter pressed')}>
        <MaterialIcons name="filter-list" size={24} color={colors.secondary} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;