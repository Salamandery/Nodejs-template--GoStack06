## Desafio 06 Back-end nodejs GoStack

### Descrição
Aplicação feita para o desafio GoStack da rocketseat com a finalidade de criar transações que contenham um título, tipo do transação ('income' ou 'outcome'), o valor da transação e a categoria que ela pertence. Template configurado com Jest para testes automatizados que verificará se a transação é válida. :)

### Rotas
- **`POST /transactions`**: Rota de cadastro e ela deve receber os parâmetros `title`, `type` , `value` e `category` dentro do body da requisição. Exemplo: `{ title: 'Desafio Node.js', type: 'income' || 'outcome', value: 2000, category: "Curso"`;

- **`GET /transactions`**: Rota que lista todos as transações;

- **`DELETE /transactions/:id`**: Rota que deleta as transações por id;

- **`POST /transactions/import`**: Rota que faz importação de um arquivo CSV para o banco de dados com os campos title, type, value, category;


Rodolfo M F Abreu
