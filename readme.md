# Aplicativo de Previsão do Tempo

Um aplicativo responsivo de previsão do tempo que exibe as condições climáticas atuais, previsão para 5 dias e informações sobre a qualidade do ar para João Pessoa, Brasil.

## Descrição

Esta aplicação fornece dados meteorológicos em tempo real, incluindo:
- Temperatura atual
- Condições climáticas com ícones
- Índice UV
- Índice de qualidade do ar
- Previsão do tempo para 5 dias com ícones e temperaturas

O aplicativo muda seu gradiente de fundo com base na hora do dia para proporcionar uma experiência mais imersiva (manhã/dia, pôr do sol, noite).

## Tecnologias Utilizadas

- **HTML5**: Estrutura da aplicação web
- **CSS3**: Estilização com design responsivo para dispositivos móveis e desktop
- **JavaScript**: Carregamento de conteúdo dinâmico e processamento de dados
- **APIs REST**:
  - API Open-Meteo Weather para dados meteorológicos
  - API Open-Meteo Air Quality para índice UV e dados de qualidade do ar
- **Bibliotecas Externas**:
  - Bootstrap 4.3.1 para estilização básica
  - Weather Icons 2.0.10 para ícones de condições climáticas

## Funcionalidades

- Design responsivo que funciona tanto em dispositivos móveis quanto em desktop
- Mudanças automáticas de fundo baseadas na hora do dia
- Indicadores de índice UV e qualidade do ar codificados por cores
- Atualização horária dos dados meteorológicos atuais
- Descrições das condições climáticas ao passar o mouse

## Endpoints da API

- Dados meteorológicos: `https://api.open-meteo.com/v1/gfs`
- Dados de qualidade do ar: `https://air-quality-api.open-meteo.com/v1/air-quality`

## Instalação

Basta clonar o repositório e abrir o arquivo index.html em seu navegador, ou hospedar os arquivos em um servidor web.