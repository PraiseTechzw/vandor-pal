import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function AnalyticsScreen() {
  const colorScheme = useColorScheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Analytics
        </Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
          <MaterialIcons name="trending-up" size={24} color="#4CAF50" />
          <Text style={[styles.summaryValue, { color: Colors[colorScheme ?? 'light'].text }]}>
            $12,345
          </Text>
          <Text style={[styles.summaryLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
            Total Revenue
          </Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
          <MaterialIcons name="account-balance" size={24} color="#2196F3" />
          <Text style={[styles.summaryValue, { color: Colors[colorScheme ?? 'light'].text }]}>
            $8,234
          </Text>
          <Text style={[styles.summaryLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
            Net Profit
          </Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Sales Trends
        </Text>
        <View style={styles.chartPlaceholder}>
          <Text style={[styles.chartText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Sales Chart Placeholder
          </Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Top Products
        </Text>
        <View style={styles.productList}>
          <View style={styles.productItem}>
            <Text style={[styles.productName, { color: Colors[colorScheme ?? 'light'].text }]}>
              Product A
            </Text>
            <Text style={[styles.productValue, { color: Colors[colorScheme ?? 'light'].text }]}>
              $3,456
            </Text>
          </View>
          <View style={styles.productItem}>
            <Text style={[styles.productName, { color: Colors[colorScheme ?? 'light'].text }]}>
              Product B
            </Text>
            <Text style={[styles.productValue, { color: Colors[colorScheme ?? 'light'].text }]}>
              $2,789
            </Text>
          </View>
          <View style={styles.productItem}>
            <Text style={[styles.productName, { color: Colors[colorScheme ?? 'light'].text }]}>
              Product C
            </Text>
            <Text style={[styles.productValue, { color: Colors[colorScheme ?? 'light'].text }]}>
              $1,234
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Performance Metrics
        </Text>
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
              Average Order Value
            </Text>
            <Text style={[styles.metricValue, { color: Colors[colorScheme ?? 'light'].text }]}>
              $89.99
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
              Conversion Rate
            </Text>
            <Text style={[styles.metricValue, { color: Colors[colorScheme ?? 'light'].text }]}>
              3.2%
            </Text>
          </View>
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
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  summaryLabel: {
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
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  chartText: {
    fontSize: 16,
  },
  productList: {
    gap: 12,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  productName: {
    fontSize: 16,
  },
  productValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricsContainer: {
    gap: 16,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 16,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 