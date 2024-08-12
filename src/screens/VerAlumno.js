import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VerAlumno = () => {
  const [datos, setDatos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const respuesta = await axios.get(
          'https://rutnaback-production.up.railway.app/user/obtenerAlumnos'
        );
        setDatos(respuesta.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    obtenerDatos();
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar Alumno',
      '¿Estás seguro de que deseas eliminar este alumno?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');

              if (!token) {
                Alert.alert('Error', 'Token de autenticación no encontrado');
                return;
              }

              console.log('Token:', token); // Para depuración

              await axios.delete(
                `https://rutnaback-production.up.railway.app/user/eliminarUsuario/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              );

              setDatos(datos.filter((alumno) => alumno.id !== id));
              Alert.alert('Éxito', 'Alumno eliminado correctamente');
            } catch (error) {
              console.error('Error al eliminar el alumno:', error);
              Alert.alert(
                'Error',
                'No se pudo eliminar el alumno. Por favor, intenta nuevamente.'
              );
            }
          },
          style: 'destructive'
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/fondodef.png')}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Admin')}
        >
          <Icon name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Historial</Text>
      </View>
      <FlatList
        data={datos}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={require('../../assets/Usuario.png')} style={styles.image} />
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={styles.usuario}>{item.usuario}</Text>
                <Text style={styles.saldo}>Saldo: ${item.saldo}</Text>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.iconButton}
                >
                  <Icon name="trash" size={24} color="#FF4D4D" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 20
  },
  backButton: {
    padding: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-start',
    flex: 1,
    marginLeft: 77
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  cardContent: {
    marginLeft: 16,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textContainer: {
    flex: 1
  },
  usuario: {
    fontSize: 18,
    color: '#000'
  },
  saldo: {
    fontSize: 16,
    color: '#888'
  },
  iconContainer: {
    flexDirection: 'row'
  },
  iconButton: {
    marginLeft: 10
  }
});

export default VerAlumno;