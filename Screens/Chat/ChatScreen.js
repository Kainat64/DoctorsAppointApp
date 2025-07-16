import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, useWindowDimensions } from 'react-native';
import axios from 'axios';
import { BaseUrl } from '../../utils/BaseApi';
import { htmlToText } from 'html-to-text';
import asyncStorage from '@react-native-async-storage/async-storage';

const ChatScreen = ({ route }) => {
  const { width } = useWindowDimensions();
  const [keyword, setKeyword] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [displayedWords, setDisplayedWords] = useState([]);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Predefined FAQs
  const faqs = [
    { question: "How can I book an appointment?", answer: "You can book an appointment by selecting a doctor and choosing an available time slot." },
    { question: "How can I book a video consultation?", answer: "To book a video consultation, go to the appointments section and select 'Video Consultation' as the appointment type." },
    // Add more FAQs here
  ];

  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  // Create an axios instance with default headers
  const api = axios.create({
    baseURL: BaseUrl,
  });

  // Add request interceptor to include token
  api.interceptors.request.use(async (config) => {
    try {
      const token = await asyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("Error setting auth token:", error);
      return config;
    }
  });

  const handleSearch = useCallback(async () => {
    if (!keyword.trim()) return;
    
    setLoading(true);
    setError('');
    setDisplayedWords([]);
    setCurrentArticleIndex(0);
    setCurrentWordIndex(0);
    
    try {
      const response = await api.get('/SearchArticle', { 
        params: { keyword },
        // Timeout after 30 seconds
        timeout: 30000
      });
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError('Failed to fetch articles. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [keyword, api]);

  const handleFaqSelect = useCallback((faq) => {
    setKeyword('');
    setDisplayedWords([faq.answer]);
    setFilteredFaqs([]);
  }, []);

  useEffect(() => {
    if (articles.length > 0 && currentArticleIndex < articles.length) {
      const articleText = htmlToText(articles[currentArticleIndex].body);
      const words = articleText.split(' ');

      const intervalId = setInterval(() => {
        if (currentWordIndex < words.length) {
          setDisplayedWords(prevWords => [...prevWords, words[currentWordIndex]]);
          setCurrentWordIndex(prevIndex => prevIndex + 1);
        } else {
          clearInterval(intervalId);
          setCurrentArticleIndex(prevIndex => prevIndex + 1);
        }
      }, 100);

      return () => clearInterval(intervalId);
    }
  }, [articles, currentArticleIndex, currentWordIndex]);

  useEffect(() => {
    if (isFocused) {
      setFilteredFaqs(faqs);
    } else if (!keyword) {
      setFilteredFaqs([]);
    }
  }, [isFocused, keyword]);

  const clearChat = useCallback(() => {
    setKeyword('');
    setDisplayedWords([]);
    setFilteredFaqs([]);
    setArticles([]);
    setError('');
    setLoading(false);
    setCurrentArticleIndex(0);
    setCurrentWordIndex(0);
  }, []);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={styles.inputContainer}>
          <TextInput
            value={keyword}
            onChangeText={setKeyword}
            placeholder="Type a keyword or question"
            placeholderTextColor="black"
            style={styles.input}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity 
            style={[styles.button, loading && styles.disabledButton]} 
            onPress={handleSearch}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Loading..." : "Search"}</Text>
          </TouchableOpacity>
        </View>

        {isFocused && filteredFaqs.length > 0 && (
          <View style={styles.suggestions}>
            {filteredFaqs.map((faq, index) => (
              <TouchableOpacity key={index} onPress={() => handleFaqSelect(faq)}>
                <Text style={styles.suggestionText}>{faq.question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <ScrollView style={styles.results}>
            <Text style={styles.articleText}>{displayedWords.join(' ')}</Text>
          </ScrollView>
        )}

        <TouchableOpacity style={styles.clearButton} onPress={clearChat}>
          <Text style={styles.clearButtonText}>Clear Chat</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    marginRight: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  suggestions: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  suggestionText: {
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  results: {
    flex: 1,
    marginBottom: 60, // To prevent content from being hidden behind the clear button
  },
  articleText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  clearButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorContainer: {
    padding: 10,
    backgroundColor: '#FFEBEE',
    borderRadius: 5,
    marginVertical: 10,
  },
  errorText: {
    color: '#C62828',
    textAlign: 'center',
  },
});

export default ChatScreen;