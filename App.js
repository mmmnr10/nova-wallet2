import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import colors from './src/theme/colors';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import MarketScreen from './src/screens/MarketScreen';
import WorldTimeScreen from './src/screens/WorldTimeScreen';
import SendMoneyScreen from './src/screens/SendMoneyScreen';
import ScanScreen from './src/screens/ScanScreen';
import TodoScreen from './src/screens/TodoScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [hasBiometrics, setHasBiometrics] = useState(false);

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    // Om användaren besöker appen via Vercel (webbläsare) så hoppar vi över FaceID.
    if (Platform.OS === 'web') {
      setIsAuthenticated(true);
      return;
    }

    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setHasBiometrics(compatible && enrolled);
    
    // Automatically try to authenticate on boot
    if (compatible && enrolled) {
      handleBiometricAuth();
    } else {
      // If emulator or no biometrics, just let them in for testing
      setIsAuthenticated(true);
    }
  };

  const handleBiometricAuth = async () => {
    setIsAuthenticating(true);
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Lås upp Nova Wallet',
      fallbackLabel: 'Använd PIN',
      cancelLabel: 'Avbryt',
      disableDeviceFallback: false,
    });
    
    if (result.success) {
      setIsAuthenticated(true);
    }
    setIsAuthenticating(false);
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.authContainer}>
        <StatusBar style="light" />
        <View style={styles.iconWrapper}>
          <Ionicons name="lock-closed" size={64} color={colors.primary} />
        </View>
        <Text style={styles.authTitle}>Nova Wallet</Text>
        <Text style={styles.authSub}>Din digitala plånbok är låst</Text>
        
        {isAuthenticating ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 30 }} />
        ) : (
          <TouchableOpacity style={styles.authBtn} onPress={handleBiometricAuth}>
            <Ionicons name="finger-print" size={24} color={colors.background} style={{ marginRight: 10 }} />
            <Text style={styles.authBtnText}>Lås upp</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerStyle: {
              backgroundColor: colors.background,
              shadowColor: 'transparent',
              elevation: 0,
            },
            headerTintColor: colors.primary,
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            },
            tabBarStyle: {
              backgroundColor: colors.card,
              borderTopWidth: 0,
              elevation: 0,
              height: 60,
              paddingBottom: 10,
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Hem') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Marknad') {
                iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              } else if (route.name === 'Världstid') {
                iconName = focused ? 'globe' : 'globe-outline';
              } else if (route.name === 'Skanna') {
                iconName = focused ? 'scan' : 'scan-outline';
              } else if (route.name === 'Att göra') {
                iconName = focused ? 'list' : 'list-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Hem" component={HomeScreen} />
          <Tab.Screen name="Marknad" component={MarketScreen} />
          <Tab.Screen name="Att göra" component={TodoScreen} />
          <Tab.Screen name="Världstid" component={WorldTimeScreen} />
          <Tab.Screen name="Skanna" component={ScanScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  authTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  authSub: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 40,
  },
  authBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  authBtnText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  }
});
