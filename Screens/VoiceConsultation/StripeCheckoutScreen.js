import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BaseUrl } from '../../utils/BaseApi';
import axios from 'axios';
const StripeCheckoutScreen = ({ route }) => {
  const navigation = useNavigation();
  const { checkoutUrl } = route.params; // Get sessionUrl passed from the previous screen
  const [loading, setLoading] = useState(true);

  const handleWebViewNavigationStateChange = (newNavState) => {
    const { url } = newNavState;
    console.log('Navigated to URL:', url);

    // Check for payment success or cancellation URLs
    if (url.includes('payment-success')) {
      // Payment successful, redirect to Home Screen
      Alert.alert('Payment Successful!', 'You will be redirected to the home screen.');
      
      navigation.navigate('Home'); // Adjust the screen name based on your app
    } else if (url.includes('payment-cancel')) {
      // Payment was cancelled
      Alert.alert('Payment Cancelled', 'You will be redirected to the home screen.');
      navigation.navigate('HomeScreen'); // Adjust the screen name based on your app
    }
  };
  const saveTransactionDetails = async (sessionId) => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // Get user token if needed
  
      // Make API call to Stripe to fetch session details using session ID
      const stripeResponse = await axios.get(`${BaseUrl}/get-checkout-session/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Auth header
          'Content-Type': 'application/json',
        },
      });
  
      const { appointment_id, amount_total, currency, payment_status, card_last_four, card_exp_month, card_exp_year, email, phone } = stripeResponse.data;
  
      // Prepare transaction data
      const transactionData = {
        transaction_id: sessionId,
        transaction_date: new Date().toISOString().split('T')[0], // current date
        appointment_id,
        amount: amount_total / 100, // Stripe amount is in cents, so divide by 100
        currency,
        card_last_four,
        card_exp_month,
        card_exp_year,
        email,
        phone,
        status: payment_status === 'succeeded' ? 1 : 0,
      };
  
      // Save the transaction details to your backend
      await axios.post(`${BaseUrl}/save-transaction`, transactionData, {
        headers: {
          Authorization: `Bearer ${token}`, // Auth header
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Transaction saved successfully');
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };
  
  return (
    <View style={{ flex: 1 }}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <WebView
        source={{ uri: checkoutUrl }} // Stripe Checkout URL
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleWebViewNavigationStateChange} // Detect URL changes
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
      />
    </View>
  );
};

export default StripeCheckoutScreen;
