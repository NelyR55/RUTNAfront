import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity, Modal, Image, Alert, FlatList, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as BarcodeScanner from 'expo-barcode-scanner';

const EmpleadoScreen = () => {
  const [empleadoID, setEmpleadoID] = useState('');
  const [rutas, setRutas] = useState([]);
  const [selectedRuta, setSelectedRuta] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarcodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const fetchRutas = async () => {
    try {
      const response = await fetch('https://rutnaback-production.up.railway.app/rutas');
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
    fetchRutas();
  }, []);

  const handleCompra = async () => {
    if (!empleadoID) {
      Alert.alert('Error', 'Por favor, ingresa tu ID de empleado');
      return;
    }
    if (!selectedRuta) {
      Alert.alert('Error', 'Por favor, selecciona una ruta');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://rutnaback-production.up.railway.app/boletos/comprar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: empleadoID,
          destino: selectedRuta.destino,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setQrData(data);
        setModalVisible(true);
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

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanning(false);
    setLoading(true);
    try {
      const response = await fetch('https://rutnaback-production.up.railway.app/boletos/eliminar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigoQR: data }),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Éxito', 'Boleto eliminado correctamente');
      } else {
        Alert.alert('Error', result.error || 'Error al eliminar el boleto');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const startScanning = async () => {
    if (hasPermission === null) {
      Alert.alert('Error', 'Permiso para usar la cámara no solicitado');
      return;
    }
    if (hasPermission === false) {
      Alert.alert('Error', 'No se puede acceder a la cámara');
      return;
    }
    setScanning(true);
    try {
      const { type, data } = await BarcodeScanner.scanAsync();
      handleBarCodeScanned({ type, data });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error al escanear el código');
    }
  };

  return (
    <ImageBackground source={require('../../assets/fondodef.png')} style={styles.screenContainer}>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.cardTitle}>Comprar Boleto</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu ID de empleado"
            placeholderTextColor="#aaa"
            value={empleadoID}
            onChangeText={setEmpleadoID}
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
          <Button title={'Escanear Boleto'} onPress={startScanning} disabled={scanning} />
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
            {qrData ? (
              <>
                <Image
                  source={{ uri: qrData.codigoQR }}
                  style={styles.qrImage}
                />
                <Text style={styles.expirationText}>Expira el: {qrData.expiracion}</Text>
              </>
            ) : (
              <Text>No se ha generado ningún código QR.</Text>
            )}
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

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },
  cardContainer: {
    flex: 1,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -50, // Adjust as needed
  },
  card: {
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  cardTitle: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFB347',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginBottom: 10,
  },
  selectButton: {
    backgroundColor: '#FFB347',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  button: {
    borderRadius: 5,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  rutaItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },
  rutaText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#FFB347',
    borderRadius: 5,
    padding: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  qrImage: {
    width: 200,
    height: 200,
    marginVertical: 15,
  },
  expirationText: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmpleadoScreen;
