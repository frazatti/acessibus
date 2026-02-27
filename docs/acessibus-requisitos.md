# Acessibus

- [ ]  *Tela de cadastro*
- Objetivo
    - Salvar as informações de um usuário no banco de dados utilizando validação e criptografia
- Interface
    - Logo
    - Input *(texto)* Nome
    - Input *(texto)* Email
    - Input *(texto)* Senha
    - Input *(png ou jpeg)* Foto
    - Botão para cadastrar
    - (Opcional) Botão para cadastro com facebook
    - (Opcional) Botão para cadastro com Google
    - Menu
        - Botão para página Home
        - Botão para página recentes
        - Botão para página favoritos
    
- Regras de negócio
    - [ ]  Validação
        - [ ]  Nome, email e senha não podem ser nulos ou estar em branco
        - [ ]  Email deve ser único e ter 1 “@” e 1 “.”
        - [ ]  Senha com tamanho min de 8 char e máx de 20
        - [ ]  Foto somente arquivos png ou jpeg
        - [ ]  Qualquer campo inválido impede o cadastro e retorna a mensagem de erro específica no front-end
    - [ ]  Criptografar senha utilizando hash
    - [ ]  Clicar em cadastrar gera um token e redireciona para tela inicial utilizando o token
    - [x]  Dados do usuário são salvos no banco
- Fluxos
    - Rota: **POST /api/cadastro**
    - Fluxo sucesso:
        - Usuário insere os dados
        - Front-end envia os dados para API
        - API valida e retorna token
        - Front-end salva token em asyncStorage
        - AuthContext logado = true
        - Usuário é redirecionado para página home
    - Fluxo erro:
        - Usuário insere algum dado inválido
            - API retorna 400 bad request
            - Texto vermelho acima do input informando o erro
        - Erro interno
            - API retorna 500 internal server error
            - Alert informando erro

- [ ]  Tela de login
- Objetivo
    - Autenticar usuário e gerar token com base nos dados fornecidos após validação
- Interface
    - Logo
    - Input *(texto)* Email
    - Input *(texto)* Senha
    - Botão para logar
    - (Opcional) Botão para login com facebook
    - (Opcional) Botão para login com Google
    - Menu
        - Botão para página Home
        - Botão para página recentes
        - Botão para página favoritos
- Regras de negócio
    - [ ]  Validação
        - [ ]  Email existe no banco
        - [ ]  Email recebeu texto com 1 “@” e 1 “.”
        - [ ]  O hash da senha inserida é o mesmo no banco para aquele email
    - [ ]  Gerar token se passar nas validações
- Fluxos
    - Rota: **POST /api/auth/login**
    - Fluxo sucesso:
        - Usuário insere os dados
        - Front-end envia os dados para API
        - API valida e retorna token
        - Front-end salva token em asyncStorage
        - AuthContext logado = true
        - Usuário é redirecionado para página home
    - Fluxo erro:
        - Usuário insere algum dado inválido
            - API retorna 400 bad request (dados faltando) OU
            - API retorna 401 Unauthorized para email ou senha incompatíveis com os do banco (SEGURANÇA: NÃO INFORMAR SE É O EMAIL OU A SENHA QUE ESTÁ ERRADA)
            - Texto vermelho acima do input informando o erro
        - Erro interno
            - API retorna 500 internal server error
            - Alert informando erro
            

- [ ]  Tela inicial
- Objetivo
    - Funcionalidade principal. Usuário pode ter acesso sem estar logado. Usuário utiliza botão principal para informar destino que deseja ir ou linha de ônibus que deseja pegar e obtém como retorno a linha de ônibus que leva ao destino, qual o ponto de ônibus mais próximo da localização atual que a linha passa e qual horário estimado do próximo ônibus.
- Interface
    - Logo
    - Renderização condicional:
        - SE usuário logado: botão para acessar o perfil
        - SENÃO: botão para fazer login
    - Botão principal
    - Soundwave, animado conforme o usuário fala no botão principal OU conforme a resposta é retornada
    - Menu
        - Botão para página Home
        - Botão para página recentes
        - Botão para página favoritos
