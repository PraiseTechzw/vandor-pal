import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

// Mock data for sales transactions
const salesData = [
  { id: '1', date: '2024-04-06', amount: 129.99, items: 3, status: 'completed' },
  { id: '2', date: '2024-04-05', amount: 89.99, items: 2, status: 'completed' },
  { id: '3', date: '2024-04-05', amount: 199.99, items: 5, status: 'completed' },
  { id: '4', date: '2024-04-04', amount: 49.99, items: 1, status: 'completed' },
];

export default function SalesScreen() {
  const colorScheme = useColorScheme();

  const renderTransaction = ({ item }) => (
    <View style={[styles.transactionCard, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
      <View style={styles.transactionHeader}>
        <Text style={[styles.transactionDate, { color: Colors[colorScheme ?? 'light'].text }]}>
          {item.date}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.transactionDetails}>
        <View style={styles.detailItem}>
          <MaterialIcons name="attach-money" size={20} color="#4CAF50" />
          <Text style={[styles.detailText, { color: Colors[colorScheme ?? 'light'].text }]}>
            ${item.amount}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialIcons name="shopping-cart" size={20} color="#2196F3" />
          <Text style={[styles.detailText, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.items} items
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Sales
        </Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
          <Text style={[styles.summaryLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
            Today's Sales
          </Text>
          <Text style={[styles.summaryValue, { color: Colors[colorScheme ?? 'light'].text }]}>
            $459.96
          </Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
          <Text style={[styles.summaryLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
            Total Transactions
          </Text>
          <Text style={[styles.summaryValue, { color: Colors[colorScheme ?? 'light'].text }]}>
            11
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
        Recent Transactions
      </Text>

      <FlatList
        data={salesData}
        renderItem={renderTransaction}
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
  },
  listContainer: {
    padding: 16,
  },
  transactionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 16,
  },
}); 