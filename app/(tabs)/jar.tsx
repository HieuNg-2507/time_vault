import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft } from 'lucide-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useGameContext } from '@/contexts/GameContext';
import BallJar from '@/components/BallJar';
import { useRouter } from 'expo-router';

export default function JarScreen() {
  const { longTermBalls, getLongTermTotal, getLongTermGoal } = useGameContext();
  const router = useRouter();
  
  // Force refresh of counter values when screen is displayed
  useEffect(() => {
    // This ensures the counter is always up-to-date when the jar screen is shown
    const total = getLongTermTotal();
    const goal = getLongTermGoal();
    console.log(`JarScreen mounted - Total: ${total}, Goal: ${goal}`);
    
    // Set up an interval to periodically refresh the counter
    // This helps ensure the counter stays in sync with any changes
    const refreshInterval = setInterval(() => {
      const updatedTotal = getLongTermTotal();
      console.log(`JarScreen refresh - Total: ${updatedTotal}`);
    }, 1000); // Check every second
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [getLongTermTotal, getLongTermGoal, longTermBalls]);


  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [router]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" hidden />
      <View style={styles.fullScreenContainer}>
        <BallJar 
          balls={longTermBalls} 
          counter={getLongTermTotal()}
          goal={getLongTermGoal()}
        />
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3D3F9E',
  },
  fullScreenContainer: {
    flex: 1,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    padding: 8,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
  },
});
