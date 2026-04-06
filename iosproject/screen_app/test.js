import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';

export default function TestScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ Дебаунсинг поиска (ждет 500мс после окончания ввода)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        searchUsers(query);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const searchUsers = useCallback(async (searchText) => {
    if (!searchText.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('http://172.20.10.7:8000/serch_users', {
        params: { query: searchText },
        timeout: 10000, // 10 сек таймаут
      });
      
      console.log('✅ Поиск успешен:', response.data);
      setResults(response.data.content || []);
    } catch (error) {
      console.error('❌ Ошибка поиска:', error.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => setSelectedUser(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ 
          uri: item.profile_image 
            ? `http://172.20.10.7:8000/static/images/${item.profile_image}`
            : 'https://via.placeholder.com/60x60/666/fff?text=No+Image'
        }}
        style={styles.avatar}
        resizeMode="cover"
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>
          {item.fname} {item.lname}
        </Text>
        {item.username && (
          <Text style={styles.userTag}>@{item.username}</Text>
        )}
      </View>
      <View style={styles.actionButton}>
        <Text style={styles.actionText}>Начать чат</Text>
      </View>
    </TouchableOpacity>
  );

  const NoResults = () => (
    <View style={styles.noResults}>
      <Text style={styles.noResultsText}>
        {loading ? 'Ищем пользователей...' : 'Пользователи не найдены'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* ✅ Поисковая строка */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Найти пользователя..."
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            returnKeyType="search"
          />
          {query ? (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setQuery('');
                setResults([]);
              }}
            >
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* ✅ Результаты поиска */}
        <View style={styles.resultsContainer}>
          {loading && (
            <ActivityIndicator size="large" color="#007AFF" style={styles.loading} />
          )}
          
          <FlatList
            data={results}
            renderItem={renderUser}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={NoResults}
          />
        </View>

        {/* ✅ Выбранный пользователь */}
        {selectedUser && (
          <View style={styles.selectedUserContainer}>
            <View style={styles.selectedUser}>
              <Image
                source={{ 
                  uri: `http://172.20.10.7:8000/static/images/${selectedUser.profile_image}`
                }}
                style={styles.selectedAvatar}
              />
              <View style={styles.selectedInfo}>
                <Text style={styles.selectedName}>
                  {selectedUser.fname} {selectedUser.lname}
                </Text>
                <TouchableOpacity style={styles.createChatButton}>
                  <Text style={styles.createChatText}>➤ Создать чат</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  serchuser: {
    marginTop: 70,
    margin: 30,

    borderWidth: 2,
    width: '90%',
    height:50,
    borderRadius: 50,
    textAlign: 'center',

    borderColor: '#434343',
    backgroundColor: '#5c5b5b',
    outlineStyle: 'none', 
    borderColor: '#8c96a100',
    color: '#000000',

  }
  ,
    searchInput: {
    flex: 1,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
  },
  list: {
    flex: 1,
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    padding: 50,
    color: '#666',
    fontSize: 16,
  },
  image : {
    margin: 5,
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  viewflatlist: {
    width: '90%',  
    borderRadius: 37,
    backgroundColor: '#1d1d1d',
    borderColor: '#1d1d1d66',
    margin: 5,

  },
  serchusersinform0:{
    margin: 5,
    flexDirection:'row',

  },

    container: {
    flex: 1,
    backgroundColor: '#252525',
  },
  flexContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#333',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#555',
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 10,
    padding: 10,
  },
  clearText: {
    color: '#ccc',
    fontSize: 18,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    backgroundColor: '#333',
    padding: 15,
    marginBottom: 12,
    borderRadius: 15,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userTag: {
    color: '#aaa',
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
  },
  loading: {
    marginVertical: 20,
  },
  selectedUserContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333',
    margin: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  selectedUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  createChatButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  createChatText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
