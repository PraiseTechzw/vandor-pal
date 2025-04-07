import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, useColorScheme, Alert } from 'react-native';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useCurrency } from '@/contexts/CurrencyContext';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { currency, setCurrency, convertAmount } = useCurrency();
  const [isOnline, setIsOnline] = useState(true);
  const [currentWeather, setCurrentWeather] = useState({ temp: '28°C', condition: 'Sunny' });
  
  // Simulate checking network status
  useEffect(() => {
    const checkNetworkStatus = () => {
      // In a real app, you would use NetInfo to check actual network status
      const randomStatus = Math.random() > 0.2;
      setIsOnline(randomStatus);
    };
    
    checkNetworkStatus();
    const interval = setInterval(checkNetworkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { title: 'Today\'s Sales', value: 15400, icon: 'attach-money' as const, color: '#4CAF50', trend: '+12%' },
    { title: 'Items Sold', value: 45, icon: 'shopping-cart' as const, color: '#2196F3', trend: '+5%' },
    { title: 'Low Stock Items', value: 8, icon: 'inventory' as const, color: '#FF9800', trend: 'Alert' },
    { title: 'Cash on Hand', value: 8200, icon: 'account-balance-wallet' as const, color: '#FFC107', trend: '' },
  ];

  const recentActivity = [
    { id: '1', type: 'sale' as const, description: 'Sold 5 tomatoes', time: '2 mins ago', amount: 500 },
    { id: '2', type: 'stock' as const, description: 'Low stock: Onions', time: '15 mins ago', amount: 5 },
    { id: '3', type: 'expense' as const, description: 'Transport cost', time: '1 hour ago', amount: 200 },
  ];

  const popularItems = [
    { name: 'Tomatoes', sold: 25, inStock: 30, price: 100 },
    { name: 'Onions', sold: 18, inStock: 5, price: 80 },
    { name: 'Potatoes', sold: 15, inStock: 20, price: 120 },
  ];

  const handleAddSale = () => {
    Alert.alert('Add Sale', 'Record a new sale');
  };

  const handleUpdateStock = () => {
    Alert.alert('Update Stock', 'Update your inventory');
  };

  const handleDailyReport = () => {
    Alert.alert('Daily Report', 'View your daily sales summary');
  };

  const toggleCurrency = () => {
    setCurrency(currency === 'ZWL' ? 'USD' : 'ZWL');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <LinearGradient
        colors={[
          '#2196F3', // Primary blue
          '#1976D2', // Darker blue
          '#0D47A1'  // Deep blue
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={[styles.welcomeText, { color: '#fff' }]}>Mauya! (Welcome!)</Text>
            <Text style={[styles.dateText, { color: '#fff' }]}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>
          
          <View style={styles.headerRight}>
            <View style={styles.statusContainer}>
              <View style={[styles.statusIndicator, { backgroundColor: isOnline ? '#4CAF50' : '#F44336' }]} />
              <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.currencyButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]} 
              onPress={toggleCurrency}
            >
              <MaterialIcons 
                name={currency === 'ZWL' ? 'attach-money' : 'monetization-on'} 
                size={16} 
                color="#fff" 
              />
              <Text style={styles.currencyText}>{currency}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.weatherContainer}>
          <Feather name="sun" size={20} color="#fff" />
          <Text style={styles.weatherText}>{currentWeather.temp} • {currentWeather.condition}</Text>
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
              {metric.trend && (
                <Text style={[styles.trendText, { color: metric.trend === 'Alert' ? '#FF5722' : '#4CAF50' }]}>
                  {metric.trend}
                </Text>
              )}
            </View>
            <Text style={[styles.metricValue, { color: Colors[colorScheme].text }]}>
              {metric.title.includes('Sales') || metric.title.includes('Cash') 
                ? convertAmount(metric.value)
                : metric.value}
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
            <View style={[styles.activityIcon, { 
              backgroundColor: activity.type === 'sale' 
                ? 'rgba(76, 175, 80, 0.1)' 
                : activity.type === 'stock' 
                  ? 'rgba(255, 152, 0, 0.1)' 
                  : 'rgba(244, 67, 54, 0.1)' 
            }]}>
              <MaterialIcons 
                name={activity.type === 'sale' ? 'shopping-cart' : activity.type === 'stock' ? 'inventory' : 'money-off'} 
                size={20} 
                color={activity.type === 'sale' 
                  ? '#4CAF50' 
                  : activity.type === 'stock' 
                    ? '#FF9800' 
                    : '#F44336'} 
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
              {activity.type === 'stock' 
                ? `${activity.amount} left`
                : convertAmount(activity.amount)}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.section, { backgroundColor: Colors[colorScheme].card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
            Popular Items
          </Text>
          <TouchableOpacity>
            <Text style={[styles.viewAllText, { color: Colors[colorScheme].tint }]}>
              Manage
            </Text>
          </TouchableOpacity>
        </View>
        
        {popularItems.map((item, index) => (
          <View key={index} style={styles.popularItem}>
            <View style={styles.popularItemInfo}>
              <Text style={[styles.popularItemName, { color: Colors[colorScheme].text }]}>
                {item.name}
              </Text>
              <Text style={[styles.popularItemPrice, { color: Colors[colorScheme].text }]}>
                {convertAmount(item.price)}
              </Text>
            </View>
            <View style={styles.popularItemStats}>
              <View style={styles.popularItemStat}>
                <Ionicons name="cart-outline" size={16} color={Colors[colorScheme].tabIconDefault} />
                <Text style={[styles.popularItemStatText, { color: Colors[colorScheme].tabIconDefault }]}>
                  {item.sold} sold
                </Text>
              </View>
              <View style={styles.popularItemStat}>
                <Ionicons name="cube-outline" size={16} color={Colors[colorScheme].tabIconDefault} />
                <Text style={[
                  styles.popularItemStatText, 
                  { color: item.inStock <= 5 ? '#F44336' : Colors[colorScheme].tabIconDefault }
                ]}>
                  {item.inStock} left
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.quickActions, { backgroundColor: Colors[colorScheme].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
          Quick Actions
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleAddSale}>
            <MaterialIcons name="add-shopping-cart" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Add Sale</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleUpdateStock}>
            <MaterialIcons name="inventory" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Update Stock</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDailyReport}>
            <MaterialIcons name="assessment" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Daily Report</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: Colors[colorScheme].card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
            Daily Expenses
          </Text>
          <TouchableOpacity>
            <Text style={[styles.viewAllText, { color: Colors[colorScheme].tint }]}>
              Add New
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.expenseItem}>
          <View style={styles.expenseIcon}>
            <MaterialIcons name="directions-bus" size={20} color="#F44336" />
          </View>
          <View style={styles.expenseContent}>
            <Text style={[styles.expenseDescription, { color: Colors[colorScheme].text }]}>
              Transport
            </Text>
            <Text style={[styles.expenseTime, { color: Colors[colorScheme].tabIconDefault }]}>
              Today
            </Text>
          </View>
          <Text style={[styles.expenseAmount, { color: '#F44336' }]}>
            -{convertAmount(200)}
          </Text>
        </View>
        
        <View style={styles.expenseItem}>
          <View style={styles.expenseIcon}>
            <MaterialIcons name="shopping-bag" size={20} color="#F44336" />
          </View>
          <View style={styles.expenseContent}>
            <Text style={[styles.expenseDescription, { color: Colors[colorScheme].text }]}>
              Wholesale Purchase
            </Text>
            <Text style={[styles.expenseTime, { color: Colors[colorScheme].tabIconDefault }]}>
              Today
            </Text>
          </View>
          <Text style={[styles.expenseAmount, { color: '#F44336' }]}>
            -{convertAmount(5000)}
          </Text>
        </View>
        
        <View style={styles.expenseSummary}>
          <Text style={[styles.expenseSummaryText, { color: Colors[colorScheme].text }]}>
            Total Expenses Today:
          </Text>
          <Text style={[styles.expenseSummaryAmount, { color: '#F44336' }]}>
            {convertAmount(5200)}
          </Text>
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  currencyText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    opacity: 0.9,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  weatherText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 6,
    fontWeight: '500',
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
  popularItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  popularItemInfo: {
    flex: 1,
  },
  popularItemName: {
    fontSize: 14,
    fontWeight: '500',
  },
  popularItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  popularItemStats: {
    flexDirection: 'row',
    gap: 12,
  },
  popularItemStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  popularItemStatText: {
    fontSize: 12,
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
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  expenseIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseContent: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 14,
    fontWeight: '500',
  },
  expenseTime: {
    fontSize: 12,
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: '500',
  },
  expenseSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  expenseSummaryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  expenseSummaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
