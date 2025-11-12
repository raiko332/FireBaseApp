import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Home = ({ navigation }: RouterProps) => {
  const user = FIREBASE_AUTH.currentUser;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => FIREBASE_AUTH.signOut(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <Text style={styles.welcomeText}>Welcome Back!</Text>
        <Text style={styles.emailText}>{user?.email}</Text>
      </View>

      {/* Content Card */}
      <View style={styles.contentCard}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('detail')}
          activeOpacity={0.7}
        >
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>📄</Text>
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>View Details</Text>
            <Text style={styles.actionSubtitle}>See more information</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonMargin]}
          onPress={() => Alert.alert('Info', 'This is a demo profile button')}
          activeOpacity={0.7}
        >
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>👤</Text>
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Profile</Text>
            <Text style={styles.actionSubtitle}>Manage your account</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonMargin]}
          onPress={() => Alert.alert('Info', 'This is a demo settings button')}
          activeOpacity={0.7}
        >
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>⚙️</Text>
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Settings</Text>
            <Text style={styles.actionSubtitle}>App preferences</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    padding: 20,
  },
  headerCard: {
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 14,
    color: '#E8F4FF',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  actionButtonMargin: {
    marginTop: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  arrow: {
    fontSize: 28,
    color: '#BDC3C7',
    fontWeight: '300',
  },
  logoutButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#E74C3C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});