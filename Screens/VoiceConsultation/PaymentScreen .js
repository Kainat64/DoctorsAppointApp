import React from 'react';
import { View, Button, Text } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { BaseUrl } from '../../utils/BaseApi';
const PaymentScreen = ({ route  }) => {
  const navigation  = useNavigation();
  const { appointmentId, clientSecret } = route.params;
  console.log('appoint id :',appointmentId, 'client secret :',clientSecret);
  const { confirmPayment } = useStripe();

  const handlePayment = async () => {
    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      type: 'Card',
      billingDetails: {
        // You can collect the billing details here (optional)
      },
    });

    if (error) {
      console.error('Payment confirmation error:', error.message);
      // Handle error (e.g., show alert)
    } else if (paymentIntent) {
      console.log('Payment successful!', paymentIntent);
      // Handle success (e.g., update appointment status in backend)
      navigation.navigate('PaymentSuccess', { appointmentId });
    }
  };

  return (
    <View>
      <Text>Confirm your payment</Text>
      <Button title="Pay" onPress={handlePayment} />
    </View>
  );
};

export default PaymentScreen;