- Regras de negócio
    - [ ]  Pressionar o botão de login redireciona para página de login. Botão de perfil redireciona para perfil.
    - [ ]  PRESSIONAR botão principal ativa funcionalidade de voz. Pressionar novamente para de gravar
    - [ ]  Ao pressionar o botão, passados X minutos o método é encerrado automaticamente
    - [ ]  Integração com API para transcrever áudio em texto e vice-versa
    - [ ]  Integração com modelo de IA para identificar:
        - destino do usuário
        - localização atual
        - Com base nesses dois parâmetros a IA deve retornar um JSON:
        
        ```json
        {
        	"destino": "Prédio Azul, Rua Laranja, 123, Bairro Monte das Ondas",
        	"linha": "1107 - Jardim Clarice/Shopping Iguatemi",
        	"itinerario": "Rua Julia Martins Domingues - Av Gisele Constantino",
        	"sentido": "ida",
        	"pontoProximo": "Rua Amarela, 245, Bairro Alameda 2",
        	"horario": "20h20"
        }
        ```
        
    - [ ]  Verificar se linha retornada já está salva no banco, se não estiver, salvar
    - [ ]  Verificar se existe relacionamento entre usuario e linha, se não, criar, se existir atualizar coluna “ultimo_acesso”
- Fluxos
    - Rota: GET **/api/home**
    - Fluxo sucesso:
        - Verificação se usuário está logado
        - É solicitada permissão do usuário para acesso à localização
        - Usuário aperta o botão principal
        - Áudio do usuário é salvo como mp3 e enviado para API
        - API solicita localização atual do usuário
        - API solicita transcrição de áudio para texto
        - API envia prompt para IA com localização do usuário e texto pedindo que extraia apenas o destino e com base nesses dois parâmetros retorne um JSON contendo: destino, linha, ponto mais próximo e horário estimado para passagem do ônibus
        - API recebe retorno da IA e envia para transcrição em áudio
        - Áudio do retorno é reproduzido no front-end
    - Fluxo erro:
        - Falha em alguma das APIs externas
            - API retorna 503 service unavailable
            - Alert informando erro
        - Algum dos parâmetros ou retornos não pôde ser encontrado
            - API retorna 404
            - Alert informando erro
        - Usuário não permitiu a utilização da localização
            - Pop-up informando que a localização é necessária para ter acesso ao app, usuário pode mudar de ideia (fluxo sucesso) ou continuar
            - APP é fechado
        - Erro interno
            - API retorna 500 internal server error
            - Alert informando erro
            

- [ ]  Tela recentes
- Objetivo
    - Usuário pode ter acesso às últimas linhas que ele utilizou.
- Interface
    - Logo
    - Renderização condicional:
        - SE usuário logado: Últimas linhas acessadas ordenadas pela coluna “ultimo_acesso” de forma decrescente. Cada linha pode ser favoritada com um botão
        - SENÃO: Texto informando que é preciso estar logado para ter acesso às últimas linhas acessadas. Botão que redireciona para tela de login. Link que redireciona para tela de cadastro.
        - SE não existir relacionamento do usuário com alguma linha: texto mostrando que primeiro é necessário pesquisar uma linha para que ela seja adicionada aos recentes
    - Menu
        - Botão para página Home
        - Botão para página recentes
        - Botão para página favoritos
- Regras de negócio
    - [ ]  Verificar se usuário está logado
    - [ ]  Pressionar botão de favoritos muda coluna “favorito” em “usuarios_linhas”
- Fluxos
    - Rota: GET **/api/recents**
    - Fluxo sucesso:
        - Verificação se usuário está logado
        - Verificação se existem relacionamentos do usuario com linhas
        - Ordenanação das linhas que se relacionam com usuario pelo ultimo_acesso de forma decrescente
        - Renderização dos 5 primeiros resultados
    - Fluxo erro:
        - Usuário não está logado
            - API retorna 401 unauthorized
            - Renderização condicional redirecionando para tela de cadastro/login
        - Não existem relacionamentos entre o usuario e linhas
            - API retorna 404
            - Renderização condicional informando sobre os relacionamentos
        - Erro interno
            - API retorna 500 internal server error
            - Alert informando erro
            

- [ ]  Tela favoritos
- Objetivo
    - Usuário pode ter acesso às linhas que ele favoritou.
- Interface
    - Logo
    - Renderização condicional:
        - SE usuário logado: Linhas favoritadas ordenadas pela linha. Botão para adicionar linha aos favoritos
        - SENÃO: Texto informando que é preciso estar logado para ter acesso às linhas favoritadas. Botão que redireciona para tela de login. Link que redireciona para tela de cadastro.
        - SE não existir relacionamento do usuário com alguma linha OU nenhuma das linhas relacionadas está favoritada: texto mostrando que primeiro é necessário favoritar uma linha. Botão para adicionar linha aos favoritos
    - Botão para adicionar linha aos favoritos: abre um pop-up com botão semelhante ao principal mas menor. Depois do usuário solicitar uma linha o pop-up é excluído e surge outro com as linhas mais próximas do que o usuário solicitou.
    - Botão para excluir uma linha dos favoritos
    - Menu
        - Botão para página Home
        - Botão para página recentes
        - Botão para página favoritos
