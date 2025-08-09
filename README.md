# MCP TypeScript Study - Weather Server

Um servidor MCP (Model Context Protocol) desenvolvido em TypeScript para fornecer informações meteorológicas utilizando a API do National Weather Service (NWS) dos Estados Unidos.

## 📋 Sobre o Projeto

Este projeto é um estudo prático do Model Context Protocol (MCP), implementando um servidor que oferece ferramentas para consultar:
- Alertas meteorológicos ativos por estado
- Previsões do tempo por coordenadas geográficas

O servidor utiliza a API pública do National Weather Service para fornecer dados meteorológicos precisos e atualizados.

## 🚀 Funcionalidades

### Ferramentas Disponíveis

#### `get_alerts`
Recupera alertas meteorológicos ativos para um estado específico dos EUA.

**Parâmetros:**
- `state` (string): Código do estado de 2 letras (ex: CA, NY, TX)

**Exemplo de uso:**
```
get_alerts({ state: "CA" })
```

#### `get_forecast`
Recupera a previsão do tempo para uma localização específica usando coordenadas.

**Parâmetros:**
- `latitude` (number): Latitude da localização (-90 a 90)
- `longitude` (number): Longitude da localização (-180 a 180)

**Exemplo de uso:**
```
get_forecast({ latitude: 40.7128, longitude: -74.0060 })
```

## 🛠️ Tecnologias Utilizadas

- **TypeScript 5.9+**: Linguagem principal com tipagem estática
- **@modelcontextprotocol/sdk v1.17.2**: SDK oficial do MCP para comunicação cliente-servidor
- **Zod v3.25.76**: Biblioteca para validação de esquemas e tipos em runtime
- **Node.js 18+**: Runtime de execução JavaScript
- **National Weather Service API**: API pública dos EUA para dados meteorológicos
- **ES2022**: Target de compilação para recursos modernos do JavaScript

## 🔧 Detalhes de Implementação

### Arquitetura
- **Transporte**: stdio (Standard Input/Output) para comunicação MCP
- **User-Agent**: Identificação personalizada para requisições API
- **Tratamento de Erros**: Logging detalhado e responses padronizados
- **Validação**: Schemas Zod para validação robusta de entrada

### API do National Weather Service
- **Base URL**: `https://api.weather.gov`
- **Formato**: GeoJSON para responses de alertas
- **Rate Limiting**: Respeitamos os limites da API pública
- **Cobertura**: Apenas localizações dos Estados Unidos

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/henriquerocha2004/mcp-ts-study.git
cd mcp-ts-study
```

2. Instale as dependências:
```bash
npm install
```

3. Compile o projeto:
```bash
npm run build
```

## 🎯 Como Usar

### Executando o Servidor

Após a compilação, execute o servidor:
```bash
node build/index.js
```

O servidor será executado via stdio e estará pronto para receber comandos MCP.

### Integração com Clientes MCP

Este servidor pode ser integrado com qualquer cliente compatível com MCP. Configure seu cliente para usar este servidor como um provedor de ferramentas meteorológicas.

### Exemplo de Configuração

Para usar este servidor com um cliente MCP, você pode configurá-lo assim:

```json
{
  "servers": {
    "weather": {
      "command": "node",
      "args": ["build/index.js"],
      "cwd": "/caminho/para/mcp-ts-study"
    }
  }
}
```

### Testando as Ferramentas

Você pode testar as ferramentas diretamente após iniciar o servidor:

```bash
# Exemplo de consulta de alertas
{"method": "tools/call", "params": {"name": "get_alerts", "arguments": {"state": "CA"}}}

# Exemplo de consulta de previsão
{"method": "tools/call", "params": {"name": "get_forecast", "arguments": {"latitude": 37.7749, "longitude": -122.4194}}}
```

## 📁 Estrutura do Projeto

```
mcp-ts-study/
├── src/
│   └── index.ts          # Código principal do servidor
├── build/
│   └── index.js          # Código compilado
├── package.json          # Configurações e dependências
├── tsconfig.json         # Configurações do TypeScript
├── LICENSE               # Licença do projeto
└── README.md            # Este arquivo
```

## 🔧 Scripts Disponíveis

- `npm run build`: Compila o TypeScript e torna o arquivo executável
- `npm test`: Executa os testes (ainda não implementados)

## 🏗️ Desenvolvimento

Este projeto utiliza ES Modules (ESM) e está configurado com:
- **Target**: ES2022 para recursos modernos do JavaScript
- **Module Resolution**: Node16 para compatibilidade com ES Modules
- **Strict Mode**: Habilitado para melhor qualidade de código
- **Output**: Pasta `build/` com o código JavaScript compilado

## 📋 Requisitos

- Node.js 18+ 
- TypeScript 5.9+
- Conexão com internet (para acessar a API do NWS)

## ⚠️ Limitações

- Funciona apenas com localizações dos Estados Unidos
- Depende da disponibilidade da API do National Weather Service
- Requer coordenadas precisas para previsões locais

## 🤝 Contribuindo

Este é um projeto de estudo, mas contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias
- Enviar pull requests

## 📄 Licença

Este projeto está licenciado sob a licença ISC. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🔗 Links Úteis

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [National Weather Service API](https://www.weather.gov/documentation/services-web-api)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
