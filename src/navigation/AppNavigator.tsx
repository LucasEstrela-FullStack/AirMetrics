import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import MapScreenFallback from '../screens/MapScreenFallback';
import ForecastScreen from '../screens/ForecastScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SoilScreen from '../screens/SoilScreen';
import MapScreen from '../services/MapScreen';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Soil') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'AirMetrics' }}
      />
     
      <Tab.Screen 
        name="Soil" 
        component={SoilScreen} 
        options={{ title: 'Solo' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Perfil' }}
      />
      
    </Tab.Navigator>
  );
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Main" 
          component={TabNavigator} 
          options={{ headerShown: false }}
        />
        {/* Stack-only routes (not in bottom tabs) */}
        <Stack.Screen 
          name="Map" 
          component={MapScreenFallback} 
          options={{ title: 'Ver Mapa' }}
        />
        <Stack.Screen 
          name="Forecast" 
          component={ForecastScreen} 
          options={{ title: 'Previsão' }}
        />
        <Stack.Screen 
          name="Community" 
          component={CommunityScreen} 
          options={{ title: 'Comunidade' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
