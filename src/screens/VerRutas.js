import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const VerRutas = () => {
  const [rutas, setRutas] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const response = await axios.get('https://rutnaback-production.up.railway.app/rutas');
        setRutas(response.data);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las rutas.');
      }
    };

    fetchRutas();
  }, []);

  return (
    <ImageBackground 
      source={require('../../assets/fondodef.png')} 
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Admin')}>
          <Icon name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Historial</Text>
      </View>
      <FlatList
        data={rutas}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={require('../../assets/Ruta.png')} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.nombre}>{item.destino}</Text>
              <Text style={styles.precio}>Precio: ${item.precio}</Text>
              <TouchableOpacity onPress={() => console.log('Editar')}>
                <Text style={styles.acciones}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-start',
    flex: 1,
    marginLeft: 77,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  cardContent: {
    marginLeft: 16,
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    color: '#000',
    marginBottom: 4,
  },
  precio: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  acciones: {
    fontSize: 16,
    color: '#FFB347',
  },
});

export default VerRutas;
