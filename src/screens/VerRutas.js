import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const VerRutas = () => {
  const [datos, setDatos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const response = await axios.get('https://rutnaback-production.up.railway.app/rutas');
        setDatos(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchRutas();
  }, []);

  const handleEdit = (id) => {
    navigation.navigate('EditarRuta', { id });
  };

  const handleDelete = (id) => {
    console.log(`Eliminar ruta con id ${id}`);
    // Aquí puedes agregar la lógica para eliminar la ruta
  };

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
        data={datos}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={require('../../assets/Ruta.png')} style={styles.image} />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.nombre}>{item.destino}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => handleEdit(item.id)} style={styles.iconButton}>
                    <Icon name="pencil" size={24} color="#56ad45" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconButton}>
                    <Icon name="trash" size={24} color="#FF4D4D" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.precio}>
                <Text style={styles.precioLabel}>Precio: </Text>
                <Text style={styles.precioValue}>${item.precio}</Text>
              </Text>
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nombre: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  precio: {
    fontSize: 16,
    color: '#333',
  },
  precioLabel: {
    fontWeight: 'bold',
  },
  precioValue: {
    color: '#56ad45',
  },
  actions: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 8,
  },
});

export default VerRutas;
