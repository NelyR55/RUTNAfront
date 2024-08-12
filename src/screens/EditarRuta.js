import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditarRuta = ({ route, navigation }) => {
  const { id, destino: destinoProp } = route.params;
  const [precio, setPrecio] = useState('');
  const [destino, setDestino] = useState(destinoProp || '');

  useEffect(() => {
    const fetchRuta = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'No se ha encontrado el token de autenticación');
          return;
        }

        const response = await axios.get(`https://rutnaback-production.up.railway.app/rutas/actualizar/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const ruta = response.data;
        setPrecio(ruta.precio.toString());
        // Aquí no es necesario volver a establecer destino ya que lo pasamos como prop
      } catch (error) {
      }
    };

    fetchRuta();
  }, [id]);

  const handleSave = async () => {
    try {
      if (!precio) {
        Alert.alert('Error', 'El campo de precio es obligatorio');
        return;
      }

      const precioNumerico = parseFloat(precio);
      if (isNaN(precioNumerico)) {
        Alert.alert('Error', 'El precio debe ser un número válido');
        return;
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No se ha encontrado el token de autenticación');
        return;
      }

      const response = await axios.put(`https://rutnaback-production.up.railway.app/rutas/actualizar/${id}`, {
        precio: precioNumerico
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        Alert.alert('Éxito', 'Ruta actualizada correctamente');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'No se pudo actualizar la ruta');
      }
    } catch (error) {
      Alert.alert('Error', `Error: ${error.message}`);
    }
  };

  return (
    <ImageBackground source={require('../../assets/fondodef.png')} style={styles.screenContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Admin')}>
        <Icon name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <MaterialCommunityIcons name="map-marker-plus" size={48} color="#FFB347" style={styles.icon} />
          <Text style={styles.cardTitle}>Editar Ruta</Text>
          <Text style={styles.destinoText}>Destino: {destino}</Text>
          <TextInput
            style={styles.input}
            placeholder="Precio"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={precio}
            onChangeText={setPrecio}
          />
          <LinearGradient colors={['#FFB347', '#FFCC70']} style={styles.button}>
            <TouchableOpacity style={styles.buttonContent} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: 20,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: 300,
    height: 450,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFB347',
    textAlign: 'center',
  },
  destinoText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    fontWeight: 'bold',
    borderColor: '#FFB347',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    width: '100%',
    color: '#333',
    textAlign: 'center',
    backgroundColor: '#f1f1f1',
  },
  button: {
    marginTop: 20,
    borderRadius: 30,
    width: '100%',
    height: 50,
  },
  buttonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    marginBottom: 15,
  },
});

export default EditarRuta;
