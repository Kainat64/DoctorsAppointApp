import React,{useState, useEffect} from "react";
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');
import { getPregnancyCarePlans } from "../../utils/Api";
const PregnancyCareScreen = () => {
  const navigation = useNavigation();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    loadPregnancyCarePlans();
  
  }, []);
  const loadPregnancyCarePlans = async () => {
    const response = await getPregnancyCarePlans();
    setPlans(response.data);
    console.log(response.data);
  };
  

  if (error) {
    return <Text>Error: {error}</Text>;
  }
  return (
    <ScrollView style={styles.container}>
       <TouchableOpacity onPress={() => navigation.navigate('Family Plans')} style={styles.backButton}>
       <Ionicons name="arrow-back" size={20} color="#007BFF" />

        <Text style={styles.backButtonText}>{"Back"}</Text>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        <Image
        source={require('../../assets/pregnancy.png')}
          style={styles.image}
        />
        <Text style={styles.title}>Pregnancy Care Plan</Text>
        <Text style={styles.subtitle}>
          Enjoy unlimited instant consultations and a personalized diet plan crafted by expert nutritionists.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advantages Of Subscribe Plan</Text>
        <View style={styles.listItem}>
          <Text style={styles.listText}>● Unlimited Online Consultations with Gynecologist</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listText}>● Personalized Diet Plan by Certified Nutritionist</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listText}>● Second Opinions on Reports and Ultrasounds</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listText}>● Guidance for lifestyle modification in Pregnancy</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pregnancy's Care Plans</Text>
        <View style={styles.planContainer}>
          {plans.map((plan, index) => (
            <View key={index} style={styles.planCard}>
              <Text style={styles.planTitle}>Basic</Text>
              <Text style={styles.planPrice}>3 Months</Text>
              <Text style={styles.planDiscount}>$1300 </Text>
              <Text style={styles.planOriginalPrice}>$ {plan.plan_a}</Text>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          ))}
           {plans.map((plan, index) => (
            <View key={index} style={styles.planCard}>
              <Text style={styles.planTitle}>Standard</Text>
              <Text style={styles.planPrice}>3 Months</Text>
              <Text style={styles.planDiscount}> $1300</Text>
              <Text style={styles.planOriginalPrice}>$ {plan.plan_b}</Text>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          ))}
           {plans.map((plan, index) => (
            <View key={index} style={styles.planCard}>
              <Text style={styles.planTitle}>Premium</Text>
              <Text style={styles.planPrice}>3 Months</Text>
              <Text style={styles.planDiscount}> $1300</Text>
              <Text style={styles.planOriginalPrice}>$ {plan.plan_c}</Text>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why you need to book the plan?</Text>
        <View style={styles.listItem}>
          <Text style={styles.listText}>● Get unlimited online video consultations with top specialist doctors, anywhere, anytime!</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listText}>● Connect with a doctor within a few minutes and get yourself checked in the comfort of your home.</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listText}>● Doctors are available from 10:00 AM till 10:00 PM, 6 Days a week.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.02,
  },
  backButton: {
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center', // Vertically align icon and text
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignSelf: 'flex-start',
    margin: 10,

  },
  backButtonText: {
    color: '#007BFF',
    fontSize: 16,
  },

  headerText: {
    fontSize: height * 0.03,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: height * 0.03,
   
  },
  image: {
    width: width * 0.8,
    height: height * 0.3,
    borderRadius: width * 0.02,
  },
  title: {
    fontSize: height * 0.03,
    fontWeight: 'bold',
    marginVertical: height * 0.02,
  },
  subtitle: {
    fontSize: height * 0.02,
    textAlign: 'center',
    color: '#888',
  },
  section: {
    marginVertical: height * 0.02,
  },
  sectionTitle: {
    fontSize: height * 0.025,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  listItem: {
    marginVertical: height * 0.005,
  },
  listText: {
    fontSize: height * 0.02,
  },
  planContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planCard: {
    width: width * 0.28,
    alignItems: 'center',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.02,
    backgroundColor: '#F5F5F5',
    borderRadius: width * 0.02,
  },
  planTitle: {
    fontSize: height * 0.02,
    fontWeight: 'bold',
    color: '#7BB56D',
  },
  planPrice: {
    fontSize: height * 0.025,
    marginVertical: height * 0.01,
  },
  planDiscount: {
    fontSize: height * 0.02,
    textDecorationLine: 'line-through',
    color: '#999',
  },
  planOriginalPrice: {
    fontSize: height * 0.03,
    fontWeight: 'bold',
  },
  bookButton: {
    marginTop: height * 0.02,
    backgroundColor: '#4A90E2',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    borderRadius: width * 0.02,
  },
  bookButtonText: {
    fontSize: height * 0.02,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PregnancyCareScreen;
