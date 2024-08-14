import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, Modal, Animated, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Importar hook de navegación

const InicioScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [scannedTickets, setScannedTickets] = useState([]);

  const navigation = useNavigation(); // Usar el hook de navegación

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      const storedTickets = await AsyncStorage.getItem('scannedTickets');
      if (storedTickets) {
        setScannedTickets(JSON.parse(storedTickets));
      }
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    if (scannedTickets.includes(data)) {
      setAlertMessage('Este boleto ya ha sido escaneado y no es válido.');
    } else {
      setAlertMessage(`Boleto Escaneado\nDatos: ${data}`);
      const updatedScannedTickets = [...scannedTickets, data];
      setScannedTickets(updatedScannedTickets);
      AsyncStorage.setItem('scannedTickets', JSON.stringify(updatedScannedTickets));
    }
    setScanned(true);
    setScanning(false);
    setModalVisible(true);
  };

  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity is 0
  const rotateAnim = useRef(new Animated.Value(0)).current; // Rotation animation

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000, // Rotate every 1 second
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.stopAnimation();
    }
  }, [loading, rotateAnim]);

  const handleLogout = () => {
    setLoading(true); // Start loading animation
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Login');
    }, 1000); // Simulate a loading time of 1 second
  };

  // Interpolation for rotation
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (hasPermission === null) {
    return <Text>Solicitando permiso para usar la cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se ha concedido permiso para usar la cámara.</Text>;
  }

  return (
    <ImageBackground source={require('../../assets/fondodef.png')} style={styles.screenContainer}>
     <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          {loading ? (
            <View style={styles.loaderContainer}>
              <Animated.View style={[styles.loader, { transform: [{ rotate }] }]} />
              <Text style={styles.logoutButtonText}>Cargando...</Text>
            </View>
          ) : (
            <View style={styles.logoutContent}>
              <MaterialCommunityIcons name="logout" size={24} color="#FFB347" />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
      <View style={styles.buttonContainer}>
        <LinearGradient colors={['#FFB347', '#FFCC70']} style={styles.scanButton}>
          <TouchableOpacity style={styles.buttonContent} onPress={() => setScanning(true)}>
            <Text style={styles.scanButtonText}>Escanear Boleto</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.welcomeTitle}>RUTNA</Text>
        <Text style={styles.welcomeDescription}>¡Tu compañera de viaje para cada destino!</Text>
      </View>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
      </View>
      {scanning && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{alertMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                setScanned(false);
              }}
            >
              <Text style={styles.closeButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const Tab = createBottomTabNavigator();

const Empleado = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'Inicio') {
          iconName = 'home';
        }

        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Inicio" component={InicioScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 30, // Reduce el padding superior para mover el botón más arriba
  },
  headerContainer: {
    position: 'absolute', // Posiciona el contenedor de la cabecera de forma absoluta
    top: 0, // Coloca el contenedor en la parte superior
    left: 0,
    right: 0,
    padding: 10,
    alignItems: 'flex-end',
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',  
    justifyContent: 'flex-end',  
    width: '100%', 
    padding: 10,
  },
  logoutButton: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  loaderContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    alignItems: 'center',  
    width: '100%', 
  },
  loader: {
    width: 16,
    height: 16,
    marginLeft: 'auto',
    marginRight: 8,
  },
  logoutButtonText: {
    color: '#FFB347',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  buttonContainer: {
    marginBottom: 20,
    width: '80%',
  },
  scanButton: {
    borderRadius: 30,
    width: '100%',
    height: 60,
    marginTop:75,
  },
  buttonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  textContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFB347',
    marginTop: 25,
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    color: '#FFB347',
  },
  closeButton: {
    backgroundColor: '#FFB347',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Empleado;
