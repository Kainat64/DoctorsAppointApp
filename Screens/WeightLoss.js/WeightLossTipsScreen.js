import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const WeightLossTipsScreen = () => {
     const navigation = useNavigation();
  // AI-powered weight loss tips
  const tips = [
    {
      id: 1,
      title: "Hydration Intelligence",
      content: "Our AI analysis shows drinking 500ml water 30 mins before meals can reduce calorie intake by 13%. Your optimal water intake: 2.5L/day based on your profile.",
      icon: "💧"
    },
    {
      id: 2,
      title: "Metabolic Meal Timing",
      content: "AI pattern recognition reveals eating 80% of your calories before 3pm boosts fat burning by 20%. Try our smart meal planner!",
      icon: "⏱️"
    },
    {
      id: 3,
      title: "Personalized Protein",
      content: "Your ideal protein intake is 1.6g/kg body weight. Our AI detected this maximizes fat loss while preserving muscle.",
      icon: "🍗"
    },
    {
      id: 4,
      title: "Sleep Optimization",
      content: "AI sleep analysis shows each 30min increase in deep sleep burns extra 50 calories. Aim for 7.5 hours with our sleep tracker.",
      icon: "😴"
    },
    {
      id: 5,
      title: "Smart Carb Cycling",
      content: "Our algorithm recommends 3 low-carb days (50g) followed by 1 high-carb day (200g) for optimal fat loss based on your activity.",
      icon: "🍠"
    },
    {
      id: 6,
      title: "Micro-Workout AI",
      content: "3-minute intense bursts every hour burns 30% more fat than one long workout. We'll send you personalized micro-workouts.",
      icon: "⚡"
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Weight Loss Coach</Text>
        <Text style={styles.headerSubtitle}>Personalized tips powered by artificial intelligence</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.tipsContainer}>
        {tips.map((tip) => (
          <View key={tip.id} style={styles.tipCard}>
            <View style={styles.tipIconContainer}>
              <Text style={styles.tipIcon}>{tip.icon}</Text>
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipText}>{tip.content}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      
      <TouchableOpacity style={styles.actionButton}
      onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.actionButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#274A8A',
    padding: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  tipsContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    shadowColor: '#274A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tipIconContainer: {
    backgroundColor: '#E8F0FE',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tipIcon: {
    fontSize: 24,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    color: '#274A8A',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tipText: {
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#274A8A',
    padding: 18,
    borderRadius: 12,
    margin: 20,
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    alignItems: 'center',
    shadowColor: '#274A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonText: {
    bottom: 10,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WeightLossTipsScreen;