import React, { useState, useEffect } from 'react';
import {View, Text, Button,Alert, ActivityIndicator,StyleSheet,Image } from 'react-native';
import getBlogDetailById from '../../utils/Api';
import axios from 'axios';
import { BaseUrl } from '../../utils/BaseApi';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from 'react-native-elements';
import { htmlToText } from 'html-to-text'; // Import the library
import { postComment } from '../../utils/Api';
const BlogDetailScreen = ({ route }) => {
  const { id } = route.params;
  console.log('blog id',id);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  useEffect(() => {
    if (route.params?.id) {
        loadBlogDetail(route.params.id);
        
    }
    //loadBlogWithComments(route.params.id);
}, [route.params?.id]);

const loadBlogDetail = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${BaseUrl}/blog-detail/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        console.log('fetching...');
        setBlog(response.data);
        //console.log(response.data);
        setLoading(false);
    } catch (error) {
        Alert.alert('Error', 'Failed to fetch Blog Detail');
        setLoading(false);
    }
    
};
const loadBlogWithComments = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${BaseUrl}/blogs/${id}/comments`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
      
        setBlog(response.data);
        console.log('fetching...',response.data);
        setLoading(false);
    } catch (error) {
        Alert.alert('Error', 'Failed to fetch Blog Detail');
        setLoading(false);
    }
    
};
  if (loading) {
    return <Text>
      <ActivityIndicator size={"large"}/>
    </Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }
// Post a new comment
const handlePostComment = async () => {
    try {
      const { data } = await postComment(id, comment);
      setComments([...comments, data]); // Update comments list
      setComment(''); // Clear the input
    } catch (error) {
      console.log(error);
    }
  };
  return blog ? (
      <ScrollView>
          <View style={styles.container}>
              <Card.Title style={styles.title} >{blog.title}</Card.Title>
              <Image
                  style={styles.image}
                  source={{ uri: blog.image_url }}
                  resizeMode="cover"
              />
              <Text style={styles.description}>

                  {htmlToText(blog.content)}

              </Text>
              <Button title="Add Comment"  />
          </View>
      </ScrollView>
  ) : <Text>Loading...</Text>;
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f9f9f9',
    },
    cardContainer: {
      borderRadius: 10,
      elevation: 5,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 20,
      padding:10,
    },
    title: {
      fontSize: 18,
      marginTop: 10,
      fontWeight: 'bold',
    },
    description: {
      marginVertical: 10,
      color: '#777',
      margin:10,
      fontSize:16,
      fontWeight:'400',
      letterSpacing:1,
    },
    button: {
      backgroundColor: '#3498db',
      borderRadius: 10,
    },
  });
export default BlogDetailScreen;
