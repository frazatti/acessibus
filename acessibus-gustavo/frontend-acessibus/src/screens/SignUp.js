import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import api from '../services/Api';

export default function SignUpScreen({ navigation }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [foto, setFoto] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);

    const [loading, setLoading] = useState(false);

    async function handleSignUp() {
        if (!nome, !email, !senha) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios");
            return;
        }

        setLoading(true);
        try {
            await api.post('/user', {
                nome,
                email,
                senha,
                foto: imageBase64
            });
            Alert.alert("Sucesso", "Conta criada com sucesso! Redirecionando para página de login.");
            navigation.navigate('LoginScreen');
        } catch (error) {
            console.log(error)
            const message = error.response?.data?.error || "Não foi possível realizar o cadastro."
            Alert.alert("Erro", message)
        } finally {
            setLoading(false);
        }
    }

    const pickImage = async () => {
        try {
            // 1. Pede permissão
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para escolher sua foto.');
                return;
            }

            // 2. Abre a galeria
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1], // Quadrada
                quality: 0.5,   // Qualidade média
                base64: true,   // Importante: pede o texto da imagem
            });

            console.log("Resultado do Picker:", result.canceled ? "Cancelado" : "Sucesso");

            // 3. Verifica se o usuário não cancelou e se tem assets
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedImage = result.assets[0];

                // Atualiza o estado visual (URI)
                setFoto(selectedImage.uri);

                // Atualiza o estado de dados (Base64) com o prefixo correto
                setImageBase64(`data:image/jpeg;base64,${selectedImage.base64}`);
            }
        } catch (error) {
            console.log("Erro ao selecionar imagem:", error);
            Alert.alert("Erro", "Não foi possível selecionar a imagem.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require("../../assets/logo-acessibus.png")} style={styles.logo} />
            </View>

            <View style={styles.content}>
                <TouchableOpacity onPress={pickImage}>
                    {foto ? (
                        <Image source={{ uri: foto }} style={styles.avatar} />
                    ) : (
                        <Image source={require("../../assets/add_picture.png")} style={{ marginBottom: 20, width: 80, height: 80, resizeMode: 'contain' }} />
                    )}
                </TouchableOpacity>

                <Text style={styles.title}> Cadastre-se </Text>

                <TextInput style={styles.input}
                    placeholder='Nome'
                    value={nome}
                    onChangeText={setNome}
                />

                <TextInput style={styles.input}
                    placeholder='Email'
                    keyboardType='email-address'
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize='none'
                />

                <TextInput style={styles.input}
                    placeholder='Senha'
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                    autoCapitalize='none'
                />

                <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
                </TouchableOpacity>
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
        paddingTop: 60,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: "#ccc"
    },

    logo: {
        width: 120,
        height: 70,
        resizeMode: "contain",
        left: 0
    },

    img: {
        width: 60,
        height: 60,
        resizeMode: "contain"
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc'
    },

    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        bottom: 100
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20
    },

    input: {
        width: "80%",
        borderWidth: 1,
        borderColor: "#000",
        padding: 10,
        marginBottom: 15,
        borderRadius: 4
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

    socialContainer: {
        flexDirection: "row",
        gap: 20,
        marginBottom: 40
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
    }
});
