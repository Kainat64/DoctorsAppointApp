import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  Button,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from 'react-native-paper';
import { htmlToText } from 'html-to-text';
import { BaseUrl } from '../../utils/BaseApi';

const BlogDetailScreen = ({ route }) => {
  const { id } = route.params;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchData(id);
  }, [id]);

  const fetchData = async (blogId) => {
    setLoading(true); // Start loading state
    try {
      // Log blogId to ensure it's valid
      console.log('Fetching blog with ID:', blogId);
      if (!blogId) {
        throw new Error('Invalid blog ID');
      }
  
      // Retrieve token
      const token = await AsyncStorage.getItem('userToken');
      console.log('Token:', token);
  
      if (!token) {
        throw new Error('Missing authentication token');
      }
  
      // Fetch blog data
      const [blogResponse] = await Promise.all([
        axios.get(`${BaseUrl}/blog-detail/${blogId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
  
      // Set blog state
      setBlog(blogResponse.data);
      console.log('Blog response full:', JSON.stringify(blogResponse.data));

  
    } catch (error) {
      console.error('Error fetching blog:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to load blog.');
    } finally {
      setLoading(false); // Stop loading state
    }
  };
  

  const handlePostComment = useCallback(async () => {
    if (!comment.trim()) {
      Alert.alert('Error', 'Comment cannot be empty.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${BaseUrl}/blogs/comments`,
        { post_id: id, comment },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        Alert.alert('Success', 'Comment added successfully.');
        setComments((prevComments) => [
          ...prevComments,
          { id: new Date().toISOString(), user: { name: 'You' }, comment },
        ]);
        setComment('');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to add comment.'
      );
    }
  }, [comment, id]);

  const renderHeader = () => (
    <View >
      {blog && (
        <>
          <Card style={{ paddingLeft: 6 }}>
            <Card.Title title={blog.title} />
            <Image style={styles.image} source={{ uri: blog.image_url }} />
            <Text style={styles.description}>{htmlToText(blog.content)}</Text>
          </Card>
        
        </>
      )}
    </View>
  );

  const renderFooter = () => (
    <View>
      <TextInput
        style={styles.input}
        value={comment}
        onChangeText={setComment}
        placeholder="Add a comment"
      />
      <Button title="Post Comment" onPress={handlePostComment} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={renderHeader}
     
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  description: {
    marginVertical: 10,
    color: '#333',
    fontSize: 16,
    lineHeight: 24,
  },
  commentsHeader: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  commentText: {
    marginTop: 5,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
});

export default BlogDetailScreen;
