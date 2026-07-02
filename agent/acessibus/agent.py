from google.adk.agents import Agent
import googlemaps
from typing import Optional, Union
from datetime import datetime
from dotenv import load_dotenv, find_dotenv
import os

# find_dotenv() busca o arquivo .env navegando para as pastas pais até a raiz
load_dotenv(find_dotenv())


API_MAPS = os.getenv('GOOGLE_MAPS_KEY')
TEXT_MODEL = os.getenv('TEXT_MODEL', 'gemini-2.5-flash')
AUDIO_MODEL = os.getenv('AUDIO_MODEL', 'gemini-3.1-flash-live-preview')

if not API_MAPS:
    raise ValueError("Erro ao carregar API do maps! Verifique o .env :C")
else:
    print("Chaves carregadas com sucesso")

# Verifica e carrega as chaves de API do Google Maps para acesso aos serviços
gmaps = googlemaps.Client(key=API_MAPS)

def buscarPlaceId(endereco: str, tool_context=None) -> Optional[str]:
    print("Isso ai buscando place id")
    try:
        resultadoGeocode = gmaps.geocode(endereco)

        if not resultadoGeocode:
            return None

        # Tenta salvar as coordenadas no estado da sessão (se houver contexto)
        if tool_context and hasattr(tool_context, "state"):
            try:
                location = resultadoGeocode[0]['geometry']['location']
                lat = location['lat']
                lng = location['lng']
                tool_context.state['target_lat'] = lat
                tool_context.state['target_lng'] = lng
                print(f"Salvo coordenadas do destino '{endereco}' no estado: lat={lat}, lng={lng}", flush=True)
            except Exception as se:
                print(f"Erro ao salvar coordenadas no estado via geocode: {se}", flush=True)

        return resultadoGeocode[0]['place_id']
    except Exception as e:
        print(f"Erro no geocoding: {e}")
        return None

def buscarHorarios(id_origem: str, id_destino: str, horario_partida:Optional[str] = None, tool_context=None) -> Optional[Union[list, str]]:
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

        # Tenta salvar as coordenadas finais do destino a partir da rota
        if resultadoHorarios and tool_context and hasattr(tool_context, "state"):
            try:
                end_loc = resultadoHorarios[0]['legs'][0]['end_location']
                tool_context.state['target_lat'] = end_loc['lat']
                tool_context.state['target_lng'] = end_loc['lng']
                print(f"Salvo coordenadas finais do destino via directions no estado: lat={end_loc['lat']}, lng={end_loc['lng']}", flush=True)
            except Exception as se:
                print(f"Erro ao salvar coordenadas no estado via directions: {se}", flush=True)

        return resultadoHorarios
    
    except Exception as e:
        print(f"Erro ao buscar direções: {e}")
        return None

acessiBusTextAgent = Agent(
    name ='acessibus_text',
    model = TEXT_MODEL,
    description = 'Assistente de texto focado em guiar o trajeto de transporte público para pessoas com deficiência visual de forma descritiva e em formato de passo a passo.',
    instruction="""Você é o 'AcessiBus', um assistente virtual focado em ajudar pessoas com deficiência visual a navegar pelo transporte público.

    **Regras de Comunicação (MUITO IMPORTANTE):**
    - Seja EXTREMAMENTE breve, direto e use linguagem do dia a dia.
    - Dê as instruções em formato de Markdown usando **negrito** para destacar os nomes dos locais e ônibus.
    - Formate em bullet points curtos para facilitar a leitura.

    **Fluxo de Trabalho:**
    1. Use `buscarPlaceId` para origem e destino.
    2. Use `buscarHorarios` para obter a rota.
    3. Retorne apenas o passo-a-passo. NUNCA cite os dados brutos da API, place IDs, nem explique as ferramentas usadas.
    """,
    tools = [buscarHorarios, buscarPlaceId]
)

acessiBusAudioAgent = Agent(
    name='acessibus_audio',
    # Utilizamos o modelo Live para garantir baixa latência e compatibilidade com o google-adk
    model=AUDIO_MODEL,
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
