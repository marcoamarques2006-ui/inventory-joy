# Inventory Joy

Sistema de estoque e gestão de produtos para um e-commerce.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cf1dcba9-974f-4cc1-b578-c30e3c56880b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Execução local

O projeto foi configurado para rodar somente na própria máquina, usando o host
`127.0.0.1` e a porta `8080`. Ele não fica exposto para outros computadores da
rede.

### Pré-requisitos

- Node.js 18 ou superior instalado.
- Git instalado para clonar o projeto.

O professor não precisa instalar Bun, banco de dados ou qualquer ferramenta adicional.
O projeto usa apenas Node.js e npm, que já acompanham a instalação do Node.js.

### Como o professor pode executar

Se o repositório estiver público no GitHub, o professor pode executar exatamente:

```powershell
git clone https://github.com/marcoamarques2006-ui/inventory-joy.git
cd inventory-joy
npm install
npm run dev
```

Depois, basta abrir `http://127.0.0.1:8080/` no navegador. O servidor fica
disponível apenas na máquina que executou o comando.

O repositório não precisa de colaboradores. Se ele estiver privado, envie ao
professor um arquivo `.zip` do projeto ou torne o repositório público; não é
necessário alterar permissões ou adicionar usuários.

### Passo a passo

1. Abra o PowerShell ou o terminal do VS Code.
2. Clone o repositório e entre na pasta:

```powershell
git clone https://github.com/marcoamarques2006-ui/inventory-joy.git
cd inventory-joy
```

3. Instale as dependências:

```powershell
npm install
```

4. Inicie o servidor local:

```powershell
npm run dev
```

5. Abra o sistema no navegador:

```text
http://127.0.0.1:8080/
```

6. Para testar o backend, acesse a API:

```text
http://127.0.0.1:8080/api/products
```

Exemplos de consultas:

```text
http://127.0.0.1:8080/api/products?name=monitor
http://127.0.0.1:8080/api/products?code=CMP-101
http://127.0.0.1:8080/api/products?sort=soldQuantity&order=desc
```

Para parar o servidor, volte ao terminal e pressione `Ctrl + C`.

### Verificação do projeto

Para gerar o build de produção localmente:

```powershell
npm run build
```

## Backend de produtos

O backend é implementado no servidor do TanStack Start e expõe `GET /api/products`.
Ele mantém 150 produtos com código (`sku`), nome, preço e quantidade vendida. São 20 registros-base e 130 registros gerados de forma determinística para permitir análises de ordenação em uma coleção maior.

Exemplos:

```text
GET /api/products
GET /api/products?name=monitor
GET /api/products?code=CMP-101
GET /api/products?sort=price&order=desc
GET /api/products?sort=soldQuantity&order=desc
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

O `POST` e o `PUT` recebem um produto sem `id` e `updatedAt` no corpo JSON. O `DELETE` responde com status `204`. Erros de validação ou SKU duplicado respondem com status `400` e uma mensagem no campo `message`.

### Algoritmos e justificativa

- **QuickSort por nome:** foi escolhido por ser eficiente para ordenar o catálogo e por atender diretamente ao requisito de ordenar nomes em ordem crescente. A complexidade média é `O(n log n)` e o pior caso é `O(n²)`.
- **Busca binária por código:** os códigos são mantidos em ordem crescente no catálogo, permitindo localizar um código em `O(log n)`. A busca por nome percorre os produtos e tem complexidade `O(n)`.

A resposta da API também informa o algoritmo, a complexidade, o tempo de execução, a quantidade de comparações e a quantidade de trocas. A tela **Produtos** consome essa API e permite alternar entre busca por nome e por código, além de exibir a lista ordenada.

## Arquitetura e manutenção

O backend segue uma arquitetura em camadas, com dependências apontando para dentro:

```text
HTTP -> server.ts -> product-controller -> product-service -> ProductRepository
												   |
												   +-> product-algorithms
```

- `src/domain/product.ts` contém os contratos estáveis do domínio: produto, filtros e resposta da busca.
- `src/backend/product-repository.ts` define a porta de persistência. A implementação atual é em memória, mas pode ser substituída por banco de dados sem alterar o serviço.
- `src/backend/product-algorithms.ts` concentra QuickSort, busca binária e ordenação numérica de forma independente do HTTP.
- `src/backend/product-service.ts` coordena a regra de negócio e mede o tempo da operação.
- `src/backend/product-controller.ts` traduz a requisição HTTP para o contrato do domínio e valida os parâmetros aceitos.
- `src/server.ts` permanece responsável apenas por integrar a API customizada ao servidor TanStack Start.

### Regra para evoluções

Novas fontes de dados devem implementar `ProductRepository`; novas formas de ordenação devem ser adicionadas em `product-algorithms.ts`; novos endpoints devem ter controllers próprios. A interface não deve acessar o repositório diretamente: ela consome somente o contrato HTTP.

Essa divisão facilita testes unitários do domínio sem servidor, substituição da persistência e evolução independente do frontend e backend.
