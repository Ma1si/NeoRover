import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AddScreen from './screen_app/add_screen';
import ChatScreen from './screen_app/chat_screen';
import HomeScreen from './screen_app/home_screen';
import ProfileScreen from './screen_app/profile_screen';
import ChatRoomScreen from './screen_app/ChatRoomScreen'; 

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ChatStack = () => (
  <Stack.Navigator 
      screenOptions={{ 
      headerShown: false,
      tabBarStyle: { display: 'none' }, // ✅ Скрываем tabBar В ДАННОМ Stack
      cardStyle: { backgroundColor: '#000000', },

      
    }}>
    <Stack.Screen name="ChatTab" component={ChatScreen} />
    <Stack.Screen 
      name="ChatRoom" 
      component={ChatRoomScreen}

    />
  </Stack.Navigator>
);

export default function AppNavigator() {
  return (
<Tab.Navigator 
  screenOptions={{
    tabBarStyle: {
      backgroundColor: '#252525', 
      borderRadius: 40, 
      width: '90%',
      borderTopWidth: 0, 
      position: 'absolute',
      bottom: 20,
      marginHorizontal: 20,  // Только отступы по горизонтали
      height: 70,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      alignItems: 'center',  // ← Центрирует содержимое по горизонтали
    },
    tabBarItemStyle: {     // ← КЛЮЧЕВОЕ: стиль для КАЖДОЙ вкладки
      flex: 1,
  // ← Вертикальное центрирование
      alignItems: 'center',      // ← Горизонтальное центрирование
    },
    tabBarActiveTintColor: '#fff',
    tabBarInactiveTintColor: '#888',
    tabBarLabelStyle: {
      fontSize: 15,
      marginTop: 7
    },
    headerShown: false, 
    cardStyle: { backgroundColor: '#000' },

  }}
>


      
      <Tab.Screen name="Chat" component={ChatStack}   
        options={{
          
          tabBarIcon: ({ focused, size }) => (

        <Image
          source={require('./assets/chat.png')}
          style={{ 
            marginTop: 20,
            width: size, 
            height: size, 
            tintColor: focused ? '#ffffff' : '#888' 
          }}
        />

          ),
      }}/>
      <Tab.Screen name="Home" component={HomeScreen} 
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Image
              source={require('./assets/menu.png')}
              style={{ marginTop: 20, width: size, height: size, tintColor: focused ? '#ffffff' : '#8E8E93' }}
            />
          ),
      }}/>
      <Tab.Screen name="Profile" component={ProfileScreen} 
      options={{
          tabBarIcon: ({ focused, size }) => (
            <Image
              source={require('./assets/mymenu.png')}
              style={{ marginTop: 20, width: size, height: size, tintColor: focused ? '#ffffff' : '#8E8E93' }}
            />
          ),
      }}
      />
      <Tab.Screen name="Add" component={AddScreen} 
      options={{
          tabBarIcon: ({ focused, size }) => (
            <Image
              source={require('./assets/plus.png')}
              style={{marginTop: 20, width: size, height: size, tintColor: focused ? '#ffffff' : '#8E8E93' }}
            />
          ),
      }}/>
    </Tab.Navigator>
  
  );
}

