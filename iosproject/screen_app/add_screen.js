import { useState } from 'react';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, Keyboard,TouchableWithoutFeedback } from 'react-native';
import { TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // добавить
import * as ImagePicker from 'expo-image-picker';

export default function AddScreen() {
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState(''); // добавить состояние для текста
    const [userId, setUserId] = useState(null);
    const [focused, setFocused] = useState(false);

    const pickMedia = async () => {
        try {
            // Исправлена опечатка
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('Требуется разрешение', 'Нужен доступ к галерее');
                return null;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            // Исправлена структура для новых версий Expo
            if (!result.canceled && result.assets?.[0]?.uri) {
                const imageUri = result.assets[0].uri;
                setImage(imageUri);
                console.log('выбрано:', imageUri);
                return imageUri;
            }
        } catch (error) {
            console.log('Ошибка выбора изображения:', error);
            return null;
        }
        return null;
    };

    const postdesc = async () => {
        try {
            if (!image) {
                Alert.alert('Ошибка', 'Сначала выберите фото');
                return;
            }

            const savedId = await AsyncStorage.getItem('user_id');
            if (!savedId) {
                Alert.alert('Ошибка', 'Пользователь не авторизован');
                return;
            }

            const formData = new FormData();
            formData.append('text', description)
            formData.append('id', savedId);
            formData.append('file', {
                uri: image,
                type: 'image/jpeg',
                name: 'profile.jpg'
            });
            // Добавить описание если нужно
            // formData.append('description', description);

            const res = await fetch('http://192.168.0.197:8081/description', {
                method: 'POST',
                body: formData,
            });

            const responseData = await res.json();
            if (res.ok) {
                Alert.alert('Успех', 'Фото сохранено');
                setImage(null);
                setDescription('');
            } else {
                Alert.alert('Ошибка', responseData.message || 'Ошибка сервера');
            }
        } catch (e) {
            console.log('Ошибка отправки:', e);
            Alert.alert('Ошибка', 'Проверьте подключение');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.viewInfak}>
                <View style={{ marginTop: 30, marginLeft: 10, marginRight: 10 }}>
                    <View style={styles.containerfotobtn}>
                        <TouchableOpacity onPress={pickMedia} style={styles.addinfbtn}>
                            <Image 
                                source={require('../assets/skrebka.png')} 
                                tintColor={'#ffff'} 
                                style={{ width: 17, height: 17, marginRight: 5 }} 
                            />
                            <Text style={{ color: '#d3d3d3' }}>Добавить фотографию</Text>
                        </TouchableOpacity>
                        {image ? (
                            <Image 
                                source={{ uri: image }} 
                                resizeMode='cover' 
                                style={{ width: 200, height: 150, borderRadius: 40, marginBottom: 10 }} 
                            />
                        ) : null}
                    </View>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                        <View style={styles.containerbtn}>
                        
                            <ScrollView 
                            style={styles.addinfbtn}  // ← стили кнопки!
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={{ flexGrow: 1 }}
                            >
                            <TextInput
                                style={[styles.descriptiontxtinput, focused && styles.focusedInput]}
                                value={description}
                                onChangeText={setDescription}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                placeholder="Введите текст"
                                placeholderTextColor="#d3d3d3"
                                multiline
                                returnKeyType="done"
                                onSubmitEditing={Keyboard.dismiss}
                                blurOnSubmit={true}
                            />
                            </ScrollView>

                        </View>

                    </TouchableWithoutFeedback>

                </View>

                <View style={styles.createbtn}>
                    <TouchableOpacity style={styles.deletebtn}>
                        <Text style={styles.buttonText}>Удалить</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.savebtn} onPress={postdesc}>
                        <Text style={styles.buttonText}>Сохранить</Text>
                    </TouchableOpacity>
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

  viewInfak: {
    marginTop: 43,
    width: '90%', 
    height: '100%',
  },
  containerbtn: {
    marginTop: 4,
    marginBottom: 4,
    height:'auto',
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#2e2e2e2c', 
    backgroundColor: '#262626',
  },
  containerfotobtn: {
    marginTop: 4,
    marginBottom: 4,
    height:'auto',
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#2e2e2e2c', 
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center'
  },
  addinfbtn: {
    margin: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  descriptiontxtinput: {
    width:'100%',
    outlineStyle: 'none', 
    height: 'auto',
    borderColor: '#8c96a100',
    borderWidth: 1,
    color: '#ffff',
    borderRadius: 8
    
  },
    focusedInput: {
    borderColor: '#007AFF'  // Собственный цвет при фокусе
  },
  savebtn: {
    backgroundColor: '#237024',  // красный
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },

deletebtn: {
  backgroundColor: '#743131',  // зелёный
  paddingVertical: 15,
  paddingHorizontal: 30,
  borderRadius: 25,
  flex: 1,
  marginRight: 10,
  alignItems: 'center',
  },
  createbtn: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
},
});