import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import type { LoginScreenProps } from '../types/navigation';

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const { signIn } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, senha);
      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/logo-acessibus.png')} style={styles.logo} />
      </View>

      <View style={styles.content}>
        <Image source={require('../../assets/account_circle.png')} />

        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          accessibilityLabel="Campo de email"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          autoCapitalize="none"
          accessibilityLabel="Campo de senha"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading} accessibilityRole="button" accessibilityLabel="Entrar">
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Entrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('SignUp')} accessibilityRole="button" accessibilityLabel="Criar conta">
          <Text style={styles.linkText}>Ou clique aqui para criar conta</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navIcon} accessibilityRole="tab" accessibilityLabel="Home">
          <Image source={require('../../assets/home.png')} style={styles.img} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Recents')} style={styles.navIcon} accessibilityRole="tab" accessibilityLabel="Recentes">
          <Image source={require('../../assets/recents.png')} style={styles.img} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Favorites')} style={styles.navIcon} accessibilityRole="tab" accessibilityLabel="Favoritos">
          <Image source={require('../../assets/favorites.png')} style={styles.img} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  logo: {
    width: 120,
    height: 70,
    resizeMode: 'contain',
    left: 0,
  },
  img: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    marginBottom: 15,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 25,
    width: '60%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 10,
    padding: 10,
  },
  linkText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 60,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  },
  navIcon: {
    paddingLeft: 35,
    paddingRight: 35,
    paddingBottom: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#000',
  },
});

export default LoginScreen;
