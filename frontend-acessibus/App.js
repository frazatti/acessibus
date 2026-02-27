import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, AuthContext } from './src/context/AuthContext';

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/Home";
import SignUpScreen from './src/screens/SignUp';
import RecentsScreen from './src/screens/Recents';
import FavoritesScreen from './src/screens/Favorites';
import UserScreen from './src/screens/User';
import UpdateScreen from './src/screens/UpdateUser';

const Stack = createNativeStackNavigator();

function Routes() {
  const { signed, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const initialRouteName = "Home";

    return (
      <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='LoginScreen' component={LoginScreen} />
        <Stack.Screen name='SignUp' component={SignUpScreen} />
        <Stack.Screen name='Recents' component={RecentsScreen} />
        <Stack.Screen name='Favorites' component={FavoritesScreen} />
        <Stack.Screen name='User' component={UserScreen} />
        <Stack.Screen name='Update' component={UpdateScreen} />
      </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  )
}