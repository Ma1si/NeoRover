import axios from 'axios';

import React from 'react';
import { useState } from 'react';
import { 
  StyleSheet, Text, View, Button, Modal, TextInput,
  TouchableOpacity
} from 'react-native';


const RegModalWindow = ({ visible, onClose, onSuccess}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const HandleRegister = async () => {
      if (!firstName || !lastName || !email || !password || !password2) {
        console.log('Заполните все поля')
        return;
      }
      if (password != password2) {
        console.log('Пароли не совпадают')
        return;
      }
      try {
        const res = await axios.post('http://172.20.10.7:8000/users', {
            firstName,
            lastName,
            email ,
            password
          });

            
        const data =  res.data;
        console.log(data);
        onSuccess()
        
      }catch (e) {
        console.log('Ошибка сети')
      }
    }
  
    return (
        <Modal
            animationType="fade" // или "fade", "none"
            backdropColor={'rgba(255, 0, 0, 0.5)'} // Делает фон прозрачным
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >    
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.xexit} onPress={onClose}>
                <Text>✖️</Text>
              </TouchableOpacity>
              <Text style={styles.modalText}>IosProgect</Text>
                <View style={styles.modalView}>
                  
                    <TextInput 
                      placeholderTextColor="#999999"
                      placeholder='Введите имя' 
                      style={styles.input}
                      value={firstName}
                      onChangeText={setFirstName}
                    />

                    <TextInput 
                      placeholderTextColor="#999999"
                      placeholder='Введите фамилию' 
                      style={styles.input}
                      value={lastName}
                      onChangeText={setLastName}
                      />


                    <TextInput
                      placeholderTextColor="#999999" 
                      placeholder='Введите email' 
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      />

                    <TextInput 
                      placeholderTextColor="#999999" 
                      placeholder='Придумайте пароль' 
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      />

                    <TextInput 
                      placeholderTextColor="#999999" 
                      placeholder='Повторите пароль' 
                      style={styles.input}
                      value={password2}
                      onChangeText={setPassword2}
                      secureTextEntry
                      />


                    <TouchableOpacity 
                      onPress={HandleRegister}
                      style={styles.outlinebtn}>
                      <Text style={{color: '#ffff'}} >Зарегестрироваться</Text>
                    </TouchableOpacity>
                    
                </View> 
            </View>        
        </Modal>
    );
};

const styles = StyleSheet.create({

  

  modalView: {
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },

  modalContent: {   
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',


    backgroundColor: 'white',
    
    // Рамки
    borderWidth: 2,                   // Толщина рамки
    borderColor: '#747474ff',           // Цвет рамки
    borderRadius: 16,                 // Скругленные углы
    
  },
  input :{
    margin: 3,
    height: 40,
    width: 250,

    borderWidth: 1,
    borderColor: '#a2a2a2ff',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  
  xexit:{
    position: 'absolute',
    top: 45,
    right: 25
  },
  outlinebtn: {
    borderWidth: 2,
    borderColor: '#000000ff',
    backgroundColor: '#373737ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    margin: 5
  }

});

export default RegModalWindow;