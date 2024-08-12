import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Alert } from "react-native";
import { TextInput, GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Login() {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://rutnaback-production.up.railway.app/user/login', {
        usuario,
        pass
      });

      console.log('Response:', response.data); // Log de la respuesta

      if (response.status === 200) {
        const { token, rol } = response.data;
        console.log('Role:', rol); // Log del rol

        // Almacenar el token en AsyncStorage
        await AsyncStorage.setItem('token', token);

        if (rol === 'admin') {
          navigation.navigate('Admin');
        } else if (rol === 'alumno') {
          navigation.navigate('Alumno');
        } else if (rol === 'chofer') {
          navigation.navigate('Empleado');
        } else {
          Alert.alert('Error', 'Rol desconocido');
        }
      } else {
        Alert.alert('Error', response.data.error);
      }
    } catch (error) {
      console.log('Error:', error); // Log del error
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango de 2xx
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.log('Request data:', error.request);
      } else {
        // Algo pasó al configurar la solicitud
        console.log('Error message:', error.message);
      }
      Alert.alert('Error', 'Algo salió mal, por favor intenta nuevamente');
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/fondo.png')}  
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <Text style={styles.titulo}>BIENVENIDO</Text>
          <Text style={styles.subTitle}>¡La ruta universitaria a tu alcance!</Text>
          <TextInput
            placeholder="Usuario"
            style={styles.TextInput}
            value={usuario}
            onChangeText={setUsuario}
          />
          <TextInput
            placeholder="Contraseña"
            style={styles.TextInput}
            secureTextEntry
            value={pass}
            onChangeText={setPass}
          />
          <LinearGradient
            colors={['#FFB347', '#FFCC70']}
            style={styles.button}
          >
            <TouchableOpacity
              style={styles.buttonContent}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </LinearGradient>
          <StatusBar style="auto" />
        </View>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 50,
    color: '#181818',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
    marginTop: 100,
  },
  subTitle: {
    fontSize: 20,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 10,
  },
  TextInput: {
    width: '80%',
    height: 60,
    padding: 10,
    paddingStart: 30,
    marginTop: 20,
    borderRadius: 30,
    backgroundColor: '#f1f1f1',
  },
  button: {
    marginTop: 20,
    borderRadius: 30,
    width: '80%',
    height: 60,
  },
  buttonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  }
});