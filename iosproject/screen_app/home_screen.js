import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';



export default function HomeScreen() {
  
  const [posts, setPosts] = useState([]);

 

  useEffect(() => {
    HandlePostGet();
  }, []);

  const HandlePostGet = async() => {
    try{
        const res = await axios.get('http://192.168.0.197:8000/get_description')

        const postsData = res.data.data || [];
        setPosts(postsData)
        console.log(posts)

    }catch(error){
      alert('error')
    }
  } 

const renderPost = ({ item }) => (
  
<TouchableOpacity style={styles.postContainer} activeOpacity={0.8}>
  <View style={styles.imageContainer}>
    <Image
      source={{ 
        uri: `http://192.168.0.197:8000/static/post_images/${item.post_file}` 
      }}
      style={styles.image}
      resizeMode="contain"  // ← ПОЛНОЕ ИЗОБРАЖЕНИЕ БЕЗ ОБРЕЗКИ
      onError={() => console.log('Image load error:', item.post_file)}
    />
  </View>
  
  <View style={styles.contentContainer}>
    <Text style={styles.userName}>
      {item.fname} {item.lname}
    </Text>
    <Text style={styles.postText} numberOfLines={3}>
      {item.post_text}
    </Text>
  </View>
</TouchableOpacity>

);


  return (
    <View style={{flex: 1,backgroundColor: '#2f2f2f'}}>
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item, index) => item.post_file || index.toString()}  
    />
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    marginLeftRight: 15,
    backgroundColor: '#262626',
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#63636320'
  },
  imageContainer: {
    width: '100%',
    height: 220,  // Немного больше для contain
    justifyContent: 'center',  // Центрирует изображение
    alignItems: 'center',
    backgroundColor: '#1a1a1a',  // Фон для пустых областей
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  contentContainer: {
    padding: 15,
    backgroundColor: '#262626',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#ffffffc6',
    marginBottom: 8,
  },
  postText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#ffffffe3',
  },
});


