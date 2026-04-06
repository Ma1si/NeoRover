import { useEffect, useState } from 'react';
import { 
  StyleSheet, Text, View,Image, TouchableOpacity, 
} from 'react-native';

import RegModalWindow from './registration/RegModalWindow';
import LogModalWindow from './login/LogModalWindow';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageProvider, useImageContext } from './ImageContext';
import AppNavigator from './AppNavigator';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  const [regModalVisible, setRegModalVisible] = useState(false);
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  useEffect(() => {
    checkAuthStatus();
  }, []);
 

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        console.log('✅ Токен найден, пользователь авторизован');
        setIsAuthenticated(true);
      } else {
        console.log('❌ Токен не найден');
      }
    } catch (error) {
      console.log('Ошибка проверки токена:', error);
    } finally {
      setIsLoading(false); // ✅ Загрузка завершена
    }
  };


  
  
  return (


    /*Окно до авторизации*/
    <ImageProvider>
    
    <View style={{flex: 1, backgroundColor: '#252525d9'}}>
      
      {!isAuthenticated && (
        
        <>
      <View style={{flex:1,  justifyContent: 'center', alignItems: 'center'}}>
        <Image source={require('./assets/naezd.png')} style={{marginTop: 250,width: 350, height: 350}} />


      </View>
      <View style={{flex: 1,                    // занимает весь доступный экран
                    justifyContent: 'center',   // центрирует по вертикали
                    alignItems: 'center',       // центрирует по горизонтали
                    padding: 20,
                     }}>
      {/*кнопка регистрации*/}
      
      <TouchableOpacity
        style={styles.outlineButton}
        onPress={() => {setRegModalVisible(true); setLogModalVisible(false)}}>
        <Text style={styles.btnsyle}>Зарегестрироваться</Text>
      </TouchableOpacity>

      {/*кновка входа*/}
      <TouchableOpacity 
        style={styles.outlineButton}
        onPress={() => {setLogModalVisible(true); setRegModalVisible(false)}}>
        <Text style={styles.btnsyle}>Войти</Text>
      </TouchableOpacity>
      </View>
      
      </>

        

      )}


      {/*Окно после авторизации */}
      {isAuthenticated && (
        <NavigationContainer>
        
          <AppNavigator/>

        </NavigationContainer>
      )}


      <RegModalWindow
        visible={regModalVisible}
        onClose={() => setRegModalVisible(false)}
        onSuccess={() => {setIsAuthenticated(true); setRegModalVisible(false)}}/>

      <LogModalWindow
        visible={logModalVisible}
        onClose={() => setLogModalVisible(false)}
        onSuccess={() => {setIsAuthenticated(true); setLogModalVisible(false)}}/>
    
    </View>
    </ImageProvider>
    );
  }

const styles = StyleSheet.create({



//Стили для окна до авторизации

  container: {
    flex: 1,                    // занимает весь доступный экран
    justifyContent: 'center',   // центрирует по вертикали
    alignItems: 'center',       // центрирует по горизонтали
    padding: 20,
    gap: 15                     // расстояние между кнопками (RN 0.63+)
  },
  
  outlineButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.2)', 
    paddingHorizontal: 3,
    paddingVertical: 13,
    borderWidth: 1,
    borderRadius: 23,
    margin: 3
                 
  },
  btnsyle: {
    fontSize: 16,
    textAlign: 'center',
    marginLeft: 6,
    marginRight: 6,
    minWidth: 260,
    maxHeight: 19,
    color: '#1f1e1e'
  }
,

//Стили окна после авторизации

authenticatedContainer: {
  flex: 1,
  backgroundColor: '#2f2f2f',
},

  buttonRow: {
    flexDirection: 'row',  // Располагает кнопки горизонтально
  // или 'center', 'space-around'
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '90%',  // или нужная ширина
    borderWidth: 4,
    borderRadius: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.17)',
    borderColor: 'rgba(255, 255, 255, 0.2)',  //
    height: 77
  },

});
