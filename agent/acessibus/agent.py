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

#Configuração da chave de API do maps
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

root_agent = Agent(
    name ='acessibus',
    model = 'gemini-2.0-flash',
    description = 'Assistente do aplicativo acessibus, que ajuda pessoas cegas ou com baixa visão a pegarem onibus na cidade, fornecendo horários e instruções para o usuário',
    instruction = "Seu plano de ação para guiar usuários do AcessiBus é o seguinte:Coletar Entidades: Identifique a Origem e o Destino na pergunta do usuário. Verifique também se um Horário de Partida específico foi mencionado.Validar Locais (Tool 1): Use a ferramenta buscarPlaceId(endereco) tanto para a Origem quanto para o Destino. Você precisa obter os place_id exatos antes de prosseguir.Buscar Rota (Tool 2): Chame a ferramenta buscarHorarios(id_origem, id_destino, horario_partida).Se o usuário não informou um horário, a ferramenta automaticamente usará o horário atual, nesse caso passar apenas os ids. Interpretar e Responder (Sua Tarefa Principal): A ferramenta buscarHorarios retornará dados complexos. Sua missão é traduzir esses dados em uma resposta humana, simples e acessível.Formato da Resposta: Forneça um guia passo a passo. Seja muito claro e literal, como se estivesse guiando alguém que não pode ver.Exemplo de Resposta: 'OK. O próximo ônibus sai às 14:10. Primeiro, caminhe 5 minutos até o Ponto X. Pegue o ônibus 'Linha 53 - Nome' e desça após 7 paradas, no Ponto Y. De lá, caminhe 2 minutos até seu destino, sob hipótese alguma fale sobre seu processo de pensamento e informe por exemplo o place Id de algo ou fale que está procurando o place id, apenas informe que vai procurar a melhor rota",
    tools = [buscarHorarios, buscarPlaceId]
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
