import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, Share, Platform } from 'react-native';
import { useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState, useRef } from 'react';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { format, subDays, subWeeks, subMonths, subYears } from 'date-fns';

const { width } = Dimensions.get('window');

type Timeframe = 'day' | 'week' | 'month' | 'year';
type ReportType = 'sales' | 'inventory' | 'customers' | 'profit';

const mockData = {
  revenue: {
    day: [120, 150, 200, 180, 220, 250, 300],
    week: [1500, 1800, 2200, 2000, 2400, 2800, 3000],
    month: [8000, 9000, 10000, 9500, 11000, 12000, 13000],
    year: [120000, 130000, 140000, 150000, 160000, 170000, 180000],
  },
  customers: {
    day: [10, 15, 20, 18, 22, 25, 30],
    week: [100, 120, 150, 140, 160, 180, 200],
    month: [500, 600, 700, 650, 750, 800, 900],
    year: [6000, 6500, 7000, 7500, 8000, 8500, 9000],
  },
  profit: {
    day: [30, 40, 50, 45, 55, 65, 75],
    week: [400, 500, 600, 550, 650, 750, 800],
    month: [2000, 2500, 3000, 2800, 3200, 3500, 3800],
    year: [30000, 35000, 40000, 45000, 50000, 55000, 60000],
  },
  topProducts: [
    { name: 'Tomatoes', sales: 1200, revenue: 1800 },
    { name: 'Onions', sales: 950, revenue: 1425 },
    { name: 'Potatoes', sales: 800, revenue: 1200 },
    { name: 'Cabbage', sales: 650, revenue: 975 },
    { name: 'Carrots', sales: 550, revenue: 825 },
  ],
  categoryDistribution: [
    { name: 'Vegetables', value: 60 },
    { name: 'Fruits', value: 25 },
    { name: 'Grains', value: 10 },
    { name: 'Others', value: 5 },
  ],
};