- Regras de negócio
    - [ ]  Verificar se usuário está logado
    - [ ]  Pressionar botão de excluir linha dos favoritos muda coluna “favorito” para false
    - [ ]  Ao usuário apertar para adicionar uma linha aos favoritos ocorre um fluxo semelhante ao da página inicial
- Fluxos
    - Rota: GET **/api/favorites**
    - Fluxo sucesso:
        - Verificação se usuário está logado
        - Verificação se existem relacionamentos do usuario com linhas
        - Verificação se linhas relacionadas ao usuário possuem “favorito” como true
        - Linhas renderizadas ordenadas por “nome_linha”
        - Ao usuário clicar em adicionar linha aos favoritos um modal com um botão semelhante ao da página principal mas menor é criado
        - Usuário solicita por uma linha
        - API transcreve áudio do usuário em texto
        - API envia prompt para IA solicitando a linha de ônibus do texto:
        
        ```json
        {
        	"linha": "59"
        }
        ```
        
        - API procura no banco de dados
        
        ```sql
        SELECT * FROM linhas where nome_linha LIKE %{retorno}% AND favorito = false
        ```
        
        - API retorna para o front-end
        - Front-end mostra lista em um novo modal
        - Clicar em uma linha verifica se existe relacionamento, se não existir ele é criado e linha favoritada
    - Fluxo erro:
        - Usuário não está logado
            - API retorna 401 unauthorized
            - Renderização condicional redirecionando para tela de cadastro/login
        - Não existem relacionamentos entre o usuario e linhas
            - API retorna 404
            - Renderização condicional informando sobre os relacionamentos
        - Não foi encontrada nenhuma linha com base na solicitação para adicionar
            - API retorna 404
            - modal informa que nenhuma linha foi encontrada e pede para que usuário tente novamente
        - Falha em alguma das APIs externas
            - API retorna 503 service unavailable
            - Alert informando erro
        - Erro interno
            - API retorna 500 internal server error
            - Alert informando erro
            

- [ ]  Tela perfil
- Objetivo
    - Usuário pode ter acesso ao próprio perfil e linhas relacionadas
- Interface
    - Logo
    - Foto de perfil do usuário
    - Nome
    - Renderização condicional:
        - SE existir relacionamento do usuário com alguma linha: Mostrar linhas relacionadas
        - SENÃO: Texto informando que não há nenhuma linha relacionada e que é preciso pesquisar uma linha para que um relacionamento seja criado
    - Botão para editar perfil
    - Menu
        - Botão para página Home
        - Botão para página recentes
        - Botão para página favoritos
- Regras de negócio
    - [ ]  Ao abrir a tela verificar se existem relacionamentos entre usuario e alguma linha
- Fluxos
    - Rota: GET **/api/user/id**
    - Fluxo sucesso:
        - Verificação se existem relacionamentos do usuario com linhas
        - Renderização de todos os relacionamentos
        - Usuário clicar em editar perfil redireciona para tela de editar perfil
    - Fluxo erro:
        - Não existem relacionamentos entre o usuario e linhas
            - API retorna 404
            - Renderização condicional informando sobre os relacionamentos
        - Erro interno
            - API retorna 500 internal server error
            - Alert informando erro
            

- [ ]  Tela atualizar perfil
- Objetivo
    - Usuário pode atualizar próprio perfil
- Interface
    - Logo
    - Input *(png ou jpeg)* Foto
    - Input *(texto)* Nome
    - Input *(texto)* Email
    - Input *(texto)* Senha
    - Botão para atualizar
    - Menu
        - Botão para página Home
        - Botão para página recentes
        - Botão para página favoritos
- Regras de negócio
    - [ ]  Ao entrar na tela excluir token do usuário e solicitar login para garantir a segurança
    - [ ]  Todos os campos exceto a senha estarão preenchidos, usuário pode alterar o que quiser
    - [ ]  Campos são validados da mesma forma que no cadastro
    - [ ]  Se email já existir no banco de dados e for diferente do atual não permitir atualização
- Fluxos
    - Rota: GET **/api/user/id**
    - Fluxo sucesso:
        - Verificação se existem relacionamentos do usuario com linhas
        - Renderização de todos os relacionamentos
        - Usuário clicar em editar perfil redireciona para tela de editar perfil
    - Fluxo erro:
        - Não existem relacionamentos entre o usuario e linhas
            - API retorna 404
            - Renderização condicional informando sobre os relacionamentos
        - Erro interno
            - API retorna 500 internal server error
            - Alert informando erro