import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Animated } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { getAllBlogPosts } from '../../utils/Api';
import moment from 'moment';
import { htmlToText } from 'html-to-text';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseUrl } from '../../utils/BaseApi';
import axios from 'axios';
const BlogPostScreen = ({ navigation }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const theme = useTheme();

 useEffect(() => {
  const getBlogs = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await axios.get(`${BaseUrl}/blog-posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBlogs(response.data);
      console.log('blogs', response.data);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.log('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  getBlogs();
}, []);


  const renderBlog = ({ item, index }) => (
    <Animated.View 
      style={[
        styles.cardWrapper,
        { 
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        },
      ]}
    >
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Blog Detail', { id: item.id })}
      >
        <Card style={[styles.cardContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.imageContainer}>
            <FastImage
              style={styles.image}
              source={{ uri: item.image_url }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.gradient}
            />
            <Text style={styles.categoryTag}>Technology</Text>
          </View>
          
          <Card.Content style={styles.content}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
            <Text style={styles.description} numberOfLines={3}>
              {htmlToText(item.content)}
            </Text>
            
            <View style={styles.footer}>
              <View style={styles.metaData}>
                <Icon name="access-time" size={14} color="#777" />
                <Text style={styles.dateText}>
                  {moment(item.created_at).format('MMM D, YYYY')}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.readMoreButton}
                onPress={() => navigation.navigate('Blog Detail', { id: item.id })}
              >
                <Text style={styles.readMoreText}>Read More</Text>
                <Icon name="arrow-forward" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={blogs}
        renderItem={renderBlog}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={[styles.header, { color: theme.colors.text }]}>Latest Articles</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    marginLeft: 8,
  },
  cardWrapper: {
    marginBottom: 20,
  },
  cardContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  imageContainer: {
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  categoryTag: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#777',
    lineHeight: 22,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaData: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#777',
    marginLeft: 4,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    color: '#3498db',
    fontWeight: '600',
    marginRight: 4,
  },
});

export default BlogPostScreen;