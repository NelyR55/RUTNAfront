import React, { useState, useEffect,useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity, Modal, Image, Alert, FlatList,Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Importar hook de navegación

// Componente para Crear Boletos
const CrearBoletos = () => {
  const [matricula, setMatricula] = useState('');
  const [saldo, setSaldo] = useState(null);
  const [rutas, setRutas] = useState([]);
  const [selectedRuta, setSelectedRuta] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrData, setQrData] = useState(null);


  const navigation = useNavigation(); // Usar el hook de navegación

  const fetchSaldo = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No se encontró un token de autenticación.');
        return;
      }

      const response = await fetch('https://rutnaback-production.up.railway.app/boletos/versaldo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setSaldo(data.saldo);
      } else {
        Alert.alert('Error', data.error || 'Error al obtener el saldo');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error al conectar con el servidor');
    }
  };

  const fetchRutas = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('https://rutnaback-production.up.railway.app/rutas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRutas(data);
      } else {
        Alert.alert('Error', data.error || 'Error al obtener las rutas');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error al conectar con el servidor');
    }
  };

  useEffect(() => {
    fetchSaldo();
    fetchRutas();
  }, []);

  const handleCompra = async () => {
    if (!selectedRuta) {
      Alert.alert('Error', 'Por favor, selecciona una ruta');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('https://rutnaback-production.up.railway.app/boletos/comprar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          usuario: matricula,
          destino: selectedRuta.destino,
        }),
      });
      const data = await response.json();

      if (response.ok && data.codigoQR) {
        setQrData(data);
        setModalVisible(true);
        fetchSaldo();
      } else {
        Alert.alert('Error', data.error || 'Error al comprar el boleto');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRuta = (ruta) => {
    setSelectedRuta(ruta);
    setModalVisible(false);
  };

  const openRutasModal = () => {
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
      <View style={styles.saldoContainer}>
        <Text style={styles.saldoText}>Saldo: {saldo !== null ? `$${saldo}` : 'N/A'}</Text>
      </View>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.cardTitle}>Comprar Boleto</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu matrícula"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={matricula}
            onChangeText={(text) => setMatricula(text)}
          />
          <TouchableOpacity
            style={styles.selectButton}
            onPress={openRutasModal}
          >
            <Text style={styles.selectButtonText}>{selectedRuta ? selectedRuta.destino : 'Selecciona una ruta'}</Text>
          </TouchableOpacity>
          <LinearGradient
            colors={['#FFB347', '#FFCC70']}
            style={styles.button}
          >
            <TouchableOpacity
              style={styles.buttonContent}
              onPress={handleCompra}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Procesando...' : 'Comprar'}</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>

      {/* Modal for Rutas Selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible && !qrData}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Selecciona una ruta</Text>
            <FlatList
              data={rutas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.rutaItem}
                  onPress={() => handleSelectRuta(item)}
                >
                  <Text style={styles.rutaText}>{item.destino}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for QR Code */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible && qrData !== null}
        onRequestClose={() => {
          setModalVisible(false);
          setQrData(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Boleto Generado</Text>
            <Image
              source={{ uri: qrData?.codigoQR }}
              style={styles.qrImage}
            />
            <Text style={styles.expirationText}>Expira el: {qrData?.expiracion}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                setQrData(null);
              }}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

// Componente para Boletos Comprados
const BoletosComprados = () => {
  const [boletos, setBoletos] = useState([]);
  const [selectedBoleto, setSelectedBoleto] = useState(null);

  const fetchBoletos = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No se encontró token.');
        return;
      }

      const response = await fetch('https://rutnaback-production.up.railway.app/boletos/listar', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setBoletos(data);
      } else {
        Alert.alert('Error', data.error || 'Error al obtener los boletos');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error al conectar con el servidor');
    }
  };

  useEffect(() => {
    fetchBoletos();
  }, []);

  const handleShowQR = (boleto) => {
    setSelectedBoleto(boleto);
  };

  const handleCloseQR = () => {
    setSelectedBoleto(null);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleShowQR(item)}>
      <Text style={styles.text}>Destino: {item.destino}</Text>
      <Text style={styles.text}>Expiración: {new Date(item.expiracion).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require('../../assets/fondodef.png')} style={styles.screenContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>¡Encuentra aquí tus boletos!</Text>
        <FlatList
          data={boletos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text>No se encontraron boletos</Text>}
        />

        {/* Modal for QR Code */}
        {selectedBoleto && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={!!selectedBoleto}
            onRequestClose={handleCloseQR}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Boleto: {selectedBoleto.destino}</Text>
                <Image
                  source={{ uri: selectedBoleto.codigoQR }}
                  style={styles.qrImage}
                />
                <Text style={styles.expirationText}>Expira el: {new Date(selectedBoleto.expiracion).toLocaleString()}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCloseQR}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </ImageBackground>
  );
};


// Configuración del Tab Navigator
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Comprar Boletos"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Comprar Boletos') {
            iconName = 'ticket';
          } else if (route.name === 'Boletos Comprados') {
            iconName = 'history';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFB347',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Comprar Boletos" component={CrearBoletos} />
      <Tab.Screen name="Boletos Comprados" component={BoletosComprados} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',  
    justifyContent: 'flex-end',  
    width: '100%', 
    padding: 10,
  },
  logoutButton: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',  
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  loaderContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',  // Alinea el contenido a la derecha
    alignItems: 'center',  // Centra verticalmente el contenido
    width: '100%',  // Ocupa todo el ancho del contenedor
  },
  loader: {
    width: 16,
    height: 16,
    marginLeft: 'auto',  // Empuja el loader hacia la derecha
    marginRight: 8,
  },
  
  logoutButtonText: {
    color: '#FFB347',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',  
  },
  
  saldoContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saldoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFB347',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: 300,
    height: 400,
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
  selectButton: {
    height: 40,
    width: '100%',
    borderColor: '#FFB347',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  selectButtonText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 5,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonContent: {
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rutaItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rutaText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#FFB347',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  qrImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  expirationText: {
    fontSize: 16,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFB347',
  },
  item: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  text: {
    fontSize: 16,
  },
});


export default AppNavigator;