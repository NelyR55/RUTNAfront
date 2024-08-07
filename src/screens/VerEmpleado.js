import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const VerEmpleado = () => {
  const [datos, setDatos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const respuesta = await axios.get('https://rutnaback-production.up.railway.app/user/obtenerAdmins');
        setDatos(respuesta.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    obtenerDatos();
  }, []);

  const handleEdit = (id) => {
    // Maneja la edición del ítem aquí
  };

  const handleDelete = (id) => {
    // Maneja la eliminación del ítem aquí
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
        <Text style={styles.title}>Empleados</Text>
      </View>
      <FlatList
        data={datos}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={require('../../assets/Usuario.png')} style={styles.image} />
            <View style={styles.cardContent}>
              <View style={styles.userInfo}>
                <Text style={styles.usuario}>{item.usuario}</Text>
                <Text style={styles.rol}>{item.rol}</Text>
              </View>
              <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={() => handleEdit(item.id)} style={styles.iconButton}>
                  <Icon name="pencil" size={24} color="#56ad45" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconButton}>
                  <Icon name="trash" size={24} color="#FF4D4D" />
                </TouchableOpacity>
              </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  usuario: {
    fontSize: 18,
    color: '#000',
    marginBottom: 4,
  },
  rol: {
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 10,
  },
});

export default VerEmpleado;
