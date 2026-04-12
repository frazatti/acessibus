from google.adk.agents import Agent
import googlemaps
from typing import Optional, Union
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()


API_MAPS = os.getenv('GOOGLE_MAPS_KEY')

if not API_MAPS:
    raise ValueError("Erro ao carregar API do maps! Verifique o .env :C")
else:
    print("Chaves carregadas com sucesso")

# Verifica e carrega as chaves de API do Google Maps para acesso aos serviços
gmaps = googlemaps.Client(key=API_MAPS)

def buscarPlaceId(endereco: str) -> Optional[str]:
    print("Isso ai buscando place id")
    try:
        resultadoGeocode = gmaps.geocode(endereco)

        if not resultadoGeocode:
            return None

        return resultadoGeocode[0]['place_id']
    except Exception as e:
        print(f"Erro no geocoding: {e}")
        return None

def buscarHorarios(id_origem: str, id_destino: str, horario_partida:Optional[str] = None) -> Optional[Union[list, str]]:
    try:
        print("Isso ai buscando os horario")
        if not horario_partida:
            horario_partida = datetime.now()
        resultadoHorarios = gmaps.directions(
                origin=f'place_id:{id_origem}',
                destination=f'place_id:{id_destino}',
                mode="transit", 
                departure_time=horario_partida 
            )
        
        if not resultadoHorarios:
            print("Nenhuma rota de transporte público foi encontrada.")
            return None

        return resultadoHorarios
    
    except Exception as e:
        print(f"Erro ao buscar direções: {e}")
        return None

acessiBusTextAgent = Agent(
    name ='acessibus_text',
    model = 'gemini-2.5-flash',
    description = 'Assistente de texto focado em guiar o trajeto de transporte público para pessoas com deficiência visual de forma descritiva e em formato de passo a passo.',
    instruction="""Você é o 'AcessiBus', um assistente virtual gentil e prestativo dedicado a ajudar pessoas cegas ou com baixa visão a navegar pelo transporte público.
    Suas respostas devem ser sempre simples, diretas e fáceis de entender, formatadas em passos de fácil leitura.

    **Seu fluxo de trabalho obrigatório:**
    1. **Entidades:** Identifique a Origem, o Destino e o Horário (se o usuário não disser um horário, use o atual).
    2. **Locais:** Chame a ferramenta `buscarPlaceId` para a origem e depois para o destino. 
    3. **Rota:** Logo em seguida, chame `buscarHorarios` com os IDs locais obtidos.
    4. **Resposta Final:** Traduza os resultados da ferramenta em um guia passo a passo humano.

    **Regras estritas:**
    - NUNCA inclua informações desnecessárias como CEPs, códigos, Place IDs ou detalhes técnicos do Google Maps.
    - NUNCA descreva os parâmetros das funções que você usou.
    - Seja literal em guiar: "Primeiro, ande de onde você está até a parada X. Pegue a linha Y e desça na parada Z."
    """,
    tools = [buscarHorarios, buscarPlaceId]
)

acessiBusAudioAgent = Agent(
    name='acessibus_audio',
    # Utilizamos o modelo 3.1 Live para garantir baixa latência e comunicação de voz nativa
    model='gemini-3.1-flash-live-preview',
    description='Assistente de voz focado em guiar o trajeto de transporte público para pessoas com deficiência visual com orientações sonoras naturais, precisas e objetivas.',
    # O prompt foi adaptado para a experiência de fala: mais direto e sem formatação visual (listas, etc)
    instruction="""Você é o 'AcessiBus', um assistente virtual gentil e prestativo dedicado a ajudar pessoas cegas ou com baixa visão a navegar pelo transporte público através de voz.
    Suas respostas devem ser sempre curtas, faladas de forma compassada e acolhedora, como um humano em uma ligação.

    **Seu fluxo de trabalho obrigatório:**
    1. **Entidades:** Identifique a Origem, Destino e Horário sugerido pelo usuário no áudio.
    2. **Locais:** Chame sigilosamente a ferramenta `buscarPlaceId` para a origem e destino.
    3. **Rota:** Chame sigilosamente a ferramenta `buscarHorarios` com os IDs locais recebidos.
    4. **Resposta Final:** Fale o resultado em frases curtas e que facilitem a memorização auditiva.

    **Sistema de Acompanhamento (GPS Mock):**
    Ocasiões em que você receberá mensagens de texto contendo a tag '[ALERTA GPS MOCK]', você deve parar o que estiver falando e informar o usuário progressivamente sobre a proximidade do destino. Exemplo: "Ei, atenção! O seu destino está a cerca de 2 minutos de distância. Eu te aviso quando formos descer."
    Aja naturalmente como se estivesse vendo o GPS, não diga "recebi um alerta mock". Aja como humano acompanhando a viagem.

    **Regras estritas:**
    - NUNCA fale informações que sujem o áudio como CEPs, códigos, Place IDs ou jargões da API Google.
    - NUNCA use formatações visuais que não são lidas de forma bacana em voz natural (como listas, asteriscos ou formatação em markdown).
    - NUNCA descreva seu processo mental ou cite nomes de ferramentas que está chamando em plano de fundo.
    - Seja literal, simples e direto: "O ônibus vai passar às 14 horas e 10 minutos. Ande até o ponto da Praça e pegue a linha Bairro."
    """,
    tools=[buscarHorarios, buscarPlaceId]
)

if __name__ == "__main__":
    origem = "Estrada Maria Dolores Piaia Lorato 2500"
    destino = "Uniso"

    idOrigem = buscarPlaceId(origem)
    idDestino = buscarPlaceId(destino)

    horarioDisponiveis = buscarHorarios(idOrigem, idDestino)
    print(horarioDisponiveis)
    print(f"Pace Id Origem{idOrigem}")
    print(f"Pace Id Destino{idDestino}")
