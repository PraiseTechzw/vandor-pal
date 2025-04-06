import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

// Mock data for customers
const customers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    totalOrders: 12,
    totalSpent: 899.99,
    loyaltyPoints: 450,
    lastPurchase: '2024-04-05',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 234 567 8901',
    totalOrders: 8,
    totalSpent: 650.50,
    loyaltyPoints: 325,
    lastPurchase: '2024-04-06',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+1 234 567 8902',
    totalOrders: 15,
    totalSpent: 1200.75,
    loyaltyPoints: 600,
    lastPurchase: '2024-04-04',
  },
];

export default function CustomersScreen() {
  const colorScheme = useColorScheme();

  const renderCustomer = ({ item }) => (
    <View style={[styles.customerCard, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
      <View style={styles.customerHeader}>
        <View>
          <Text style={[styles.customerName, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.name}
          </Text>
          <Text style={[styles.customerContact, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.email}
          </Text>
          <Text style={[styles.customerContact, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.phone}
          </Text>
        </View>
        <View style={styles.loyaltyBadge}>
          <MaterialIcons name="star" size={20} color="#FFD700" />
          <Text style={styles.loyaltyPoints}>{item.loyaltyPoints}</Text>
        </View>
      </View>

      <View style={styles.customerStats}>
        <View style={styles.statItem}>
          <MaterialIcons name="shopping-cart" size={20} color="#2196F3" />
          <Text style={[styles.statValue, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.totalOrders}
          </Text>
          <Text style={[styles.statLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
            Orders
          </Text>
        </View>
        <View style={styles.statItem}>
          <MaterialIcons name="attach-money" size={20} color="#4CAF50" />
          <Text style={[styles.statValue, { color: Colors[colorScheme ?? 'light'].text }]}>
            ${item.totalSpent}
          </Text>
          <Text style={[styles.statLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
            Spent
          </Text>
        </View>
        <View style={styles.statItem}>
          <MaterialIcons name="event" size={20} color="#FF9800" />
          <Text style={[styles.statValue, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.lastPurchase}
          </Text>
          <Text style={[styles.statLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
            Last Purchase
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#2196F3' }]}>
          <Text style={styles.actionButtonText}>View History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}>
          <Text style={styles.actionButtonText}>Send Offer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Customers
        </Text>
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="person-add" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={customers}
        renderItem={renderCustomer}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
  },
  customerCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  customerContact: {
    fontSize: 14,
    opacity: 0.7,
  },
  loyaltyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  loyaltyPoints: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  customerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 