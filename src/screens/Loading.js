import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Loading = ({ navigation }) => {
  const colorAnim = new Animated.Value(0);  // Valor inicial para el cambio de color: 0
  const scaleAnim = new Animated.Value(1);  // Valor inicial para el escalado: 1
  const bounceAnim = new Animated.Value(0); // Valor inicial para el rebote: 0

  useEffect(() => {
    async function prepare() {
      // Simular la carga de datos
      await new Promise(resolve => setTimeout(resolve, 7000));
      navigation.replace('Login');
    }

    // Animaciones para color, escalado y rebote
    Animated.parallel([
      Animated.loop(
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    prepare();
  }, [navigation]);

  const logoColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ff914d', '#fff']
  });

  const bounceTranslate = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20]
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ff914d', '#ff914d']}  // Gradiente en tonos naranja
        style={styles.background}
      />
      <Animated.View 
        style={{ 
          ...styles.logoContainer, 
          transform: [
            { scale: scaleAnim },
            { translateY: bounceTranslate }
          ] 
        }}
      >
        <Animated.Image 
          source={require('../../assets/logo.png')} 
          style={[styles.logo, { tintColor: logoColor }]} 
        />
      </Animated.View>
      <Animated.Text style={[styles.loadingText, { color: logoColor }]}>
        CARGANDO...
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',  // Color de fondo de reserva
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  logo: {
    width: 250,  // Tamaño ajustado del logo
    height: 250,
    resizeMode: 'contain',
  },
  loadingText: {
    marginTop: 90,
    fontSize: 22,
    fontWeight: 'bold',  // Grosor de la fuente
  }
});

export default Loading;

