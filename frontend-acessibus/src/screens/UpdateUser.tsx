import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/Api';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UpdateScreenProps } from '../types/navigation';

const UpdateScreen: React.FC<UpdateScreenProps> = ({ navigation }) => {
  const { user, setUser } = useContext(AuthContext);

  const [nome, setNome] = useState<string>(user?.nome ?? '');
  const [email, setEmail] = useState<string>(user?.email ?? '');
  const [senha, setSenha] = useState<string>('');
  const [foto, setFoto] = useState<string | null>(user?.foto ?? null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleUpdate() {
    setLoading(true);
    try {
      const dataToSend = {
        nome,
        email,
        ...(senha ? { senha } : {}),
        ...(imageBase64 ? { foto: imageBase64 } : {}),
      };

      const response = await api.put('/user', dataToSend);
      const updatedUser = response.data;

      setUser(updatedUser);
      await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(updatedUser));

      Alert.alert('Sucesso', 'Perfil atualizado!');
      navigation.goBack();
    } catch (error: unknown) {
      console.log(error);
      const axiosError = error as { response?: { data?: { error?: string } } };
      const msg = axiosError.response?.data?.error || 'Não foi possível atualizar.';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  }

  const pickImage = async (): Promise<void> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para escolher sua foto.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setFoto(selectedImage.uri);

        if (selectedImage.base64) {
          setImageBase64(`data:image/jpeg;base64,${selectedImage.base64}`);
        }
      }
    } catch (error: unknown) {
      console.log('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/logo-acessibus.png')} style={styles.logo} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity onPress={pickImage} accessibilityRole="button" accessibilityLabel="Selecionar foto de perfil">
          <Image source={foto ? { uri: foto } : require('../../assets/account_circle.png')} style={styles.avatar} />
        </TouchableOpacity>

        <Text style={styles.title}>Atualizar Perfil</Text>

        <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} accessibilityLabel="Campo nome" />

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          accessibilityLabel="Campo email"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          autoCapitalize="none"
          accessibilityLabel="Campo senha"
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading} accessibilityRole="button" accessibilityLabel="Salvar alterações">
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Salvar alterações</Text>}
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
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

export default UpdateScreen;
