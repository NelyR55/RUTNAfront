import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Loading from '../screens/Loading';
import Login from '../screens/Login';
import Admin from '../screens/Admin';  
import Alumno from '../screens/Alumno';  
import Empleado from '../screens/Empleado';  
import VerAlumno from '../screens/VerAlumno';
import VerEmpleado from '../screens/VerEmpleado';
import VerRutas from '../screens/VerRutas';
import EditarRuta from '../screens/EditarRuta';

const Stack = createStackNavigator();

// Configura la navegación principal con la pantalla de carga, login, administración y las pantallas específicas
const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Loading" component={Loading} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Admin" component={Admin} />
    <Stack.Screen name="Alumno" component={Alumno} />
    <Stack.Screen name="Empleado" component={Empleado} />
    <Stack.Screen name="VerRutas" component={VerRutas} />
    <Stack.Screen name="VerAlumno" component={VerAlumno} />
    <Stack.Screen name="VerEmpleado" component={VerEmpleado} />
    <Stack.Screen name="EditarRuta" component={EditarRuta} />
  </Stack.Navigator>
);

export default AppNavigator;
