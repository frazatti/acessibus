import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/Api';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UpdateScreen({ navigation }) {
    const { user, setUser } = useContext(AuthContext);

    const [nome, setNome] = useState(user?.nome || '');
    const [email, setEmail] = useState(user?.email || '');
    const [senha, setSenha] = useState(user?.senha || '');
    const [foto, setFoto] = useState(user?.foto || null);
    const [imageBase64, setImageBase64] = useState(null);

    const [loading, setLoading] = useState(false);

    async function handleUpdate() {
        setLoading(true);
        try {
            // Monta o objeto apenas com o que mudou ou é necessário
            const dataToSend = {
                nome,
                email,
                // Só envia senha se o usuário digitou algo novo
                ...(senha ? { senha } : {}),
                // Só envia foto se o usuário escolheu uma nova
                ...(imageBase64 ? { foto: imageBase64 } : {})
            };

            const response = await api.put('/user', dataToSend);
            const updatedUser = response.data;

            // --- PULO DO GATO: ATUALIZAR O CONTEXTO GLOBAL ---
            // O backend devolve o usuário atualizado (mas sem token).
            // Precisamos manter o token antigo e atualizar o resto.

            // 1. Pega o token atual do storage para garantir
            const currentToken = await AsyncStorage.getItem('@RNAuth:token');

            // 2. Cria o novo objeto completo
            const newUserObject = { ...updatedUser, token: currentToken }; // Opcional, depende de como seu user é estruturado

            // 3. Atualiza o Estado Global (A Home vai mudar a foto na hora!)
            setUser(updatedUser);

            // 4. Atualiza o Storage (Para persistir se fechar o app)
            await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(updatedUser));

            Alert.alert("Sucesso", "Perfil atualizado!");
            navigation.goBack(); // Volta para a tela anterior

        } catch (error) {
            console.log(error);
            const msg = error.response?.data?.error || "Não foi possível atualizar.";
            Alert.alert("Erro", msg);
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
                    <Image 
                        source={foto ? { uri: foto } : require("../../assets/account_circle.png")} 
                        style={styles.avatar} 
                    />
                </TouchableOpacity>

                <Text style={styles.title}> Atualizar Perfil </Text>

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

                <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Salvar alterações</Text>}
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
