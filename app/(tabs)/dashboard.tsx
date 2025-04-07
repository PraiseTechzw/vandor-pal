import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const colorScheme = useColorScheme() ?? 'light';

  const metrics = [
    { title: 'Today\'s Revenue', value: '$1,234', icon: 'attach-money' as const, color: '#4CAF50', trend: '+12%' },
    { title: 'Total Orders', value: '45', icon: 'shopping-cart' as const, color: '#2196F3', trend: '+5%' },
    { title: 'Low Stock Items', value: '8', icon: 'inventory' as const, color: '#FF9800', trend: 'Alert' },
    { title: 'Customer Satisfaction', value: '94%', icon: 'star' as const, color: '#FFC107', trend: '+2%' },
  ];

  const recentActivity = [
    { id: '1', type: 'order' as const, description: 'New order from John Doe', time: '2 mins ago', amount: '$45.00' },
    { id: '2', type: 'stock' as const, description: 'Low stock alert: Product A', time: '15 mins ago', amount: '5 left' },
    { id: '3', type: 'payment' as const, description: 'Payment received', time: '1 hour ago', amount: '$120.00' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <LinearGradient
        colors={[Colors[colorScheme].tint, Colors[colorScheme].background]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.welcomeText, { color: '#fff' }]}>Welcome back!</Text>
          <Text style={[styles.dateText, { color: '#fff' }]}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.metricsContainer}>
        {metrics.map((metric, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.metricCard, { backgroundColor: Colors[colorScheme].card }]}
            activeOpacity={0.8}
          >
            <View style={styles.metricHeader}>
              <MaterialIcons name={metric.icon} size={24} color={metric.color} />
              <Text style={[styles.trendText, { color: metric.trend === 'Alert' ? '#FF5722' : '#4CAF50' }]}>
                {metric.trend}
              </Text>
            </View>
            <Text style={[styles.metricValue, { color: Colors[colorScheme].text }]}>
              {metric.value}
            </Text>
            <Text style={[styles.metricLabel, { color: Colors[colorScheme].text }]}>
              {metric.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.section, { backgroundColor: Colors[colorScheme].card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
            Recent Activity
          </Text>
          <TouchableOpacity>
            <Text style={[styles.viewAllText, { color: Colors[colorScheme].tint }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        
        {recentActivity.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <MaterialIcons 
                name={activity.type === 'order' ? 'shopping-cart' : activity.type === 'stock' ? 'inventory' : 'payment'} 
                size={20} 
                color={Colors[colorScheme].tint} 
              />
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityDescription, { color: Colors[colorScheme].text }]}>
                {activity.description}
              </Text>
              <Text style={[styles.activityTime, { color: Colors[colorScheme].tabIconDefault }]}>
                {activity.time}
              </Text>
            </View>
            <Text style={[styles.activityAmount, { color: Colors[colorScheme].text }]}>
              {activity.amount}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.quickActions, { backgroundColor: Colors[colorScheme].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
          Quick Actions
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="add" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>New Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="inventory" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Add Stock</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="receipt" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Reports</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 16,
    marginTop: 4,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
    marginTop: -30,
  },
  metricCard: {
    width: (width - 48) / 2,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.7,
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(47, 149, 220, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    marginTop: 2,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '500',
  },
  quickActions: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    backgroundColor: Colors.light.tint,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: (width - 80) / 3,
  },
  actionButtonText: {
    color: '#fff',
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
}); 