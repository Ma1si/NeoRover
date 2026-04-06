import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState, useCallback, useRef, useEffect ,} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity, // ← ДОБАВЬТЕ ЭТО
  TextInput,
  FlatList,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

export default function ChatScreen() {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(); // ← Для debounce
  const [image, setImage] = useState('')
  const navigation = useNavigation(); 
  const [chat, setChat] = useState([])

  useEffect(() => {
    getChat()
  }, [])

  const fetchUsers = useCallback(async (query) => {
    if (!query || query.length < 1) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      console.log('🔍 Запрос:', query); // ← Для дебага
      const response = await axios.get('http://192.168.0.197:8000/serch_users/', {
        params: { query },
        timeout: 10000,
      });
      console.log('✅ Ответ:', response.data); // ← Для дебага
      setUsers(response.data.content || []);
    } catch (error) {
      console.error('❌ Ошибка:', error.message, error.response?.data);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getChat = async() => {
    const userId = await AsyncStorage.getItem('user_id')
   
    try{
      const res = await axios.get(`http://192.168.0.197:8000/getchat/${userId}`)

      const chat = res.data.message
      setChat(chat)
      console.log(chat)
    }catch{
      alert('err')
    }

  }
    const renderUserChat = ({ item }) => (
    <TouchableOpacity style={{}} onPress={() => handleUserPress(item)}>
      <View style={{}}>
      <View style={{ borderRadius: 50, borderColor: '', margin: 3, flexDirection: 'row',  width: '99%',  backgroundColor: '#5d5b5b', }}>
        <View>
          <Image
            style={{width: 50, height: 50, borderRadius: 25, margin: 5}}
            source={{ 
            uri: `http://192.168.0.197:8000/static/images/${item.profile_image}` 
          }}/>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{marginLeft: 3}}>{item.lname} {item.fname}</Text>
        </View>
      </View>
      </View>
    </TouchableOpacity>
  )

  // ✅ Правильный debounce
  const debouncedSearch = useCallback((query) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      fetchUsers(query);
    }, 300);
  }, [fetchUsers]);

  const handleSearch = (text) => {
    setSearchText(text);
    debouncedSearch(text);
  };

    const handleUserPress = async(user) => {
      const userId = await AsyncStorage.getItem('user_id')

      try{

        const res = await axios.post('http://192.168.0.197:8000/postchat', {id: parseInt(userId), select_user_id: user.id })

        await AsyncStorage.setItem('selectedUser', JSON.stringify(user));
        await AsyncStorage.setItem('chat_id', res.data.chat_id.toString());
        console.log(res.data)
        // Переходим на экран чата
        navigation.navigate('ChatRoom', { user, chatId: res.data.chat_id  });

        

      }catch(e){
        alert('err')
      }
      
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={() => handleUserPress(item)}
       // ← Добавляем обработчик нажатия
    >

        <Image
          style={styles.avatar}
          source={{ uri: `http://192.168.0.197:8000/static/images/${item.profile_image}` }}
        />

      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {item.fname} {item.lname} {item.id}
        </Text>
      </View>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Поиск по имени или фамилии..."
        value={searchText}
        onChangeText={handleSearch}
        autoCorrect={false}
        returnKeyType="search"
      />

      {loading && (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loading} />
      )}
      {searchText && searchText.trim().length > 0 && (
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUserItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
        )}
      <View >
      <FlatList
        data={chat}
        renderItem={renderUserChat}
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#2f2f2f' },
  searchInput: {
    marginTop: 35,
    height: 50,
    borderWidth: 1,
    borderColor: '#2e2e2e2c', 
    backgroundColor: '#262626',
    borderRadius: 40,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  loading: { marginBottom: 20 },
  list: { flexGrow: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center' },
  userItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#5e5e5e',
    alignItems: 'center',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultAvatarText: { fontSize: 20 },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
});
