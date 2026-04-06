import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';





export default function ProfileScreen({handleLogout}) {
  const [profileimage, setProfileImage] = useState(null)
  const [profilelname, setProfileLname] = useState(null)
  const [profilefname, setProfileFname] = useState(null)
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false);

  const handleLogoutLocal = async () => {
    Alert.alert(
      'Выход из аккаунта', 
      'Все данные будут удалены. Продолжить?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              
              // ✅ Полная очистка данных
              await AsyncStorage.clear();
              
              // ✅ Навигация на экран входа
              navigation.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }] // Замените на ваш экран логина
              });
              
            } catch (error) {
              console.log('Ошибка выхода:', error);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleImageLocal = () => handleLogout()


const pickaddImage = async() => {
  const premission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!premission.granted){
      Alert.alert('Permission required', 'Photo library access is needed');
      return null;      
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });
  
  if (!result.canceled && result.assets?.[0]?.uri) {
    const imageUri = result.assets[0].uri;
    setProfileImage(imageUri);
    console.log('выбрано:', imageUri);
    return imageUri;
  }
  return null;
};

  useEffect(() =>{
    loadProfileData();
  }, []);

  const loadProfileData = async() => {
    try{
      setLoading(true)
      const savedUri = await AsyncStorage.getItem('profileImageUri');
      const savedId = await AsyncStorage.getItem('user_id')
      const savedLname = await AsyncStorage.getItem('lname')
      const savedFname = await AsyncStorage.getItem('fname')

      if (savedId) setUserId(savedId);
      if (savedUri) setProfileImage(savedUri);
      if (savedLname) setProfileLname(savedLname);
      if (savedFname) setProfileFname(savedFname);
    }catch(error){
      console.log('ошибка')
    }finally{
      setLoading(false)
    }
  }

      const HandleProfileImage = async(imageUri) => {
    if (!imageUri){
      console.log("Изображение не выбрано")
    }
    console.log('hello')
    setUploading(true)
    try {
      const formData = new FormData();
      formData.append('id', userId)
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg'
      })
      const res = await fetch('http://192.168.0.197:8000/profile_image', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type' : 'multipart/form-data'
        }
      });
      if (!res.ok) alert('ошибка')

      await AsyncStorage.setItem('profileImageUri', imageUri)
    }catch (e) {
      console.log('Ошибка')
    }finally{
      setUploading(false)
    }
  }
    const handleImagePress = async () => {
    const image = await pickaddImage();
    if (image) {
      await HandleProfileImage(image);
    }
  };
 
  return (
    <View style={styles.container}>
      <View style={styles.viewInfak}>
        <View style={{marginTop: 30, marginLeft: 10, marginRight: 10}}>
          <View style={{alignItems: 'center', marginBottom: 10 }}>
            <View style={styles.viewRadiusImage}>

                {loading ? (
                  <ActivityIndicator size={'large'} color='#0000ff'/>
                ) : profileimage ? (
                  <Image source={{uri : profileimage}} style={{width: 140, height: 140, borderRadius: 70}} resizeMode='cover'/>
                ):(
                  <View>
                    <Text>Нету изображения</Text>
                  </View>
                )}

            </View>
            <View style={styles.textlable}>
              <Text style={styles.text}>{profilelname} {profilefname}</Text>    
            </View>
          </View>
          <View>
            <TouchableOpacity style={styles.intrfacebtn} onPress={handleImagePress}>
              <Image source={require('../assets/fotoaparat.png')} tintColor={'#ffff'} style={{width: 20, height: 20, margin: 7}}></Image>
              <Text style={{margin: 10, color: '#ffff'}}>Добавить фотографию</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.intrfacebtn}>
              <Image source={require('../assets/posts.png')} tintColor={'#ffff'} style={{width: 20, height: 20, margin: 7}}></Image>
              <Text style={{margin: 10, color: '#ffff'}}>Мои посты</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.intrfacebtn}>
              <Image source={require('../assets/basket.png')} tintColor={'#ffff'} style={{width: 20, height: 20, margin: 7}}></Image>
              <Text style={{margin: 10, color: '#ffff'}}>Корзина</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.intrfacebtn} onPress={handleLogoutLocal}>
              <Image source={require('../assets/setting.png')} tintColor={'#ffff'} style={{width: 20, height: 20, margin: 7}}></Image>
              <Text style={{margin: 10, color: '#ffff'}}>Настройки</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2f2f2f',
  },
  title: {
    fontSize: 28,
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
  },
  btnImage : {

        width: 100, 
        height: 100, 
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4a4a4a'
  },
  btnExit:{
        position: 'absolute',
        right: 1,
        width: 30,
        height: 30,
        borderRadius: 15,

        justifyContent: 'center',
        alignItems: 'center'
  },
  viewInfak: {
    marginTop: 43,
    width: '90%', 
    height: '100%',
  },
  viewRadiusImage: {
    borderWidth: 3,
    width: 150, 
    height: 150,
    borderRadius: 100,
    borderColor: '#b9b9b97f',
    backgroundColor: '#4a4a4a',
    position: 'relative', // Добавляем для абсолютного позиционирования
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textlable: {
    justifyContent: 'center',
    borderWidth: 3,
    width: "auto", 
    height: 40,
    borderRadius: 40,
    borderColor: '#47474741',
    backgroundColor: '#262626',
  },
  text :{
    color: '#c0c0c0',
    margin: 10
  },
  intrfacebtn: {
    flexDirection: 'row',
    borderWidth: 3,
    borderRadius: 50,
    borderColor: '#2e2e2e2c', 
    backgroundColor: '#262626',
    height: 42,
    justifyContent: 'center',
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5
  }
});
