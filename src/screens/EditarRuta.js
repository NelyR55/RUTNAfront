import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import axios from 'axios';

const EditarRuta = ({ route, navigation }) => {
  const { id } = route.params;
  const [precio, setPrecio] = useState('');

  useEffect(() => {
    const fetchRuta = async () => {
      try {
        const response = await axios.get(`https://rutnaback-production.up.railway.app/rutas/${id}`);
        const ruta = response.data;
        setPrecio(ruta.precio.toString()); // Convierte a cadena para el input
      } catch (error) {
        Alert.alert('Error', `Error al obtener la ruta: ${error.message}`);
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

      const response = await axios.put(`https://rutnaback-production.up.railway.app/rutas/actualizar/${id}`, {
        precio: parseFloat(precio)
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
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <MaterialCommunityIcons name="map-marker-plus" size={48} color="#FFB347" style={styles.icon} />
          <Text style={styles.cardTitle}>Editar Ruta</Text>
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
