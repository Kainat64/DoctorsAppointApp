import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getHealthCarePlans } from "../../utils/Api";

const { width } = Dimensions.get('window');

const PLAN_TYPES = [
  { name: "Basic", key: "plan_a" },
  { name: "Standard", key: "plan_b" },
  { name: "Premium", key: "plan_c" }
];

const HealthPlan = ({ navigation }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getHealthCarePlans();
        setPlans(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, []);

  const renderPlanBox = (plan, type) => (
    <View key={`${type.name}-${plan.id}`} style={styles.planBox}>
      <Text style={styles.planName}>{type.name}</Text>
      <Text style={styles.planDuration}>3 Months</Text>
      <Text style={styles.planPrice}>$ {plan[type.key]}</Text>
      <Text style={styles.planOldPrice}>$1300</Text>
      <TouchableOpacity 
        style={styles.bookNowButton}
        onPress={() => handlePlanSelection(plan, type.name)}
      >
        <Text style={styles.bookNowText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );

  const handlePlanSelection = (plan, planType) => {
    navigation.navigate('PlanDetails', { 
      planData: plan,
      planType 
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => setLoading(true)}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Family Plan')} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#007BFF" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Family Health Plan</Text>
        </View>

        {/* Main Plan Card */}
        <View style={styles.planCard}>
          <Image 
            source={require('../../assets/health-plan.png')} 
            style={styles.planImage} 
          />
          <View style={styles.planTextContainer}>
            <Text style={styles.planTitle}>Family Care Plan</Text>
            <Text style={styles.planSubtitle}>Affordable, accessible healthcare</Text>
          </View>
        </View>

        {/* Benefits Section */}
        <PlanSection 
          title="Advantages Of Subscribe Plan"
          items={[
            "Online Consultations with GP",
            "Online Consultations with Pediatrician",
            "Online Consultations with Gynecologists",
            "Online Consultations with Nutritionist"
          ]}
        />

        {/* Pregnancy Plans */}
        <Text style={styles.sectionTitle}>Pregnancy's Care Plans</Text>
        <View style={styles.plansContainer}>
          {plans.length > 0 && PLAN_TYPES.map(type => renderPlanBox(plans[0], type))}
        </View>

        {/* Why Book Section */}
        <PlanSection 
          title="Why you need to book the plan?"
          items={[
            "Get unlimited online video consultations with top specialist doctors, anywhere, anytime!",
            "Connect with a doctor within a few minutes and get yourself checked in the comfort of your home",
            "Doctors are available from 10:00 AM till 10:00 PM, 6 Days a week"
          ]}
        />
      </View>
    </ScrollView>
  );
};

// Reusable component for benefits sections
const PlanSection = ({ title, items }) => (
  <>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.benefitsList}>
      {items.map((item, index) => (
        <View key={index} style={styles.benefitItem}>
          <FontAwesome name="circle" size={8} color="#4CAF50" style={styles.bulletIcon} />
          <Text style={styles.benefitText}>{item}</Text>
        </View>
      ))}
    </View>
  </>
);

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 5,
  },
  retryText: {
    color: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 20,
    color: '#4A90E2',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // Balance the back button width
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    color: '#007BFF',
    fontSize: 16,
    marginLeft: 8,
  },
  planCard: {
    backgroundColor: '#E0F7FA',
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  planImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 16,
  },
  planTextContainer: {
    flex: 1,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 16,
  },
  benefitsList: {
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletIcon: {
    marginTop: 5,
    marginRight: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  plansContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  planBox: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    width: (width - 48) / 3,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  planName: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planDuration: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  planOldPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginBottom: 12,
  },
  bookNowButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  bookNowText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default HealthPlan;