import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, TouchableOpacity, TextInput, Image, StyleSheet, KeyboardAvoidingView, FlatList, Button } from 'react-native';
import { useWindowDimensions } from 'react-native';
import axios from 'axios';
import { BaseUrl } from '../../utils/BaseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000');
import moment from 'moment';

const ChatScreen = ({route}) => {
  const { width, height } = useWindowDimensions();
  const { doctorId, appointmentId } = route.params;

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(21); // Mock user ID for demonstration


  console.log(doctorId);
  useEffect(() => {
    // Replace 'http://your-api-url.com' with your actual API URL
    axios.get(`${BaseUrl}/doctors/${doctorId}`)
        .then(response => {
          setDoctors(response.data);
        })
        .catch(error => {
            console.error("There was an error fetching the doctors!", error);
        });
}, [doctorId]);
useEffect(() => {
  socket.on('message', (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
});
  fetchMessages();
}, []);
const fetchMessages = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/chat`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });

      setMessages(response.data);
      //console.log(response.data);
      setLoading(false);
      return () => {
        socket.disconnect();
    };
  } catch (error) {
      Alert.alert('Error', 'Failed to fetch appointments');
      setLoading(false);
  }
  
};

const handleSendMessage = async () => {
   
   const newMessage = {
    doctor_id: doctorId,
    message,
  };

// Emit the message to Socket.IO
socket.emit('message', newMessage);
  if (!message.trim()) return;
 
  try {
    const token = await AsyncStorage.getItem('userToken'); 
      const response = await axios.post(`${BaseUrl}/chat`, newMessage, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });

      setMessages([...messages, response.data]);
      setMessage('');
  } catch (error) {
      console.error(error);
  }
};
const renderItem = ({ item }) => (
  <View style={[styles.messageContainer, item.sender_id === userId ? styles.myMessage : styles.otherMessage]}>
      <Text style={styles.messageText}>{item.message}</Text>
  </View>
);
  return (
    <View style={styles.container}>
     
     
     
     <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
     {doctors.map((doctor,index) => (
     <Text style={{fontSize:20,fontWeight:'bold',marginLeft:10}}>{doctor.first_name} {doctor.last_name}</Text>
      ))}
      
       {messages.map((message, index) => (
        <View key={message.id}>
          <View style={[styles.messageContainer, message.sender_id === userId ? styles.myMessage : styles.otherMessage]}>
            <Text style={styles.messageText}>{message.message}</Text>
            <Text style={styles.messageTimeText}>{ moment(message.created_at, 'HH:mm').format('hh:mm A')}</Text>
          </View>
        </View>
        
      ))}

      

           
            <View style={{ flexDirection: 'row', padding: 10 }}>
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type a message"
                    style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 10 }}
                />
                <Button title="Send" onPress={handleSendMessage} />
            </View>
        </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  messagesList: {
    paddingHorizontal: 10,
},
messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
},
myMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
},
messageText: {
  fontSize: 16,
  color: '#333',
},
messageTimeText:{
  fontSize: 12,
  color: '#999',
},
  backButton: {
    marginRight: 10,
  },
  backText: {
    fontSize: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  chatText: {
    fontSize: 16,
    flexShrink: 1,
  },
  languageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  languageButton: {
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  languageText: {
    fontSize: 16,
  },
  messageInput: {
    backgroundColor: '#f0f4ff',
    borderRadius: 20,
    height: 50,
    justifyContent: 'center',
    paddingVertical: 5,
    fontSize: 16,
  },
});

export default ChatScreen;
