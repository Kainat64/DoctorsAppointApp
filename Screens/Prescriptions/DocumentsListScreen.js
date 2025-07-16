import React, { useEffect, useState } from 'react';
import {ScrollView, View, Text, FlatList, Button, Linking,Image } from 'react-native';
import axios from 'axios';
import { BaseUrl } from '../../utils/BaseApi';
const DocumentsListScreen = ({ route }) => {
  const { appointmentId } = route.params;
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    axios.get(`${BaseUrl}/appointments/${appointmentId}/documents`)
      .then(response => setDocuments(response.data))
      .catch(error => console.error(error));
  }, [appointmentId]);

  return (
    <ScrollView>
          <View>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Documents List</Text>

          </View>
          <View>
      <FlatList
        data={documents}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.file_path}</Text>
           

            <Button title="View" onPress={() => Linking.openURL(`https://doctors-365.caesar.business/storage/${item.file_path}`)} />
          </View>
        )}
      />
    </View>
    </ScrollView>
    
  );
};

export default DocumentsListScreen;
