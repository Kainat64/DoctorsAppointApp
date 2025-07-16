import React, { useState } from 'react';
import { TextInput, FlatList, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import axios from 'axios';
import { BaseUrl } from '../../utils/BaseApi';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const SearchDoctorScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Function to search doctors by query
  const searchDoctors = async (text) => {
    setQuery(text);

    if (text.length > 1) {
      try {
        const token = await AsyncStorage.getItem('userToken');
        
        // Log the URL for debugging purposes
        console.log(`${BaseUrl}/search-doctors?query=${text}`);
        
        const response = await axios.get(`${BaseUrl}/search-doctors?query=${text}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuggestions(response.data);
        console.log('doctors', response.data);
      } catch (error) {
        console.log(error);
      }
    } else {
      setSuggestions([]); // Clear suggestions when query is empty or less than 2 characters
    }
  };

  // Function to handle input focus and show suggestions
  const handleFocus = () => {
    if (query.length === 0) {
      // Fetch suggestions when input is focused and query is empty
      setSuggestions([]); // Show default suggestions or a placeholder list
    }
  };

  const handleSelect = (departmentId, specialistId) => {
    navigation.navigate('Doctors List', { departmentId, specialistId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={searchDoctors}
          placeholderTextColor={"#888"}
          placeholder="Search by department or specialist"
          onFocus={handleFocus}  // Trigger search on focus
        />
      </View>

      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => handleSelect(item.department_id, item.specialist_id)}
          >
            <Text style={styles.suggestionText}>{item.department.title} - {item.specialist.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          query.length > 1 && (
            <Text style={styles.noResultsText}>No suggestions found</Text>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
    color: '#333',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 10,
    color: '#333',
  },
  searchIcon: {
    marginRight: 10,
  },
  suggestionItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
  noResultsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SearchDoctorScreen;
