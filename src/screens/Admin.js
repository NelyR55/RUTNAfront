import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Modal, FlatList, TextInput, ScrollView, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const roleOptions = ['Admin', 'Chofer', 'Alumno'];

const CustomSelect = ({ selectedValue, onValueChange, options }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.selectButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.selectButtonText}>{selectedValue}</Text>
      </TouchableOpacity>
      <Modal transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => {
                  onValueChange(item);
                  setModalVisible(false);
                }}>
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const Inicio = ({ navigation }) => (
  <ImageBackground source={require('../../assets/fondodef.png')} style={styles.screenContainer}>
    <View style={styles.textContainer}>
      <Text style={styles.welcomeTitle}>Bienvenido</Text>
      <Text style={styles.welcomeDescription}>RUTNA: Tu compañera de viaje para cada destino</Text>
    </View>
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.smallCard} onPress={() => navigation.navigate('VerAlumno')}>
        <MaterialCommunityIcons name="account-group" size={32} color="#FFB347" />
        <Text style={styles.cardTitle}>Ver Alumnos</Text>
        <Text style={styles.cardDescription}>Consulta el perfil de los alumnos registrados.</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.smallCard} onPress={() => navigation.navigate('VerEmpleado')}>
        <MaterialCommunityIcons name="map" size={32} color="#FFB347" />
        <Text style={styles.cardTitle}>Ver Empleados</Text>
        <Text style={styles.cardDescription}>Consulta el perfil de los empleados registrados.</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.smallCard} onPress={() => navigation.navigate('VerRutas')}>
        <MaterialCommunityIcons name="map-search" size={32} color="#FFB347" />
        <Text style={styles.cardTitle}>Ver Rutas</Text>
        <Text style={styles.cardDescription}>Accede a la lista completa de rutas.</Text>
      </TouchableOpacity>
    </View>
  </ImageBackground>
);

const AgregarSaldo = () => {
  const [usuario, setUsuario] = useState('');
  const [cantidad, setCantidad] = useState('');

  const handleCargarSaldo = async () => {
    try {
      const response = await axios.post('https://rutnaback-production.up.railway.app/user/cargarSaldo', {
        usuario,
        cantidad
      });
      Alert.alert('Éxito', 'Saldo cargado correctamente');
      setUsuario('');
      setCantidad('');
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', error.response.data.error);
      } else {
        Alert.alert('Error', 'Error de conexión');
      }
    }
  };

  return (
    <ImageBackground source={require('../../assets/fondodef.png')} style={styles.screenContainer}>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <MaterialCommunityIcons name="wallet-plus" size={48} color="#FFB347" />
          <Text style={styles.cardTitle}>Cargar Saldo</Text>
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor="#aaa"
            value={usuario}
            onChangeText={setUsuario}
          />
          <TextInput
            style={styles.input}
            placeholder="Cantidad"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={cantidad}
            onChangeText={setCantidad}
          />
          <LinearGradient colors={['#FFB347', '#FFCC70']} style={styles.button}>
            <TouchableOpacity style={styles.buttonContent} onPress={handleCargarSaldo}>
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </ImageBackground>
  );
};

