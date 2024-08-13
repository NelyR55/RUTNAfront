import React, { useState, useEffect,useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Modal, FlatList, TextInput, ScrollView, Animated ,Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';


const roleOptions = ['Admin', 'Chofer'];

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
const Inicio = ({ navigation }) => {
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
      <View style={styles.textContainer}>
        <Text style={styles.welcomeTitle}>Bienvenido</Text>
        <Text style={styles.welcomeDescription}>RUTNA: ¡Tu compañera de viaje para cada destino!</Text>
      </View>
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.smallCard} onPress={() => navigation.navigate('VerAlumno')}>
          <MaterialCommunityIcons name="account-group" size={32} color="#FFB347" />
          <Text style={styles.cardTitle}>Ver Alumnos</Text>
          <Text style={styles.cardDescriptionS}>Consulta el perfil de los alumnos registrados.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallCard} onPress={() => navigation.navigate('VerEmpleado')}>
          <MaterialCommunityIcons name="map" size={32} color="#FFB347" />
          <Text style={styles.cardTitle}>Ver Empleados</Text>
          <Text style={styles.cardDescriptionS}>Consulta el perfil de los empleados registrados.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallCard} onPress={() => navigation.navigate('VerRutas')}>
          <MaterialCommunityIcons name="map-search" size={32} color="#FFB347" />
          <Text style={styles.cardTitle}>Ver Rutas</Text>
          <Text style={styles.cardDescriptionS}>Accede a la lista completa de rutas.</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};



