import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Shield, Bell, Smartphone, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';
import { useGameState } from '@/hooks/useGameState';

export default function SettingsScreen() {
  const { gameState, resetDailySpins } = useGameState();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Blocking</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Shield size={20} color="white" />
                <Text style={styles.settingText}>Blocked Apps</Text>
              </View>
              <Text style={styles.settingValue}>
                {gameState.blockedApps.length} apps
              </Text>
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Smartphone size={20} color="white" />
                <Text style={styles.settingText}>Block Intensity</Text>
              </View>
              <Text style={styles.settingValue}>High</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Bell size={20} color="white" />
                <Text style={styles.settingText}>Daily Reminders</Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: '#767577', true: '#FFD700' }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Bell size={20} color="white" />
                <Text style={styles.settingText}>Achievement Alerts</Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: '#767577', true: '#FFD700' }}
                thumbColor="#fff"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Game Settings</Text>
            <TouchableOpacity style={styles.settingItem} onPress={resetDailySpins}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingText}>Reset Daily Spins</Text>
              </View>
              <Text style={styles.settingValue}>Reset</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <HelpCircle size={20} color="white" />
                <Text style={styles.settingText}>Help & Support</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <LogOut size={20} color="white" />
                <Text style={styles.settingText}>About</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3D3F9E',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    opacity: 0.9,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 10,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
  },
  settingValue: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
});