const AgregarUsuario = () => {
  const [usuario, setUsuario] = useState('');
  const [pass, setPass] = useState('');
  const [saldo, setSaldo] = useState('');
  const [selectedRole, setSelectedRole] = useState('Rol');

  const handleAgregarUsuario = async () => {
    try {
      const response = await axios.post('https://rutnaback-production.up.railway.app/user/registrarUsuario', {
        usuario,
        pass,
        rol: selectedRole.toLowerCase(),
        saldo
      });
      Alert.alert('Éxito', 'Usuario registrado correctamente');
      setUsuario('');
      setPass('');
      setSaldo('');
      setSelectedRole('Rol');
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', error.response.data.error);
      } else {
        Alert.alert('Error', 'Error de conexión');
      }
    }
  };

  return (
    <ImageBackground source={require('../../assets/fondodef.png')} style={styles.screenContainer}>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <MaterialCommunityIcons name="account-multiple-plus" size={48} color="#FFB347" />
          <Text style={styles.cardTitle}>Agregar Usuario</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            placeholderTextColor="#aaa"
            value={usuario}
            onChangeText={setUsuario}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#aaa"
            secureTextEntry={true}
            value={pass}
            onChangeText={setPass}
          />
          <CustomSelect
            selectedValue={selectedRole}
            onValueChange={(value) => setSelectedRole(value)}
            options={roleOptions}
          />
          <TextInput
            style={styles.input}
            placeholder="Saldo"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={saldo}
            onChangeText={setSaldo}
          />
          <LinearGradient colors={['#FFB347', '#FFCC70']} style={styles.button}>
            <TouchableOpacity style={styles.buttonContent} onPress={handleAgregarUsuario}>
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </ImageBackground>
  );
};

