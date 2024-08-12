import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity, Modal, Image, Alert, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AlumnoScreen = () => {
  const [matricula, setMatricula] = useState('');
  const [saldo, setSaldo] = useState(null);
  const [rutas, setRutas] = useState([]);
  const [selectedRuta, setSelectedRuta] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSaldo = async (matricula) => {
    try {
      const response = await fetch(`https://rutnaback-production.up.railway.app/user/obtenerAlumnos/saldo?matricula=${matricula}`);
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
    if (!matricula) {
      Alert.alert('Error', 'Por favor, ingresa tu matrícula');
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
          usuario: matricula,
          destino: selectedRuta.destino,
        }),
      });
      const data = await response.json();
      console.log(data); // Verifica qué datos se están recibiendo

      if (response.ok && data.codigoQR) {
        setQrData(data);
        setModalVisible(true);
        fetchSaldo(matricula);
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

  return (
    <ImageBackground source={require('../../assets/fondodef.png')} style={styles.screenContainer}>
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
            onChangeText={(text) => {
              setMatricula(text);
              if (text.length === 8) {
                fetchSaldo(text);
              }
            }}
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

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },
  saldoContainer: {
    position: 'absolute',
    top: 40,
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
    marginBottom:10,
  },
  cardTitle: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFB347',
    textAlign: 'center',
    marginBottom:10,
  },
  input: {
    height: 50,
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
    height: 50,
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
    fontSize: 16,
    color: '#333',
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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFB347',
    marginBottom: 20,
  },
  qrImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  expirationText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#FFB347',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rutaItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rutaText: {
    fontSize: 16,
    color: '#333',
  },
});

export default AlumnoScreen;
