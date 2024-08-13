import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, Modal } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BarCodeScanner } from 'expo-barcode-scanner';

const InicioScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScanning(false);
    setAlertMessage(`Boleto Escaneado\nDatos: ${data}`);
    setModalVisible(true);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso para usar la cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se ha concedido permiso para usar la cámara.</Text>;
  }

  return (
    <ImageBackground source={require('../../assets/fondodef.png')} style={styles.screenContainer}>
      <View style={styles.buttonContainer}>
        <LinearGradient
          colors={['#FFB347', '#FFCC70']}
          style={styles.scanButton}
        >
          <TouchableOpacity
            style={styles.buttonContent}
            onPress={() => setScanning(true)}
          >
            <Text style={styles.scanButtonText}>Escanear Boleto</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.welcomeTitle}>RUTNA</Text>
        <Text style={styles.welcomeDescription}>¡Tu compañera de viaje para cada destino!</Text>
      </View>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
        />
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
    paddingTop: 50,
  },
  buttonContainer: {
    marginBottom: 20,
    width: '80%',
  },
  scanButton: {
    borderRadius: 30,
    width: '100%',
    height: 60,
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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