//SALDO
const AgregarSaldo = () => {
  const [usuario, setUsuario] = useState('');
  const [cantidad, setCantidad] = useState('');

  const handleCargarSaldo = async () => {
    try {
      // Obtener el token de AsyncStorage
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Error', 'No estás autenticado');
        return;
      }

      const response = await axios.post('https://rutnaback-production.up.railway.app/user/cargarSaldo', {
        usuario,
        cantidad
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
// AGREGAR USUARIO 
const validateUsername = (username) => {
  const regex = /^[A-Za-z]+$/;
  return regex.test(username) && username.length <= 15;
};

const AgregarUsuario = () => {
  const [usuario, setUsuario] = useState('');
  const [pass, setPass] = useState('');
  const [selectedRole, setSelectedRole] = useState('Rol');

  const handleAgregarUsuario = async () => {
    if (!validateUsername(usuario)) {
      Alert.alert('Error', 'El nombre de usuario debe contener solo letras y tener un máximo de 15 caracteres.');
      return;
    }

    if (pass.trim() === '') {
      Alert.alert('Error', 'La contraseña es requerida.');
      return;
    }

    try {
      const response = await axios.post('https://rutnaback-production.up.railway.app/user/registrarUsuario', {
        usuario,
        pass,
        rol: selectedRole.toLowerCase(),
        saldo: 0 // Establece el saldo en 0 en el backend
      });
      Alert.alert('Éxito', 'Usuario registrado correctamente');
      setUsuario('');
      setPass('');
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


//VER ALUMNOS
const VerAlumno = () => {
  const [datos, setDatos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const respuesta = await axios.get(
          'https://rutnaback-production.up.railway.app/user/obtenerAlumnos'
        );
        setDatos(respuesta.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    obtenerDatos();
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar Alumno',
      '¿Estás seguro de que deseas eliminar este alumno?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');

              if (!token) {
                Alert.alert('Error', 'Token de autenticación no encontrado');
                return;
              }

              console.log('Token:', token); // Para depuración

              await axios.delete(
                `https://rutnaback-production.up.railway.app/user/eliminarUsuario/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              );

              setDatos(datos.filter((alumno) => alumno.id !== id));
              Alert.alert('Éxito', 'Alumno eliminado correctamente');
            } catch (error) {
              console.error('Error al eliminar el alumno:', error);
              Alert.alert(
                'Error',
                'No se pudo eliminar el alumno. Por favor, intenta nuevamente.'
              );
            }
          },
          style: 'destructive'
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/fondodef.png')}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Admin')}
        >
          <Icon name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Historial</Text>
      </View>
      <FlatList
        data={datos}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={require('../../assets/Usuario.png')} style={styles.image} />
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={styles.usuario}>{item.usuario}</Text>
                <Text style={styles.saldo}>Saldo: ${item.saldo}</Text>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.iconButton}
                >
                  <Icon name="trash" size={24} color="#FF4D4D" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </ImageBackground>
  );
};
//VER EMPLEADOS
const VerEmpleado = () => {
  const [datos, setDatos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const respuesta = await axios.get(
          'https://rutnaback-production.up.railway.app/user/obtenerAdmins'
        );
        setDatos(respuesta.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    obtenerDatos();
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar Empleado',
      '¿Estás seguro de que deseas eliminar este empleado?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');

              if (!token) {
                Alert.alert('Error', 'Token de autenticación no encontrado');
                return;
              }

              console.log('Token:', token); // Para depuración

              await axios.delete(
                `https://rutnaback-production.up.railway.app/user/eliminarUsuario/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              );

              setDatos(datos.filter((empleado) => empleado.id !== id));
              Alert.alert('Éxito', 'Empleado eliminado correctamente');
            } catch (error) {
              console.error('Error al eliminar el empleado:', error);
              Alert.alert(
                'Error',
                'No se pudo eliminar el empleado. Por favor, intenta nuevamente.'
              );
            }
          },
          style: 'destructive'
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/fondodef.png')}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Admin')}
        >
          <Icon name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Empleados</Text>
      </View>
      <FlatList
        data={datos}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={require('../../assets/Usuario.png')} style={styles.image} />
            <View style={styles.cardContent}>
              <View style={styles.userInfo}>
                <Text style={styles.usuario}>{item.usuario}</Text>
                <Text style={styles.rol}>{item.rol}</Text>
              </View>
              <View style={styles.iconsContainer}>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.iconButton}
                >
                  <Icon name="trash" size={24} color="#FF4D4D" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </ImageBackground>
  );
};

//VER RUTAS
const VerRutas = () => {
  const [datos, setDatos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const response = await axios.get(
          'https://rutnaback-production.up.railway.app/rutas'
        );
        setDatos(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchRutas();
  }, []);

  const handleEdit = (id) => {
    const ruta = datos.find((item) => item.id === id);
    if (ruta) {
      navigation.navigate('EditarRuta', { id, destino: ruta.destino });
    } else {
      Alert.alert('Error', 'Ruta no encontrada');
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar Ruta',
      '¿Estás seguro de que deseas eliminar esta ruta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token'); // Obtener el token

              if (!token) {
                Alert.alert('Error', 'Token de autenticación no encontrado');
                return;
              }

              await axios.delete(
                `https://rutnaback-production.up.railway.app/rutas/eliminar/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`// Incluir el token en el encabezado
                  }
                }
              );

              setDatos(datos.filter((ruta) => ruta.id !== id));
              Alert.alert('Éxito', 'Ruta eliminada correctamente');
            } catch (error) {
              console.error('Error al eliminar la ruta:', error);
              Alert.alert(
                'Error',
                'No se pudo eliminar la ruta. Por favor, intenta nuevamente.'
              );
            }
          },
          style: 'destructive'
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/fondodef.png')}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Admin')}
        >
          <Icon name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Historial</Text>
      </View>
      <FlatList
        data={datos}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={require('../../assets/Ruta.png')} style={styles.image} />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.nombre}>{item.destino}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => handleEdit(item.id)}
                    style={styles.iconButton}
                  >
                    <Icon name="pencil" size={24} color="#56ad45" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={styles.iconButton}
                  >
                    <Icon name="trash" size={24} color="#FF4D4D" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.precio}>
                <Text style={styles.precioLabel}>Precio: </Text>
                <Text style={styles.precioValue}>${item.precio}</Text>
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </ImageBackground>
  );
};


