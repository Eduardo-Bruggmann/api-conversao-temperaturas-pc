# api-conversao-temperaturas-pc

API REST para registrar medições de temperatura de componentes de PC, converter entre Celsius, Fahrenheit e Kelvin e classificar a temperatura.

## Como rodar

1. Instale as dependências: `npm install`
2. Crie o banco executando [src/database/ddl.sql](src/database/ddl.sql) no MySQL
3. Copie `.env.example` para `.env` e ajuste as credenciais
4. Inicie: `npm start`ou `npm run dev` (com nodemon)

## Endpoints

Todos sob o prefixo `/api`.

| Método | Rota                         | Descrição                                | Sucesso |
| ------ | ---------------------------- | ---------------------------------------- | ------- |
| POST   | `/medicao`                   | Cria uma medição                         | 201     |
| GET    | `/medicao`                   | Lista todas as medições                  | 200     |
| GET    | `/medicao/temperatura-ideal` | Lista medições classificadas como ideais | 200     |
| GET    | `/medicao/:id`               | Busca uma medição                        | 200     |
| PUT    | `/medicao/:id`               | Atualiza uma medição                     | 200     |
| DELETE | `/medicao/:id`               | Remove uma medição                       | 204     |

### Corpo da requisição (POST e PUT)

```json
{
  "descricao": "CPU em carga máxima",
  "tipo": "CPU",
  "valor_original": 190,
  "unidade_original": "fahrenheit",
  "unidade_convertida": "celsius"
}
```

`valor_convertido` e `classificacao` são calculados pela API.

### Classificação (com base no valor em Celsius)

| Faixa             | Classificação              |
| ----------------- | -------------------------- |
| abaixo de 80 °C   | Temperatura Ideal          |
| de 80 °C a 105 °C | Acima da Temperatura Ideal |
| acima de 105 °C   | Limite Crítico             |

### Erros

Respostas de erro seguem o formato `{ "statusCode": 404, "message": "Medição não encontrada." }`:

- `400` — dados incompletos ou inválidos, unidade inválida, ID inválido ou JSON malformado
- `404` — medição ou rota não encontrada
- `500` — erro interno (detalhes apenas no log do servidor)
