import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: Colors[colorScheme ?? 'light'].text }]}>
              Vendor Name
            </Text>
            <Text style={[styles.profileEmail, { color: Colors[colorScheme ?? 'light'].text }]}>
              vendor@example.com
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Business Information
        </Text>
        <View style={styles.infoItem}>
          <MaterialIcons name="store" size={24} color="#2196F3" />
          <View style={styles.infoText}>
            <Text style={[styles.infoLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
              Business Name
            </Text>
            <Text style={[styles.infoValue, { color: Colors[colorScheme ?? 'light'].text }]}>
              My Business
            </Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons name="location-on" size={24} color="#2196F3" />
          <View style={styles.infoText}>
            <Text style={[styles.infoLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
              Address
            </Text>
            <Text style={[styles.infoValue, { color: Colors[colorScheme ?? 'light'].text }]}>
              123 Business St, City
            </Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons name="phone" size={24} color="#2196F3" />
          <View style={styles.infoText}>
            <Text style={[styles.infoLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
              Contact
            </Text>
            <Text style={[styles.infoValue, { color: Colors[colorScheme ?? 'light'].text }]}>
              +1 234 567 8900
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Settings
        </Text>
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="notifications" size={24} color="#2196F3" />
          <Text style={[styles.settingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Notifications
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="security" size={24} color="#2196F3" />
          <Text style={[styles.settingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Security
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="help" size={24} color="#2196F3" />
          <Text style={[styles.settingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Help & Support
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: '#FF5252' }]}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 16,
    opacity: 0.7,
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
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 16,
    marginTop: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 