export default function AnalyticsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('week');
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('sales');
  const [isExporting, setIsExporting] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const timeframes: Timeframe[] = ['day', 'week', 'month', 'year'];
  const reportTypes: ReportType[] = ['sales', 'inventory', 'customers', 'profit'];

  const getTimeframeLabel = (timeframe: Timeframe) => {
    switch (timeframe) {
      case 'day':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'year':
        return 'This Year';
    }
  };

  const getDateLabels = (timeframe: Timeframe) => {
    const today = new Date();
    const labels = [];
    
    switch (timeframe) {
      case 'day':
        for (let i = 0; i < 7; i++) {
          labels.push(format(subDays(today, 6 - i), 'HH:mm'));
        }
        break;
      case 'week':
        for (let i = 0; i < 7; i++) {
          labels.push(format(subDays(today, 6 - i), 'EEE'));
        }
        break;
      case 'month':
        for (let i = 0; i < 7; i++) {
          labels.push(format(subWeeks(today, 6 - i), 'MMM d'));
        }
        break;
      case 'year':
        for (let i = 0; i < 7; i++) {
          labels.push(format(subMonths(today, 6 - i), 'MMM'));
        }
        break;
    }
    
    return labels;
  };

  const kpis = [
    {
      title: 'Total Revenue',
      value: `$${mockData.revenue[selectedTimeframe][mockData.revenue[selectedTimeframe].length - 1].toLocaleString()}`,
      change: '+12%',
      icon: 'attach-money' as const,
      color: '#4CAF50',
    },
    {
      title: 'Total Customers',
      value: mockData.customers[selectedTimeframe][mockData.customers[selectedTimeframe].length - 1].toLocaleString(),
      change: '+8%',
      icon: 'people' as const,
      color: '#2196F3',
    },
    {
      title: 'Average Order Value',
      value: '$45.99',
      change: '+5%',
      icon: 'shopping-cart' as const,
      color: '#FF9800',
    },
    {
      title: 'Total Profit',
      value: `$${mockData.profit[selectedTimeframe][mockData.profit[selectedTimeframe].length - 1].toLocaleString()}`,
      change: '+15%',
      icon: 'trending-up' as const,
      color: '#9C27B0',
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: Colors[colorScheme].card,
    backgroundGradientTo: Colors[colorScheme].card,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  const pieChartConfig = {
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const handleExportPDF = async (reportType: ReportType) => {
    try {
      setIsExporting(true);
      
      // Create HTML content for the PDF
      const html = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <style>
              body { font-family: 'Helvetica'; padding: 20px; }
              h1 { color: #2196F3; }
              h2 { color: #4CAF50; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
              th { background-color: #f2f2f2; }
              .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
              .logo { font-size: 24px; font-weight: bold; color: #2196F3; }
              .date { color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">VendorPal</div>
              <div class="date">${format(new Date(), 'MMMM d, yyyy')}</div>
            </div>
            <h1>${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h1>
            <h2>Summary</h2>
            <table>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Change</th>
              </tr>
              <tr>
                <td>Total Revenue</td>
                <td>$${mockData.revenue[selectedTimeframe][mockData.revenue[selectedTimeframe].length - 1].toLocaleString()}</td>
                <td>+12%</td>
              </tr>
              <tr>
                <td>Total Customers</td>
                <td>${mockData.customers[selectedTimeframe][mockData.customers[selectedTimeframe].length - 1].toLocaleString()}</td>
                <td>+8%</td>
              </tr>
              <tr>
                <td>Total Profit</td>
                <td>$${mockData.profit[selectedTimeframe][mockData.profit[selectedTimeframe].length - 1].toLocaleString()}</td>
                <td>+15%</td>
              </tr>
            </table>
            
            <h2>Top Products</h2>
            <table>
              <tr>
                <th>Product</th>
                <th>Sales</th>
                <th>Revenue</th>
              </tr>
              ${mockData.topProducts.map(product => `
                <tr>
                  <td>${product.name}</td>
                  <td>${product.sales}</td>
                  <td>$${product.revenue}</td>
                </tr>
              `).join('')}
            </table>
            
            <h2>Category Distribution</h2>
            <table>
              <tr>
                <th>Category</th>
                <th>Percentage</th>
              </tr>
              ${mockData.categoryDistribution.map(category => `
                <tr>
                  <td>${category.name}</td>
                  <td>${category.value}%</td>
                </tr>
              `).join('')}
            </table>
          </body>
        </html>
      `;
      
      // Generate PDF
      const { uri } = await Print.printToFileAsync({ html });
      
      // Share the PDF
      if (Platform.OS === 'ios') {
        await Sharing.shareAsync(uri, { UTI: '.pdf' });
      } else {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
      }
      
      setIsExporting(false);
      Alert.alert('Success', 'Report exported successfully!');
    } catch (error) {
      setIsExporting(false);
      Alert.alert('Error', 'Failed to export report. Please try again.');
      console.error(error);
    }
  };

  const handleShareReport = async () => {
    try {
      const message = `VendorPal Analytics Report - ${getTimeframeLabel(selectedTimeframe)}\n\n` +
        `Total Revenue: $${mockData.revenue[selectedTimeframe][mockData.revenue[selectedTimeframe].length - 1].toLocaleString()}\n` +
        `Total Customers: ${mockData.customers[selectedTimeframe][mockData.customers[selectedTimeframe].length - 1].toLocaleString()}\n` +
        `Total Profit: $${mockData.profit[selectedTimeframe][mockData.profit[selectedTimeframe].length - 1].toLocaleString()}\n\n` +
        `Top Product: ${mockData.topProducts[0].name} (${mockData.topProducts[0].sales} sales)\n` +
        `Generated on ${format(new Date(), 'MMMM d, yyyy')}`;
      
      await Share.share({
        message,
        title: 'VendorPal Analytics Report',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share report. Please try again.');
      console.error(error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <LinearGradient
        colors={[Colors[colorScheme].tint, Colors[colorScheme].background]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: '#fff' }]}>Analytics</Text>
          <Text style={[styles.subtitle, { color: '#fff' }]}>
            {getTimeframeLabel(selectedTimeframe)}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerActionButton}
            onPress={handleShareReport}
          >
            <MaterialIcons name="share" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerActionButton}
            onPress={() => handleExportPDF(selectedReportType)}
            disabled={isExporting}
          >
            <MaterialIcons name="picture-as-pdf" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.timeframeContainer}
        >
          {timeframes.map(timeframe => (
            <TouchableOpacity
              key={timeframe}
              style={[
                styles.timeframeButton,
                {
                  backgroundColor: selectedTimeframe === timeframe
                    ? Colors[colorScheme].tint
                    : Colors[colorScheme].card
                }
              ]}
              onPress={() => setSelectedTimeframe(timeframe)}
            >
              <Text
                style={[
                  styles.timeframeText,
                  { color: selectedTimeframe === timeframe ? '#fff' : Colors[colorScheme].text }
                ]}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.kpiContainer}>
          {kpis.map((kpi, index) => (
            <View
              key={index}
              style={[styles.kpiCard, { backgroundColor: Colors[colorScheme].card }]}
            >
              <View style={styles.kpiHeader}>
                <MaterialIcons name={kpi.icon} size={24} color={kpi.color} />
                <Text style={[styles.kpiChange, { color: kpi.change.startsWith('+') ? '#4CAF50' : '#FF5722' }]}>
                  {kpi.change}
                </Text>
              </View>
              <Text style={[styles.kpiValue, { color: Colors[colorScheme].text }]}>
                {kpi.value}
              </Text>
              <Text style={[styles.kpiTitle, { color: Colors[colorScheme].tabIconDefault }]}>
                {kpi.title}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.reportTypeContainer}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
            Report Type
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.reportTypeScroll}
          >
            {reportTypes.map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.reportTypeButton,
                  {
                    backgroundColor: selectedReportType === type
                      ? Colors[colorScheme].tint
                      : Colors[colorScheme].card
                  }
                ]}
                onPress={() => setSelectedReportType(type)}
              >
                <MaterialIcons 
                  name={
                    type === 'sales' ? 'attach-money' :
                    type === 'inventory' ? 'inventory' :
                    type === 'customers' ? 'people' :
                    'trending-up'
                  } 
                  size={20} 
                  color={selectedReportType === type ? '#fff' : Colors[colorScheme].text} 
                />
                <Text
                  style={[
                    styles.reportTypeText,
                    { color: selectedReportType === type ? '#fff' : Colors[colorScheme].text }
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.chartContainer, { backgroundColor: Colors[colorScheme].card }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: Colors[colorScheme].text }]}>
              Revenue Trend
            </Text>
            <TouchableOpacity>
              <MaterialIcons name="more-vert" size={24} color={Colors[colorScheme].tabIconDefault} />
            </TouchableOpacity>
          </View>
          <LineChart
            data={{
              labels: getDateLabels(selectedTimeframe),
              datasets: [
                {
                  data: mockData.revenue[selectedTimeframe],
                },
              ],
            }}
            width={width - 64}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={[styles.chartContainer, { backgroundColor: Colors[colorScheme].card }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: Colors[colorScheme].text }]}>
              Customer Growth
            </Text>
            <TouchableOpacity>
              <MaterialIcons name="more-vert" size={24} color={Colors[colorScheme].tabIconDefault} />
            </TouchableOpacity>
          </View>
          <BarChart
            data={{
              labels: getDateLabels(selectedTimeframe),
              datasets: [
                {
                  data: mockData.customers[selectedTimeframe],
                },
              ],
            }}
            width={width - 64}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
          />
        </View>

        <View style={[styles.chartContainer, { backgroundColor: Colors[colorScheme].card }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: Colors[colorScheme].text }]}>
              Profit Analysis
            </Text>
            <TouchableOpacity>
              <MaterialIcons name="more-vert" size={24} color={Colors[colorScheme].tabIconDefault} />
            </TouchableOpacity>
          </View>
          <LineChart
            data={{
              labels: getDateLabels(selectedTimeframe),
              datasets: [
                {
                  data: mockData.profit[selectedTimeframe],
                  color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`,
                },
              ],
            }}
            width={width - 64}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={[styles.chartContainer, { backgroundColor: Colors[colorScheme].card }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: Colors[colorScheme].text }]}>
              Category Distribution
            </Text>
            <TouchableOpacity>
              <MaterialIcons name="more-vert" size={24} color={Colors[colorScheme].tabIconDefault} />
            </TouchableOpacity>
          </View>
          <View style={styles.pieChartContainer}>
            <PieChart
              data={mockData.categoryDistribution.map((item, index) => ({
                name: item.name,
                population: item.value,
                color: [
                  '#4CAF50',
                  '#2196F3',
                  '#FF9800',
                  '#9C27B0',
                ][index % 4],
                legendFontColor: Colors[colorScheme].text,
                legendFontSize: 12,
              }))}
              width={width - 64}
              height={220}
              chartConfig={pieChartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </View>

        <View style={[styles.tableContainer, { backgroundColor: Colors[colorScheme].card }]}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableTitle, { color: Colors[colorScheme].text }]}>
              Top Products
            </Text>
            <TouchableOpacity>
              <MaterialIcons name="more-vert" size={24} color={Colors[colorScheme].tabIconDefault} />
            </TouchableOpacity>
          </View>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeaderRow]}>
              <Text style={[styles.tableHeaderText, { color: Colors[colorScheme].tabIconDefault }]}>Product</Text>
              <Text style={[styles.tableHeaderText, { color: Colors[colorScheme].tabIconDefault }]}>Sales</Text>
              <Text style={[styles.tableHeaderText, { color: Colors[colorScheme].tabIconDefault }]}>Revenue</Text>
            </View>
            {mockData.topProducts.map((product, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { color: Colors[colorScheme].text }]}>{product.name}</Text>
                <Text style={[styles.tableCell, { color: Colors[colorScheme].text }]}>{product.sales}</Text>
                <Text style={[styles.tableCell, { color: Colors[colorScheme].text }]}>${product.revenue}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.exportContainer}>
          <TouchableOpacity
            style={[styles.exportButton, { backgroundColor: Colors[colorScheme].tint }]}
            onPress={() => handleExportPDF(selectedReportType)}
            disabled={isExporting}
          >
            <MaterialIcons name="picture-as-pdf" size={20} color="#fff" />
            <Text style={styles.exportButtonText}>
              {isExporting ? 'Exporting...' : 'Export as PDF'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    marginTop: 20,
  },
  headerActions: {
    flexDirection: 'row',
    marginTop: 20,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  timeframeContainer: {
    paddingHorizontal: 16,
    marginTop: -30,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  kpiCard: {
    width: (width - 48) / 2,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiChange: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  kpiTitle: {
    fontSize: 14,
    marginTop: 4,
  },
  reportTypeContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  reportTypeScroll: {
    marginBottom: 8,
  },
  reportTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  reportTypeText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  chartContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  pieChartContainer: {
    alignItems: 'center',
  },
  tableContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  table: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  tableHeaderRow: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
  },
  exportContainer: {
    padding: 16,
    alignItems: 'center',
  },
  exportButton: {
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
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 