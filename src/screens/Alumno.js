import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const destinations = ['Aguascalientes', 'Asientos', 'Loreto', 'Ojocaliente', 'Villa García'];

const CustomSelect = ({ selectedValue, onValueChange, options }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectButtonText}>{selectedValue}</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onValueChange(item);
                    setModalVisible(false);
                  }}
                >
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

const Boletos = () => {
  const [saldo, setSaldo] = useState(100); // Aquí puedes agregar la lógica para obtener el saldo real
  const [destino, setDestino] = useState('Selecciona Destino');
  const [matricula, setMatricula] = useState('');

  return (
    <ImageBackground source={require('../../assets/fondodef.png')} style={styles.screenContainer}>
      <View style={styles.saldoContainer}>
        <Text style={styles.saldoText}>Saldo: ${saldo}</Text>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <MaterialCommunityIcons name="ticket" size={48} color="#FFB347" />
          <Text style={styles.cardTitle}>Boletos</Text>
          <TextInput
            style={styles.input}
            placeholder="Matrícula"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={matricula}
            onChangeText={(text) => setMatricula(text)}
          />
          <CustomSelect
            selectedValue={destino}
            onValueChange={(value) => setDestino(value)}
            options={destinations}
          />
          <LinearGradient
            colors={['#FFB347', '#FFCC70']}
            style={styles.button}
          >
            <TouchableOpacity
              style={styles.buttonContent}
              onPress={() => {}}
            >
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </ImageBackground>
  );
};

const Tab = createBottomTabNavigator();

const Alumno = () => (
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
    <Tab.Screen name="Inicio" component={Boletos} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default Alumno;

