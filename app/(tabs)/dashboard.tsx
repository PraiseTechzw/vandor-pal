import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Dashboard
        </Text>
      </View>

      <View style={styles.metricsContainer}>
        <View style={[styles.metricCard, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
          <MaterialIcons name="attach-money" size={24} color="#4CAF50" />
          <Text style={[styles.metricValue, { color: Colors[colorScheme ?? 'light'].text }]}>
            $12,345
          </Text>
          <Text style={[styles.metricLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
            Today's Revenue
          </Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
          <MaterialIcons name="shopping-cart" size={24} color="#2196F3" />
          <Text style={[styles.metricValue, { color: Colors[colorScheme ?? 'light'].text }]}>
            45
          </Text>
          <Text style={[styles.metricLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
            Total Sales
          </Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
          <MaterialIcons name="inventory" size={24} color="#FF9800" />
          <Text style={[styles.metricValue, { color: Colors[colorScheme ?? 'light'].text }]}>
            156
          </Text>
          <Text style={[styles.metricLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
            Low Stock Items
          </Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Recent Activity
        </Text>
        {/* Add recent activity list here */}
      </View>
    </ScrollView>
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
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  metricCard: {
    flex: 1,
    minWidth: 150,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
}); 