"use client"

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function OrdersScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Scale animation
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.back(1.5)),
      useNativeDriver: true,
    }).start();

    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const float = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const handleNotifyMe = () => {
    // In a real app, this would subscribe the user to notifications
    alert('You will be notified when the Orders feature is available!');
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <LinearGradient
        colors={['#4CAF50', '#388E3C', '#1B5E20']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Orders</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.illustrationContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: float },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.illustration,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          >
            <MaterialIcons name="shopping-cart" size={120} color="#4CAF50" />
          </Animated.View>
          <View style={styles.illustrationDetails}>
            <MaterialIcons name="local-shipping" size={40} color="#4CAF50" />
            <MaterialIcons name="inventory" size={40} color="#4CAF50" />
            <MaterialIcons name="payment" size={40} color="#4CAF50" />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: Animated.multiply(float, 0.5) }],
            },
          ]}
        >
          <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
            Coming Soon!
          </Text>
          <Text style={[styles.subtitle, { color: Colors[colorScheme].tabIconDefault }]}>
            We're working on something exciting
          </Text>
          <Text style={[styles.description, { color: Colors[colorScheme].text }]}>
            The Orders feature will allow you to manage customer orders, track deliveries, and process payments all in one place.
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.featuresContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: Animated.multiply(float, 0.3) }],
            },
          ]}
        >
          <View style={[styles.featureItem, { backgroundColor: Colors[colorScheme].card }]}>
            <MaterialIcons name="shopping-cart" size={24} color="#4CAF50" />
            <Text style={[styles.featureText, { color: Colors[colorScheme].text }]}>
              Order Management
            </Text>
          </View>
          <View style={[styles.featureItem, { backgroundColor: Colors[colorScheme].card }]}>
            <MaterialIcons name="local-shipping" size={24} color="#4CAF50" />
            <Text style={[styles.featureText, { color: Colors[colorScheme].text }]}>
              Delivery Tracking
            </Text>
          </View>
          <View style={[styles.featureItem, { backgroundColor: Colors[colorScheme].card }]}>
            <MaterialIcons name="payment" size={24} color="#4CAF50" />
            <Text style={[styles.featureText, { color: Colors[colorScheme].text }]}>
              Payment Processing
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: Animated.multiply(float, 0.2) }],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.notifyButton, { backgroundColor: Colors[colorScheme].tint }]}
            onPress={handleNotifyMe}
          >
            <MaterialIcons name="notifications" size={20} color="#fff" />
            <Text style={styles.notifyButtonText}>Notify Me</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    width: width * 0.8,
    height: width * 0.8,
  },
  illustration: {
    width: width * 0.6,
    height: width * 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: width * 0.3,
  },
  illustrationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  notifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 