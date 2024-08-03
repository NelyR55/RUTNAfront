import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from "react-native";
import { TextInput, GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const navigation = useNavigation();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/fondo.png')}  
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <Text style={styles.titulo}>BIENVENIDO</Text>
          <Text style={styles.subTitle}>¡La ruta universitaria a tu alcance!</Text>
          <TextInput placeholder="Usuario" style={styles.TextInput} />
          <TextInput placeholder="Contraseña" style={styles.TextInput} secureTextEntry />
          <LinearGradient
            colors={['#FFB347', '#FFCC70']}  // Colores del Gradient
            style={styles.button}
          >
            <TouchableOpacity
              style={styles.buttonContent}
              onPress={() => navigation.navigate('Empleado')}
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
    marginTop: 100,  // Ajusta este valor según lo que necesites
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