const VerAlumnos = () => {
  const [alumnos, setAlumnos] = useState([]);

  const fetchAlumnos = async () => {
    try {
      const response = await axios.get('https://rutnaback-production.up.railway.app/user/alumnos');
      setAlumnos(response.data);
    } catch (error) {
      Alert.alert('Error', 'Error al obtener la lista de alumnos');
    }
  };

  React.useEffect(() => {
    fetchAlumnos();
  }, []);

  return (
    <ImageBackground source={require('../../assets/fondodef.png')} style={styles.screenContainer}>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <MaterialCommunityIcons name="account-group" size={48} color="#FFB347" />
          <Text style={styles.cardTitle}>Ver Alumnos</Text>
          <FlatList
            data={alumnos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>Usuario: {item.usuario}</Text>
                <Text style={styles.listItemText}>Saldo: {item.saldo}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const VerEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);

  const fetchEmpleados = async () => {
    try {
      const response = await axios.get('https://rutnaback-production.up.railway.app/user/admins');
      setEmpleados(response.data);
    } catch (error) {
      Alert.alert('Error', 'Error al obtener la lista de empleados');
    }
  };

  React.useEffect(() => {
    fetchEmpleados();
  }, []);

  return (
    <ImageBackground source={require('../../assets/fondodef.png')} style={styles.screenContainer}>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <MaterialCommunityIcons name="account-group" size={48} color="#FFB347" />
          <Text style={styles.cardTitle}>Ver Empleados</Text>
          <FlatList
            data={empleados}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>Usuario: {item.usuario}</Text>
                <Text style={styles.listItemText}>Rol: {item.rol}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const VerRutas = () => {
  const [rutas, setRutas] = useState([]);

  const fetchRutas = async () => {
    try {
      const response = await axios.get('https://rutnaback-production.up.railway.app/ruta/verRutas');
      setRutas(response.data);
    } catch (error) {
      Alert.alert('Error', 'Error al obtener la lista de rutas');
    }
  };

  React.useEffect(() => {
    fetchRutas();
  }, []);

  return (
    <ImageBackground source={require('../../assets/fondodef.png')} style={styles.screenContainer}>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <MaterialCommunityIcons name="map-search" size={48} color="#FFB347" />
          <Text style={styles.cardTitle}>Ver Rutas</Text>
          <FlatList
            data={rutas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>Destino: {item.destino}</Text>
                <Text style={styles.listItemText}>Precio: {item.precio}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </ImageBackground>
  );
};
///AGREGAR RUTA
const AgregarRuta = () => {
  const [destino, setDestino] = useState('Ruta');
  const [precio, setPrecio] = useState('');

  const handleAgregarRuta = async () => {
    try {
      const response = await axios.post('https://rutnaback-production.up.railway.app/rutas/agregar', {
        destino,
        precio
      });
      Alert.alert('Éxito', 'Ruta agregada correctamente');
      setDestino('Ruta');
      setPrecio('');
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', error.response.data.error);
      } else {
        Alert.alert('Error', 'Error de conexión');
      }
    }
  };

  return (
    <ImageBackground source={require('../../assets/fondodef.png')} style={styles.screenContainer}>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <MaterialCommunityIcons name="map-marker-plus" size={48} color="#FFB347" />
          <Text style={styles.cardTitle}>Agregar Ruta</Text>
          <CustomSelect
            selectedValue={destino}
            onValueChange={(value) => setDestino(value)}
            options={['Aguascalientes', 'Asientos', 'Loreto', 'Ojocaliente', 'Villa García','Luis Moya','San Pancho','Margaritas','Bimbaletes','Cosio']}
          />
          <TextInput
            style={styles.input}
            placeholder="Precio"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={precio}
            onChangeText={setPrecio}
          />
          <LinearGradient
            colors={['#FFB347', '#FFCC70']}
            style={styles.button}
          >
            <TouchableOpacity
              style={styles.buttonContent}
              onPress={handleAgregarRuta}
            >
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </ImageBackground>
  );
};
////ACTIVIDAD
const Actividad = () => {
  const tableData = [
    { usuario: 'Alumno', actividad: 'Compra de boleto', fecha: '01/08/2023' },
    { usuario: 'Admin', actividad: 'Consulta de saldo', fecha: '02/08/2023' },
    { usuario: 'Empleado', actividad: 'Registro de ruta', fecha: '03/08/2023' },
    // Agrega más datos según sea necesario
  ];

  return (
    <ImageBackground source={require('../../assets/fondodef.png')} style={styles.screenContainer}>
       <View style={styles.textContainer}>
      <Text style={styles.welcomeDescription2}>Verifica los detalles de cada transacción realizada en  </Text><Text style={styles.welcomeTitle2}>RUTNA</Text>
    </View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Usuario</Text>
            <Text style={styles.tableHeaderText}>Actividad</Text>
            <Text style={styles.tableHeaderText}>Fecha</Text>
          </View>
          {tableData.map((row, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableRowText}>{row.usuario}</Text>
              <Text style={styles.tableRowText}>{row.actividad}</Text>
              <Text style={styles.tableRowText}>{row.fecha}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const Tab = createBottomTabNavigator();

const Admin = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Inicio') {
          iconName = 'home';
        } else if (route.name === 'Agregar Usuario') {
          iconName = 'account-multiple-plus';
        } else if (route.name === 'Agregar Ruta') {
          iconName = 'map-marker-plus';
        }else if (route.name === 'Actividad') {
          iconName = 'history';
        } else if (route.name === 'Cargar Saldo') {
          iconName = 'credit-card';
        } 

        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#FFB347',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopColor: 'transparent',
        elevation: 0,
      },
    })}
  >
    <Tab.Screen name="Inicio" component={Inicio} />
    <Tab.Screen name="Agregar Usuario" component={AgregarUsuario} />
    <Tab.Screen name="Agregar Ruta" component={AgregarRuta} />
    <Tab.Screen name="Cargar Saldo" component={AgregarSaldo} />
    <Tab.Screen name="Actividad" component={Actividad} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginBottom: 20,
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
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFB347',
    marginTop: 7,
  },
  welcomeTitle2: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFB347',
    marginTop: 4,
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  welcomeDescription2: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  option: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 15,
    color: '#aaa',
    fontWeight: 'bold',
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
  smallCard: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    width: 150,
    height: 150,
    backgroundColor: '#fff',
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardDescription: {
    marginTop: 5,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  scrollViewContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tableContainer: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginTop:10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    backgroundColor:'#FFB347',
    borderBottomColor: '#FFB347',
    paddingBottom: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    width: '33%',
    textAlign: 'center',
    marginTop:6,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1, // Añadir esta línea
    borderBottomColor: '#aaa', // Añadir esta línea
  },
  tableRowText: {
    fontSize: 14,
    color: '#333',
    width: '33%',
    textAlign: 'center',
  },
});

export default Admin;

