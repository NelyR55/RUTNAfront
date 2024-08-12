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

const VerRutas = () => {
  const [datos, setDatos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const response = await axios.get(
          'https://rutnaback-production.up.railway.app/rutas'
        );
        setDatos(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchRutas();
  }, []);

  const handleEdit = (id) => {
    const ruta = datos.find((item) => item.id === id);
    if (ruta) {
      navigation.navigate('EditarRuta', { id, destino: ruta.destino });
    } else {
      Alert.alert('Error', 'Ruta no encontrada');
    }
  };
  

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar Ruta',
      '¿Estás seguro de que deseas eliminar esta ruta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token'); // Obtener el token

              if (!token) {
                Alert.alert('Error', 'Token de autenticación no encontrado');
                return;
              }

              console.log('Token:', token); // Imprimir el token para depuración

              await axios.delete(
                `https://rutnaback-production.up.railway.app/rutas/eliminar/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}` // Asegúrate de incluir el token en el encabezado
                  }
                }
              );

              setDatos(datos.filter((ruta) => ruta.id !== id));
              Alert.alert('Éxito', 'Ruta eliminada correctamente');
            } catch (error) {
              console.error('Error al eliminar la ruta:', error);
              Alert.alert(
                'Error',
                'No se pudo eliminar la ruta. Por favor, intenta nuevamente.'
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
            <Image source={require('../../assets/Ruta.png')} style={styles.image} />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.nombre}>{item.destino}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => handleEdit(item.id)}
                    style={styles.iconButton}
                  >
                    <Icon name="pencil" size={24} color="#56ad45" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={styles.iconButton}
                  >
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
        keyExtractor={(item) => item.id.toString()}
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