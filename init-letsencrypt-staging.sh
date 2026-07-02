#!/bin/bash

# Script de inicialização para gerar o primeiro certificado SSL via Let's Encrypt (STAGING / TESTES)
# Use este script para testar a conectividade, portas e DNS sem gastar o limite de requisições (rate limit) de produção.
# Os certificados gerados aqui serão considerados "não confiáveis" pelo navegador, mas provam que a infraestrutura está correta.

if ! docker compose version > /dev/null 2>&1; then
  echo 'Erro: docker compose não está instalado.' >&2
  exit 1
fi

# Carrega as variáveis do arquivo .env automaticamente
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

domains=($DOMAIN)
rsa_key_size=4096
data_path="./data/certbot"
email="$EMAIL"

if [ -z "$DOMAIN" ]; then
    echo "ERRO: A variável DOMAIN não está configurada. Por favor, adicione-a no arquivo .env ou exporte-a."
    exit 1
fi

if [ -d "$data_path" ]; then
  read -p "Já existe uma pasta de dados do certbot. Deseja substituir os certificados existentes? (s/N) " decision
  if [ "$decision" != "s" ] && [ "$decision" != "S" ]; then
    echo "Saindo..."
    exit 0
  fi
fi

echo "### Preparando diretório do let's encrypt (STAGING)..."
mkdir -p "$data_path/conf/live/$DOMAIN"

echo "### Baixando parâmetros TLS recomendados..."
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"

echo "### Gerando certificado RSA dummy (falso) para iniciar o Nginx..."
docker compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\
    -keyout '/etc/letsencrypt/live/$DOMAIN/privkey.pem' \
    -out '/etc/letsencrypt/live/$DOMAIN/fullchain.pem' \
    -subj '/CN=localhost'" certbot

echo "### Iniciando o Nginx..."
docker compose up --force-recreate -d frontend

echo "### Deletando os certificados dummy..."
docker compose run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$DOMAIN && \
  rm -Rf /etc/letsencrypt/archive/$DOMAIN && \
  rm -Rf /etc/letsencrypt/renewal/$DOMAIN.conf" certbot

echo "### Requisitando certificado Let's Encrypt verdadeiro (MODO STAGING)..."
domain_args="-d $DOMAIN"

# Ajuste do email se fornecido
case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac

docker compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $email_arg \
    $domain_args \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --staging \
    --force-renewal" certbot

echo "### Recarregando Nginx..."
docker compose exec frontend nginx -s reload

echo "Pronto! O HTTPS (Staging/Testes) está ativo e configurado. Verifique no navegador se o domínio carrega (com aviso de certificado de teste)."
