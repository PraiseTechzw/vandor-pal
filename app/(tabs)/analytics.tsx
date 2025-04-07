import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, Share, Platform, Modal } from 'react-native';
import { useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState, useRef } from 'react';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { WebView } from 'react-native-webview';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { format, subDays, subWeeks, subMonths, subYears } from 'date-fns';

const { width } = Dimensions.get('window');

type Timeframe = 'day' | 'week' | 'month' | 'year';
type ReportType = 'sales' | 'inventory' | 'customers' | 'profit';
type TabType = 'overview' | 'revenue' | 'customers' | 'products' | 'profit';

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
  const [selectedTab, setSelectedTab] = useState<TabType>('overview');
  const [isExporting, setIsExporting] = useState(false);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const timeframes: Timeframe[] = ['day', 'week', 'month', 'year'];
  const reportTypes: ReportType[] = ['sales', 'inventory', 'customers', 'profit'];
  const tabs: TabType[] = ['overview', 'revenue', 'customers', 'products', 'profit'];

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
      
      // Save the PDF URI for viewing
      setPdfUri(uri);
      
      // Show the PDF viewer modal
      setIsPdfModalVisible(true);
      
      setIsExporting(false);
    } catch (error) {
      setIsExporting(false);
      Alert.alert('Error', 'Failed to generate report. Please try again.');
      console.error(error);
    }
  };

  const handleShareReport = async () => {
    try {
      if (!pdfUri) {
        Alert.alert('Error', 'No report available to share. Please generate a report first.');
        return;
      }
      
      // Share the PDF
      if (Platform.OS === 'ios') {
        await Sharing.shareAsync(pdfUri, { UTI: '.pdf' });
      } else {
        await Sharing.shareAsync(pdfUri, { mimeType: 'application/pdf' });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share report. Please try again.');
      console.error(error);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      if (!pdfUri) {
        Alert.alert('Error', 'No report available to download. Please generate a report first.');
        return;
      }
      
      // Create a downloads directory if it doesn't exist
      const downloadDir = `${FileSystem.documentDirectory}downloads/`;
      const dirInfo = await FileSystem.getInfoAsync(downloadDir);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });
      }
      
      // Generate a filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `VendorPal_Report_${timestamp}.pdf`;
      const destination = `${downloadDir}${filename}`;
      
      // Copy the PDF to the downloads directory
      await FileSystem.copyAsync({
        from: pdfUri,
        to: destination
      });
      
      Alert.alert('Success', `Report downloaded to: ${destination}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to download report. Please try again.');
      console.error(error);
    }
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <>
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
                yAxisLabel="$"
                yAxisSuffix=""
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
                yAxisLabel=""
                yAxisSuffix=""
              />
            </View>
          </>
        );
        
      case 'revenue':
        return (
          <>
            <View style={[styles.summaryCard, { backgroundColor: Colors[colorScheme].card }]}>
              <Text style={[styles.summaryTitle, { color: Colors[colorScheme].text }]}>
                Revenue Summary
              </Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: Colors[colorScheme].tabIconDefault }]}>
                    Total Revenue
                  </Text>
                  <Text style={[styles.summaryValue, { color: Colors[colorScheme].text }]}>
                    ${mockData.revenue[selectedTimeframe][mockData.revenue[selectedTimeframe].length - 1].toLocaleString()}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: Colors[colorScheme].tabIconDefault }]}>
                    Growth
                  </Text>
                  <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                    +12%
                  </Text>
                </View>
              </View>
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
                yAxisLabel="$"
                yAxisSuffix=""
              />
            </View>
            
            <View style={[styles.chartContainer, { backgroundColor: Colors[colorScheme].card }]}>
              <View style={styles.chartHeader}>
                <Text style={[styles.chartTitle, { color: Colors[colorScheme].text }]}>
                  Revenue by Category
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
          </>
        );
        
      case 'customers':
        return (
          <>
            <View style={[styles.summaryCard, { backgroundColor: Colors[colorScheme].card }]}>
              <Text style={[styles.summaryTitle, { color: Colors[colorScheme].text }]}>
                Customer Summary
              </Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: Colors[colorScheme].tabIconDefault }]}>
                    Total Customers
                  </Text>
                  <Text style={[styles.summaryValue, { color: Colors[colorScheme].text }]}>
                    {mockData.customers[selectedTimeframe][mockData.customers[selectedTimeframe].length - 1].toLocaleString()}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: Colors[colorScheme].tabIconDefault }]}>
                    Growth
                  </Text>
                  <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                    +8%
                  </Text>
                </View>
              </View>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: Colors[colorScheme].tabIconDefault }]}>
                    Average Order Value
                  </Text>
                  <Text style={[styles.summaryValue, { color: Colors[colorScheme].text }]}>
                    $45.99
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: Colors[colorScheme].tabIconDefault }]}>
                    Customer Retention
                  </Text>
                  <Text style={[styles.summaryValue, { color: Colors[colorScheme].text }]}>
                    78%
                  </Text>
                </View>
              </View>
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
                yAxisLabel=""
                yAxisSuffix=""
              />
            </View>
          </>
        );
        
      case 'products':
        return (
          <>
            <View style={[styles.summaryCard, { backgroundColor: Colors[colorScheme].card }]}>
              <Text style={[styles.summaryTitle, { color: Colors[colorScheme].text }]}>
                Product Performance
              </Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: Colors[colorScheme].tabIconDefault }]}>
                    Top Product
                  </Text>
                  <Text style={[styles.summaryValue, { color: Colors[colorScheme].text }]}>
                    {mockData.topProducts[0].name}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: Colors[colorScheme].tabIconDefault }]}>
                    Total Products
                  </Text>
                  <Text style={[styles.summaryValue, { color: Colors[colorScheme].text }]}>
                    24
                  </Text>
                </View>
              </View>
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
          </>
        );
        
      case 'profit':
        return (
          <>
            <View style={[styles.summaryCard, { backgroundColor: Colors[colorScheme].card }]}>
              <Text style={[styles.summaryTitle, { color: Colors[colorScheme].text }]}>
                Profit Summary
              </Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: Colors[colorScheme].tabIconDefault }]}>
                    Total Profit
                  </Text>
                  <Text style={[styles.summaryValue, { color: Colors[colorScheme].text }]}>
                    ${mockData.profit[selectedTimeframe][mockData.profit[selectedTimeframe].length - 1].toLocaleString()}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: Colors[colorScheme].tabIconDefault }]}>
                    Growth
                  </Text>
                  <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                    +15%
                  </Text>
                </View>
              </View>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: Colors[colorScheme].tabIconDefault }]}>
                    Profit Margin
                  </Text>
                  <Text style={[styles.summaryValue, { color: Colors[colorScheme].text }]}>
                    32%
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: Colors[colorScheme].tabIconDefault }]}>
                    ROI
                  </Text>
                  <Text style={[styles.summaryValue, { color: Colors[colorScheme].text }]}>
                    2.4x
                  </Text>
                </View>
              </View>
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
                yAxisLabel="$"
                yAxisSuffix=""
              />
            </View>
            
            <View style={[styles.chartContainer, { backgroundColor: Colors[colorScheme].card }]}>
              <View style={styles.chartHeader}>
                <Text style={[styles.chartTitle, { color: Colors[colorScheme].text }]}>
                  Profit vs Revenue
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
                      color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                    },
                    {
                      data: mockData.profit[selectedTimeframe],
                      color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`,
                    },
                  ],
                  legend: ['Revenue', 'Profit'],
                }}
                width={width - 64}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                yAxisLabel="$"
                yAxisSuffix=""
              />
            </View>
          </>
        );
        
      default:
        return null;
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                {
                  backgroundColor: selectedTab === tab
                    ? Colors[colorScheme].tint
                    : Colors[colorScheme].card
                }
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <MaterialIcons 
                name={
                  tab === 'overview' ? 'dashboard' :
                  tab === 'revenue' ? 'attach-money' :
                  tab === 'customers' ? 'people' :
                  tab === 'products' ? 'inventory' :
                  'trending-up'
                } 
                size={20} 
                color={selectedTab === tab ? '#fff' : Colors[colorScheme].text} 
              />
              <Text
                style={[
                  styles.tabText,
                  { color: selectedTab === tab ? '#fff' : Colors[colorScheme].text }
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {renderTabContent()}

        <View style={styles.exportContainer}>
          <TouchableOpacity
            style={[styles.exportButton, { backgroundColor: Colors[colorScheme].tint }]}
            onPress={() => handleExportPDF(selectedReportType)}
            disabled={isExporting}
          >
            <MaterialIcons name="picture-as-pdf" size={20} color="#fff" />
            <Text style={styles.exportButtonText}>
              {isExporting ? 'Generating...' : 'Generate Report'}
            </Text>
          </TouchableOpacity>
          
          {pdfUri && (
            <TouchableOpacity
              style={[styles.exportButton, { backgroundColor: '#4CAF50', marginTop: 12 }]}
              onPress={handleDownloadPDF}
            >
              <MaterialIcons name="file-download" size={20} color="#fff" />
              <Text style={styles.exportButtonText}>
                Download Report
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={isPdfModalVisible}
        animationType="slide"
        onRequestClose={() => setIsPdfModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Report Preview</Text>
            <TouchableOpacity onPress={() => setIsPdfModalVisible(false)}>
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          {pdfUri && (
            <WebView
              source={{ uri: pdfUri }}
              style={styles.webview}
            />
          )}
          
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#4CAF50' }]}
              onPress={handleDownloadPDF}
            >
              <MaterialIcons name="file-download" size={20} color="#fff" />
              <Text style={styles.modalButtonText}>Download</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#2196F3' }]}
              onPress={handleShareReport}
            >
              <MaterialIcons name="share" size={20} color="#fff" />
              <Text style={styles.modalButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  tabsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
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
  summaryCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 