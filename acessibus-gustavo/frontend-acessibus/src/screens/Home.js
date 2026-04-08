import React, { useContext, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, ActivityIndicator, FlatList } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import api from '../services/Api';

export default function HomeScreen({ navigation }) {
  const { signOut, user } = useContext(AuthContext);

  const recordingRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    Audio.requestPermissionsAsync();
  }, []);

  function handleSignOut() {
    Alert
  }

  async function startRecording() {
    try {
      console.log('Solicitando permissão...');
      await Audio.requestPermissionsAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      });

      console.log('Iniciando gravação...');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setIsRecording(true);
      console.log("Gravando...");
    } catch (error) {
      console.log("Falha ao iniciar gravação", error);
      Alert.alert("Erro", "Não foi possível acessar o microfone");
      setIsRecording(false);
    }
  }

  async function stopRecordingAndSearch() {
    console.log("Parando gravação...");
    setProcessing(true);
    setIsRecording(false);

    try {
      const recording = recordingRef.current;

      if (!recording) {
        console.log("Erro, nenhuma gravação encontrada no ref");
        setProcessing(false);
        return;
      }

      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();
      console.log('Arquivo salvo em:', uri);

      recordingRef.current = null;

      const formData = new FormData();
      formData.append('audio', {
        uri: uri,
        type: 'audio/m4a',
        name: 'audio_busca.m4a'
      })

      console.log('Enviando para transcrição...');
      const responseTranscricao = await api.post('/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const textoReconhecido = responseTranscricao.data.text;
      console.log("Texto reconhecido:", textoReconhecido);

      if (!textoReconhecido) {
        console.log("Não foi possível entender o que você disse, por favor, tente novamente");
        Speech.speak("Não foi possível entender o que você disse, por favor, tente novamente");
        setProcessing(false);
        setIsRecording(false);
        recordingRef.current = null;
        return;
      }

      console.log('Buscando linhas com o termo:', textoReconhecido);
      const responseBusca = await api.post('/linha/search', { termo: textoReconhecido });
      const linhasEncontradas = responseBusca.data

      if (linhasEncontradas.length > 0) {
        const qtd = linhasEncontradas.length;
        Speech.speak(`Encontrei ${qtd} linhas para ${textoReconhecido}. Vou te falar cada uma.`);

        linhasEncontradas.forEach(linha => {
          Speech.speak(`Nome da linha: ${linha.nome_linha}. Itinerário: ${linha.itinerario}.`);
        });
      } else {
        Speech.speak(`Não encontrei nenhuma linha passando por ${textoReconhecido}.`);
        Alert.alert("Não encontrado", `Nenhuma linha para: "${textoReconhecido}".`);
      }
    } catch (error) {
      console.log("Erro no fluxo de voz", error);
      Speech.speak("Houve um erro na conexão. Tente novamente.");
      Alert.alert("Erro", "Falha ao processar voz.");
    } finally {
      setProcessing(false);
      setIsRecording(false);
      recordingRef.current = null;
    }
  }

  function handleMicButton() {
    if (isRecording) {
      stopRecordingAndSearch();
    } else {
      startRecording();
    }
  }

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

        <Text style={styles.instructionText}>
          {isRecording ? "Gravando... Toque para parar" : processing ? "Processando..." : "Toque para falar o destino"}
        </Text>


        <TouchableOpacity style={styles.micButton}
          onPress={handleMicButton}
          disabled={processing}
        >
          {isRecording ? (
            <Image source={require("../../assets/mic_button_recording.png")} />
          ) : (
            <Image source={require("../../assets/mic_button.png")} />
          ) && processing ? (
            <ActivityIndicator size='large' color='#FFF' />
          ) : (
            <Image source={require("../../assets/mic_button.png")} />
          )}

        </TouchableOpacity>

        <Image source={require("../../assets/soundwave.png")} style={styles.soundwave} />
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

  instructionText: {
    fontSize: 16,
    marginBottom: 30,
    color: '#777'
  },

  logo: {
    width: 120,
    height: 70,
    resizeMode: "contain"
  },

  img: {
    width: 60,
    height: 60,
    resizeMode: "contain"
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  micButton: {
    borderRadius: 200,
    padding: 40,
    marginBottom: 100,
    elevation: 5,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center"
  },

  soundwave: {
    width: 200,
    height: 80,
    resizeMode: "contain"
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

  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#007AFF',
    resizeMode: "cover",
    backgroundColor: '#eee'
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
