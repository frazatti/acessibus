import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/Api';
import type { FavoritesScreenProps } from '../types/navigation';
import type { BusLine } from '../types/api';

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
  const { signed, user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState<BusLine[]>([]);

  useEffect(() => {
    if (signed) {
      api.get('/favorites').then((res) => setFavorites(res.data)).catch((err) => console.log(err));
    }
  }, [signed]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/logo-acessibus.png')} style={styles.logo} />

        <TouchableOpacity onPress={() => (user ? navigation.navigate('User') : navigation.navigate('LoginScreen'))} accessibilityRole="button" accessibilityLabel={user ? 'Ver perfil' : 'Fazer login'}>
          <Image source={user && user.foto ? { uri: user.foto } : require('../../assets/account_circle.png')} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {!signed ? (
          <View style={styles.notLogged}>
            <Text style={styles.text}>Você não está logado! Entre para ter acesso às linhas favoritadas</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginScreen')} accessibilityRole="button" accessibilityLabel="Entrar">
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listWrapper}>
            <Text style={styles.title}>Linhas favoritas</Text>
            <View style={styles.listBox}>
              {favorites.length === 0 ? (
                <Text style={styles.emptyText}>
                  Nenhuma linha favoritada foi encontrada
                </Text>
              ) : null}
              <FlatList
                data={favorites}
                keyExtractor={(item) => String(item.id)}
                showsVerticalScrollIndicator
                renderItem={({ item }) => (
                  <View style={styles.itemContainer}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemTitleText}>{item.nome_linha}</Text>
                      <Text style={styles.itemSubtitle}>{item.itinerario}</Text>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>
        )}
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
  notLogged: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  logo: {
    width: 120,
    height: 70,
    resizeMode: 'contain',
  },
  img: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    padding: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#007AFF',
    resizeMode: 'cover',
    backgroundColor: '#eee',
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
  listWrapper: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: '50%',
  },
  listBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 10,
  },
  itemTitleText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemSubtitle: {
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    padding: 20,
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default FavoritesScreen;
