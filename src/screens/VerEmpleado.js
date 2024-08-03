import React from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const datos = [
  { id: '1', nombre: 'Juan Pérez', acciones: 'Editar', imagen: require('../../assets/Usuario.png') },
  { id: '2', nombre: 'Jose Gómez', acciones: 'Editar', imagen: require('../../assets/Usuario.png') },
  // Agrega más datos aquí
];

const VerEmpleado = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground 
      source={require('../../assets/fondodef.png')} 
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Admin')}>
          <Icon name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Historial</Text>
      </View>
      <FlatList
        data={datos}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.imagen} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <TouchableOpacity onPress={() => console.log('Editar')}>
                <Text style={styles.acciones}>{item.acciones}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40, // Mayor margen superior para el encabezado
    paddingBottom: 20, // Espacio debajo del título
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-start', // Alinea el título a la izquierda
    flex: 1,
    marginLeft: 77, // Margen a la izquierda del título
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginTop: 20,  // Margen superior para las tarjetas
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  cardContent: {
    marginLeft: 16,
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    color: '#000',
    marginBottom: 4,
  },
  acciones: {
    fontSize: 16,
    color: '#FFB347',
  },
});

export default VerEmpleado;

