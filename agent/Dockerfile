FROM python:3.12-slim

WORKDIR /app

# Instala dependências do sistema necessárias para algumas libs python
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copia requisitos e instala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código fonte
COPY . .

# Expõe a porta que o FastAPI usará internamente
EXPOSE 8000

# Variáveis de ambiente padrão
ENV MODULE_NAME=main
ENV VARIABLE_NAME=app
ENV PORT=8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
