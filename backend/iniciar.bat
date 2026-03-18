@echo off
:: --- CONFIGURAÇÃO ---
:: Cole aqui o caminho da pasta onde você extraiu o Node v22
SET MEU_NODE=@echo off
:: --- CONFIGURAÇÃO ---
:: Cole aqui o caminho da pasta onde você extraiu o Node v22
SET MEU_NODE=C:\Users\gohv\nodejs-lts\node-v20.19.6-win-x64

:: --- A MÁGICA ---
:: Isso coloca o seu Node na frente de todos os outros temporariamente
SET PATH=%MEU_NODE%;%PATH%

:: --- VERIFICAÇÃO ---
echo ---------------------------------------------------
echo Verificando versao do Node...
node -v
echo (Deve aparecer v22 ou v20 acima. Se aparecer v25, o caminho esta errado)
echo ---------------------------------------------------

:: --- RODAR O PROJETO ---
:: Se quiser que ele já rode o servidor direto, descomente a linha abaixo:
:: npm run dev

:: Mantém a janela aberta para você digitar comandos
cmd /k

:: --- A MÁGICA ---
:: Isso coloca o seu Node na frente de todos os outros temporariamente
SET PATH=%MEU_NODE%;%PATH%

:: --- VERIFICAÇÃO ---
echo ---------------------------------------------------
echo Verificando versao do Node...
node -v
echo (Deve aparecer v22 ou v20 acima. Se aparecer v25, o caminho esta errado)
echo ---------------------------------------------------

:: --- RODAR O PROJETO ---
:: Se quiser que ele já rode o servidor direto, descomente a linha abaixo:
:: npm run dev

:: Mantém a janela aberta para você digitar comandos
cmd /k