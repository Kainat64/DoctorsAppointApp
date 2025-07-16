import { StripeProvider } from '@stripe/stripe-react-native';
import PaymentScreen from './PaymentScreen ';
const StripeProviderScreen = () => {
    return (
        <StripeProvider publishableKey="pk_test_1234567890abcdef12345678">
         <PaymentScreen/>
      </StripeProvider>
    );
}
export default StripeProviderScreen;