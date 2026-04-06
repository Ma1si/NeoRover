import { Children, createContext, useEffect, useState } from 'react';
import { 
  StyleSheet, Text, View, Button, Modal, TextInput, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';



const LogModalWindow = ({ visible, onClose, onSuccess}) => {

   
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [loading, setLoading] = useState(false)

   
      const HandleLogin = async () => {
        if (!email || !password) {
          alert('заполните все поля')
          return;
        };

        setLoading(true)
        try {
          const response = await axios.post('http://192.168.0.197:8000/users_log', {email, password});
          const {user_id} = response.data;
          const {token} = response.data

          if (token) {
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('user_id', user_id.toString())
          }

          const imageUri = 'http://192.168.0.197:8000/profile_image_get?id='+ user_id +'';
          await AsyncStorage.setItem('profileImageUri', imageUri)

          const userinf = await axios.get(`http://192.168.0.197:8000/profile_inf?id=${user_id}`);

          const {lname} = userinf.data
          const {fname} = userinf.data


          await AsyncStorage.setItem('lname', lname)
          await AsyncStorage.setItem('fname', fname)
          console.log(lname, fname)

          onSuccess(user_id, imageUri, lname, fname)
          
        }catch(error){
          console.log("error")
        }finally {
          setLoading(false)
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
                            <TextInput onChangeText={setEmail} placeholderTextColor="#999999" placeholder='Введите email' style={styles.input}></TextInput>
                            <TextInput onChangeText={setPassword} placeholderTextColor="#999999" placeholder='Введите пароль' style={styles.input}></TextInput>

                            <TouchableOpacity style={styles.outlinebtn} onPress={HandleLogin}>
                              <Text style={{color: '#ffff'}} >Войти</Text>
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

export default LogModalWindow;