import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Image, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const CARD_SIZE = width * 0.9;
const CARD_HEIGHT = width * 0.5;

const planOptions = [
  {
    id: 1,
    title: "Health Plans",
    image: require('../../assets/health-plan.png'),
    screen: "HealthPlan",
    colors: ['#4A90E2', '#6BB7FF'],
    icon: 'medkit-outline'
  },
  {
    id: 2,
    title: "Pregnancy Plans",
    image: require('../../assets/pregnancy.png'),
    screen: "PregnancyPlan",
    colors: ['#FF6B8B', '#FF8E9E'],
    icon: 'heart-outline'
  }
];

const FamilyHealthPlans = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Family Health Plans</Text>
      </View>

      <View style={styles.content}>
        {planOptions.map((plan) => (
          <TouchableOpacity 
            key={plan.id}
            onPress={() => navigation.navigate('Coming Soon')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={plan.colors}
              style={styles.card}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                  <Ionicons name={plan.icon} size={32} color="#fff" style={styles.icon} />
                  <Text style={styles.title}>{plan.title}</Text>
                </View>
                <Image
                  source={plan.image}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_HEIGHT,
    borderRadius: 16,
    marginVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  icon: {
    marginBottom: 16,
  },
  image: {
    width: CARD_HEIGHT * 0.8,
    height: CARD_HEIGHT * 0.8,
  },
});

export default FamilyHealthPlans;