// AGREGAR Alumno 
const AgregarAlumno = () => {
  const [usuario, setUsuario] = useState('');
  const [pass, setPass] = useState('');
  const [saldo, setSaldo] = useState('');
  const [error, setError] = useState('');
  const [passError, setPassError] = useState('');
  const selectedRole = 'alumno'; // Ajusta el rol a 'alumno' o el valor deseado

  const handleAgregarUsuario = async () => {
    // Validar que la matrícula sea un número de exactamente 10 dígitos
    if (!/^\d{10}$/.test(usuario)) {
      setError('La matrícula debe ser un número de 10 dígitos.');
      return;
    }

    // Validar que la contraseña no esté vacía
    if (pass.trim() === '') {
      setPassError('La contraseña es requerida.');
      return;
    }

    setError(''); // Limpiar el error si la validación es correcta
    setPassError(''); // Limpiar el error si la validación es correcta

    try {
      const response = await axios.post('https://rutnaback-production.up.railway.app/user/registrarUsuario', {
        usuario,
        pass,
        rol: selectedRole.toLowerCase(),
        saldo
      });
      Alert.alert('Éxito', 'Alumno registrado correctamente');
      setUsuario('');
      setPass('');
      setSaldo('');
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
          <Text style={styles.cardTitle}>Agregar Alumno</Text>
          <TextInput
            style={[styles.input, error ? { borderColor: 'red', borderWidth: 1 } : {}]}
            placeholder="Matrícula"
            placeholderTextColor="#aaa"
            value={usuario}
            onChangeText={(text) => {
              setUsuario(text);
              // Validar en tiempo real si el texto es válido
              if (!/^\d{10}$/.test(text)) {
                setError('La matrícula debe ser un número de 10 dígitos.');
              } else {
                setError('');
              }
            }}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TextInput
            style={[styles.input, passError ? { borderColor: 'red', borderWidth: 1 } : {}]}
            placeholder="Contraseña"
            placeholderTextColor="#aaa"
            secureTextEntry={true}
            value={pass}
            onChangeText={(text) => {
              setPass(text);
              if (text.trim() === '') {
                setPassError('La contraseña es requerida.');
              } else {
                setPassError('');
              }
            }}
          />
          {passError ? <Text style={styles.errorText}>{passError}</Text> : null}
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

///AGREGAR RUTA

const AgregarRuta = () => {
  const [destino, setDestino] = useState('Ruta');
  const [precio, setPrecio] = useState('');

  const handleAgregarRuta = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Error', 'Token de autenticación no encontrado');
        return;
      }

      console.log('Token:', token); // Para depuración

      const response = await axios.post(
        'https://rutnaback-production.up.railway.app/rutas/agregar',
        {
          destino,
          precio
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      Alert.alert('Éxito', 'Ruta agregada correctamente');
      setDestino('Ruta');
      setPrecio('');
    } catch (error) {
      console.error('Error al agregar la ruta:', error); // Log para depuración
      if (error.response) {
        Alert.alert('Error', error.response.data.error);
      } else {
        Alert.alert('Error', 'Error de conexión');
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/fondodef.png')}
      style={styles.screenContainer}
    >
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <MaterialCommunityIcons
            name="map-marker-plus"
            size={48}
            color="#FFB347"
          />
          <Text style={styles.cardTitle}>Agregar Ruta</Text>
          <CustomSelect
            selectedValue={destino}
            onValueChange={(value) => setDestino(value)}
            options={[
              'Aguascalientes',
              'Asientos',
              'Loreto',
              'Ojocaliente',
              'Villa García',
              'Luis Moya',
              'San Pancho',
              'Margaritas',
              'Bimbaletes',
              'Cosio'
            ]}
          />
          <TextInput
            style={styles.input}
            placeholder="Precio"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={precio}
            onChangeText={setPrecio}
          />
          <LinearGradient colors={['#FFB347', '#FFCC70']} style={styles.button}>
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
  const [logs, setLogs] = useState([]);
  const apiUrl = 'https://rutnaback-production.up.railway.app/user/logs'; // Asegúrate de usar la URL correcta

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(apiUrl);
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <ImageBackground source={require('../../assets/fondodef.png')} style={styles.screenContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.welcomeDescription2}>Verifica los detalles de cada transacción realizada en  </Text>
        <Text style={styles.welcomeTitle2}>RUTNA</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Acción</Text>
            <Text style={styles.tableHeaderText}>Detalle</Text>
            <Text style={styles.tableHeaderText}>Fecha</Text>
          </View>
          {logs.map((log, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableRowText}>{log.accion}</Text>
              <Text style={styles.tableRowText}>{log.detalle}</Text>
              <Text style={styles.tableRowText}>{log.fecha}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

//NAVEGACION
const Tab = createBottomTabNavigator();

const Admin = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Inicio') {
          iconName = 'home';
        } else if (route.name === 'Agregar Alumno') {
          iconName = 'account-outline';
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
    <Tab.Screen name="Agregar Alumno" component={AgregarAlumno} />
    <Tab.Screen name="Agregar Usuario" component={AgregarUsuario} />
    <Tab.Screen name="Agregar Ruta" component={AgregarRuta} />
    <Tab.Screen name="Cargar Saldo" component={AgregarSaldo} />
    <Tab.Screen name="Actividad" component={Actividad} />
  </Tab.Navigator>
);
//ESTILOS
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
    fontSize: 16,
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
  logoutContent: {
    
    flexDirection: 'row',
    alignItems: 'flex-start',  // Cambiado de 'flex-end' a 'flex-start'
    justifyContent: 'flex-end',  
    width: '100%', 
    padding: 10,
    
  },
  logoutButton: {
    padding: 1,  // Reducido el padding para que el botón esté más arriba
    flexDirection: 'row',
    alignItems: 'flex-start',  // Cambiado de 'flex-end' a 'flex-start'
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
  
  
  smallCard: {
    width: '50%',
    height:'30%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    marginTop:2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDescriptionS:{
  fontSize:12,
  textAlign: 'center',
  },

});

export default Admin;