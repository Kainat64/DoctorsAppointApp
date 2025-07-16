import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Button, ActivityIndicator, Alert, FlatList } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';
import { BaseUrl } from '../../utils/BaseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
const MedicalRecordScreen = ({ navigation, route }) => {
  const { appointmentId, appointment } = route.params;
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSelectDocuments = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });
      setDocuments(result);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        throw err;
      }
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera to take pictures',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // iOS auto-handles
    }
  };

  const handleCaptureImage = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Cannot access camera.');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.6,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else {
        setSelectedImage(response.assets[0]);
      }
    });
  };

  const handleUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('appointment_id', appointmentId);
    documents.forEach((doc, index) => {
      formData.append('documents[]', {
        uri: doc.uri,
        type: doc.type || 'image/jpeg',
        name: doc.name,
      });
      formData.append('document_names[]', doc.name);
    });
    if (selectedImage) {
      formData.append('documents[]', {
        uri: selectedImage.uri,
        type: selectedImage.type || 'image/jpeg',
        name: selectedImage.fileName,
      });
      formData.append('document_names[]', selectedImage.fileName);
    }
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(`${BaseUrl}/upload-documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      Alert.alert('Documents uploaded successfully');
      setDocuments([]);
      setSelectedImage(null);
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to upload documents');
    } finally {
      setLoading(false);
    }
  };

  const showVideoCallButton = appointment?.status === 1 && appointment?.types === 2;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MyAppointment')}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient Medical Record</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={styles.activeTab}>
          <Text style={styles.activeTabText}>My Reports</Text>
        </TouchableOpacity>
      </View>
      {/* Content */}
      <View style={styles.content}>
        <Image
          source={require("../../assets/fxemoji_folder.png")}
          style={styles.folderImage}
        />
        <Text style={styles.mainText}>Keep Your Medical Records Safe!</Text>
        <Text style={styles.subText}>Start managing your medical health records!</Text>
      </View>
      {/* Video Call Button (conditionally shown) */}
      {showVideoCallButton && (
        <TouchableOpacity style={styles.videoCallButton} onPress={() => {}}>
          <Icon name="videocam" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.videoCallButtonText}>Start Video Call</Text>
        </TouchableOpacity>
      )}

      {/* Add Reports Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleSelectDocuments}>
        <Icon name="attach-file" size={20} color="#34C759" style={styles.buttonIcon} />
        <Text style={styles.addButtonText}>Attach Reports</Text>
      </TouchableOpacity>

      <Text style={styles.documentCount}>Selected Reports: {documents.length}</Text>

      <TouchableOpacity style={styles.addButton} onPress={handleCaptureImage}>
        <Icon name="camera-alt" size={20} color="#34C759" style={styles.buttonIcon} />
        <Text style={styles.addButtonText}>Capture Image</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 20 }}>
        {selectedImage && (
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.previewImage}
          />
        )}
      </View>

      <View style={{ marginTop: 15 }}>
        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload} disabled={loading}>
          <Icon name="cloud-upload" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.uploadButtonText}>Upload Documents</Text>
          {loading && <ActivityIndicator size="small" color="white" style={styles.loadingIndicator} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  backText: {
    fontSize: 24,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  activeTabText: {
    fontSize: 16,
    color: '#333',
  },
  content: {
    alignItems: 'center',
    marginBottom: 30,
  },
  folderImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  mainText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  documentCount: {
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
    color: '#555',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#34C759',
  },
  // New button styles
  addButton: {
    backgroundColor: '#E5F8E8',
    borderWidth: 1,
    borderColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    width: '80%',
  },
  uploadButton: {
    backgroundColor: '#274A8A',
    borderWidth: 1,
    borderColor: '#274A8A',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  videoCallButton: {
    backgroundColor: '#FF3B30',
    borderWidth: 1,
    borderColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '80%',
  },
  addButtonText: {
    fontSize: 16,
    color: '#34C759',
    fontWeight: '600',
    marginLeft: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  videoCallButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 5,
  },
  loadingIndicator: {
    marginLeft: 10,
  },
});

export default MedicalRecordScreen;