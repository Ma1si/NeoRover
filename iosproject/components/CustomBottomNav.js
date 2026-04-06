import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function CustomBottomNav({ 
  currentScreen, 
  onScreenChange, 
  onLogout 
}) {
  const tabs = [
    { name: 'Chat', icon: require('../assets/chat.png'), label: 'Сообщения' },
    { name: 'Home', icon: require('../assets/menu.png'), label: 'Главная' },
    { name: 'Profile', icon: require('../assets/mymenu.png'), label: 'Профиль' },
    { name: 'Add', icon: require('../assets/add_create.png'), label: 'Добавить'}
  ];

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={[
              styles.tabButton,
              currentScreen === tab.name && styles.activeTab
            ]}
            onPress={() => onScreenChange(tab.name)}
          >
            <Image 
              source={tab.icon} 
              style={styles.tabIcon}
              tintColor="#ffffff"
            />
            <Text style={[
              styles.tabLabel, 
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '90%',
    borderWidth: 4,
    borderRadius: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.17)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 78,
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    
  },
  activeTab: {
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 50,
    height: 63,
    margin : 3

  },
  tabIcon: {
    width: 33, 
    height: 33, 
    marginTop: -3,
    
  },
  tabLabel: {
    color: '#d1d1d1',
    fontSize: 10,
  },
  activeLabel: {
    color: '#fff',
    fontSize: 20,
    

  },
});
