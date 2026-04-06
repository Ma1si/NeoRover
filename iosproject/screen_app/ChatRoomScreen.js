import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native'; // ✅ ИСПРАВЛЕН ИМПОРТ
import axios from 'axios';

export default function ChatRoomScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = route.params;
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false); 
  const [refreshing, setRefreshing] = useState(false); 


  useFocusEffect(
    useCallback(() => {
      loadMessages();
    }, [])
  );
    useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) { // ✅ Не обновляем во время отправки
        loadMessages();
      }
    }, 15000); // ✅ Каждую секунду

    return () => clearInterval(interval); // ✅ Очистка при размонтировании
  }, [loading]);

const loadMessages = async () => {
  try {
    const chatId = await AsyncStorage.getItem('chat_id');
    const userId = await AsyncStorage.getItem('user_id');
    
    if (!chatId || !userId) {
      console.log('❌ Нет chatId/userId');
      setMessages([]);
      return;
    }

    console.log('📡 Загрузка чата:', chatId);
    
    const response = await axios.get(
      `http://192.168.0.197:8000/messages/${chatId}?user_id=${userId}&limit=50`
    );
    
    console.log('📡 Ответ API:', response.data);
    
    if (response.data?.messages && Array.isArray(response.data.messages)) {
      const formattedMessages = response.data.messages
        .map(msg => ({
          id: msg.id.toString(),
          message: msg.content || '',
          is_me: msg.is_me === true,  // ✅ boolean
          created_at: msg.sent_at 
            ? new Date(msg.sent_at).toLocaleTimeString('ru-RU')
            : new Date().toLocaleTimeString('ru-RU')
        }))
        .reverse();  // ✅ Новые снизу с inverted FlatList
      
      console.log('✅ Сообщения загружены:', formattedMessages.length);
      setMessages(formattedMessages);
    } else {
      console.log('📭 Пустой чат');
      setMessages([]);
    }
    
  } catch (error) {
    console.error('❌ Ошибка загрузки:', error.message);
    setMessages([]);const loadMessages = async () => {
  try {
    const chatId = await AsyncStorage.getItem('chat_id');
    const userId = await AsyncStorage.getItem('user_id'); // ✅ Добавьте user_id
    
    if (!chatId || !userId) {
      console.log('❌ Нет chatId или userId');
      return;
    }

    console.log('📡 Загружаем:', { chatId, userId });
    
    // ✅ Передаем user_id в query параметрах
    const response = await axios.get(
      `http://172.20.10.7:8000/messages/${chatId}?user_id=${userId}&limit=50`
    );
    
    console.log('📡 Ответ:', response.data);
    
    if (response.data?.messages?.length > 0) {
      const formattedMessages = response.data.messages
        .map(msg => ({
          id: msg.id.toString(),
          message: msg.content,
          is_me: msg.is_me,
          created_at: new Date(msg.created_at).toLocaleTimeString('ru-RU')
        }))
        .reverse();
      setMessages(formattedMessages);
    } else {
      setMessages([]);
    }
    
  } catch (error) {
    console.error('❌ Полная ошибка:', error.response?.data || error.message);
  }
};
  }
};



const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    const userId = await AsyncStorage.getItem('user_id');
    const chatId = await AsyncStorage.getItem('chat_id');
    
    if (!userId || !chatId) {
      alert('Не найдены данные чата');
      return;
    }

    setLoading(true); // ✅ Используется состояние
    
    try {
      const response = await axios.post('http://192.168.0.197:8081/postmessage', {
        chat_id: parseInt(chatId),
        user_id: parseInt(userId),
        message: messageText
      });
      
      console.log('Сообщение отправлено:', response.data);
      
      // Оптимистичное обновление
      const newMessageObj = {
        id: Date.now().toString(),
        message: messageText,
        is_me: true,
        created_at: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, newMessageObj]);
      
    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Ошибка отправки сообщения');
    } finally {
      setNewMessage('');
      setLoading(false);
      Keyboard.dismiss();
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.is_me ? styles.myMessage : styles.otherMessage
    ]}>
      <Text style={[
        styles.messageText, 
        item.is_me ? { color: 'white' } : { color: '#333' }
      ]}>
        {item.message}
      </Text>
      <Text style={styles.messageTime}>{item.created_at || 'только что'}</Text>
    </View>
  );
  useEffect(() => {
  const parent = navigation.getParent();
  parent?.setOptions({ 
    tabBarStyle: { display: 'none' } 
  });
  
  return () => {
    parent?.setOptions({ 
      tabBarStyle: { 
        backgroundColor: '#252525', 
        borderRadius: 40, 
        width: '90%',
        // ... все ваши стили      backgroundColor: '#252525', 
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
        alignItems: 'center',
      } 
      
    });
  };
}, [navigation]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} // ✅ ФИКС GO_BACK
          style={{ 
            padding: 5,
            marginTop: 30 

          }}
        >
          <Text style={styles.backButton}>← Назад</Text>
        </TouchableOpacity>
        <View style={{alignItems:'center',    marginLeft: '5%',}}>
          <Text style={styles.userName}>{user.fname} {user.lname}</Text>
        </View>
        
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesListContent}
      />
      <View style={{alignItems: 'center'}}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Напишите сообщение..."
          placeholderTextColor="#888"
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!newMessage.trim() || loading} 
  
        >
          <Image source={require('../assets/add_chat.png')} 
            style={{width: 35, height: 35}}
          />
        </TouchableOpacity>
      </View>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2f2f2f',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#575757',
  },
  backButton: {
    fontSize: 18,
    marginRight: 15,
    color: '#007AFF',
  },
  userName: {

    marginTop: 30,
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesList: {
    flex: 1,
  },
  messagesListContent: {
    padding: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#825d8b',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#5b5b5b',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  otherMessageText: {
    color: 'black',
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 1,
    backgroundColor: '#212121',
    borderColor: '#363636',
    borderWidth: 3,
    borderRadius: 50,
    marginBottom: 10,
    width : '90%',
    marginRight: 10
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#1d1d1d',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#c4c4c4',
    borderRadius: 50,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
  },
});

