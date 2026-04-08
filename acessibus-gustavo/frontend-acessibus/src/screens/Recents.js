import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/Api';

export default function RecentsScreen({ navigation }) {
    const { signed, user } = useContext(AuthContext);

    console.log(signed)

    const [recents, setRecents] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    async function handleFavButton(linhaId) {
        try {

            const response = await api.post('/favorite', { linhaId });

            loadRecents();

        } catch (error) {
            console.log("Erro ao favoritar:", error);
            Alert.alert("Erro", "Não foi possível favoritar a linha.")
        }
    }

    function loadRecents() {

        if (loadingData) return;

        setLoadingData(true);
        api.get('/recents')
            .then(res => {
                const dados = Array.isArray(res.data) ? res.data : [];
                setRecents(dados);
            })
            .catch(err => {
                console.log("Erro ao buscar recentes:", err);
                setRecents([]);
            })
            .finally(() => setLoadingData(false));
    }

    useEffect(() => {
        if (signed) {
            loadRecents();
        }
    }, [signed]);


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require("../../assets/logo-acessibus.png")} style={styles.logo} />

                <TouchableOpacity onPress={() => { user ? navigation.navigate("User") : navigation.navigate("LoginScreen") }}>
                    <Image
                        source={
                            user && user.foto
                                ? { uri: user.foto }
                                : require("../../assets/account_circle.png")
                        }
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {!signed ? (
                    <View style={styles.notLogged}>
                        <Text style={styles.text}> Você não está logado! Entre para ter acesso às últimas linhas acessadas </Text>

                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("LoginScreen")}>
                            <Text style={styles.buttonText}>Entrar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.listWrapper}>
                        <Text style={styles.title}>Recentes</Text>
                        <View style={styles.listBox}>
                            {loadingData ? (
                                <ActivityIndicator color="#000" size="large" style={{ marginTop: 20 }} />
                            ) : !recents || recents.length == 0 ? (
                                <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16, padding: 20, color: '#000' }}>
                                    Nenhuma linha foi acessada. Acesse uma linha para ver o histórico
                                </Text>
                            ) : (
                                <FlatList
                                    data={recents}
                                    keyExtractor={item => String(item.id)}
                                    showsVerticalScrollIndicator={true}
                                    renderItem={({ item }) => (
                                        <View style={styles.itemContainer}>
                                            <View style={{ flex: 1, paddingRight: 10 }}>
                                                <Text style={styles.itemTitle}>{item.nome_linha || item.nome}</Text>
                                                <Text style={{ color: '#555' }}>{item.itinerario}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => handleFavButton(item.id)}>
                                                <Image style={styles.favButton} source={item.favorito ? require("../../assets/favorited.png") : require("../../assets/fav_button.png")} />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                            )}
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.navIcon}>
                    <Image source={require("../../assets/home.png")} style={styles.img} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Recents")} style={styles.navIcon}>
                    <Image source={require("../../assets/recents.png")} style={styles.img} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Favorites")} style={styles.navIcon}>
                    <Image source={require("../../assets/favorites.png")} style={styles.img} />
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: "#ccc"
    },

    logo: {
        width: 120,
        height: 70,
        resizeMode: "contain"
    },

    text: {
        fontSize: 16,
        textAlign: "center",
        padding: 50
    },

    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10
    },

    img: {
        width: 60,
        height: 60,
        resizeMode: "contain"
    },

    favButton: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },

    content: {
        flex: 1,
        width: '100%'
    },

    listWrapper: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: '50%'
    },

    listBox: {
        flex: 1, // Ocupa todo o espaço disponível dentro do wrapper
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        overflow: 'hidden'
    },

    notLogged: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 100
    },

    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#007AFF',
        resizeMode: "cover",
        backgroundColor: '#eee'
    },

    navbar: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        position: "absolute",
        bottom: 60,
        borderBottomColor: "#000",
        borderBottomWidth: 1
    },

    navIcon: {
        paddingLeft: 35,
        paddingRight: 35,
        paddingBottom: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderColor: "#000"
    },

    button: {
        backgroundColor: "#007AFF",
        padding: 15,
        borderRadius: 25,
        width: "60%",
        alignItems: "center",
        marginBottom: 20
    },

    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    },

    itemContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#e0e0e0', // Borda mais suave entre itens
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff' // Fundo branco para o item contrastar com o cinza da caixa
    },

    itemTitle: {
        fontWeight: 'bold',
        fontSize: 12
    }
});
