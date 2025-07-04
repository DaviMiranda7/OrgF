# Como Editar o Código do FinanceFlow

Este documento explica como você pode editar e personalizar o código-fonte do seu aplicativo FinanceFlow, tanto no frontend (React) quanto no backend (Flask).

## 💻 Estrutura do Projeto

O projeto está organizado em dois diretórios principais:

- `backend_flask/`: Contém o código do servidor (API) desenvolvido com Flask.
- `frontend_react/`: Contém o código da interface do usuário desenvolvido com React.

```
fintech_saas_app/
├── backend_flask/          # Backend Flask
│   ├── src/
│   │   ├── models/         # Modelos de dados (SQLAlchemy)
│   │   ├── routes/         # APIs REST (endpoints)
│   │   ├── services/       # Lógica de negócio (IA, categorização)
│   │   └── static/         # Arquivos estáticos do frontend (após o build)
│   └── venv/               # Ambiente virtual Python
├── frontend_react/         # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React (UI)
│   │   ├── pages/          # Páginas principais da aplicação
│   │   ├── services/       # Funções para comunicação com a API
│   │   ├── hooks/          # Hooks customizados
│   │   └── lib/            # Utilitários e configurações
│   └── public/             # Arquivos públicos (imagens, favicon)
│   └── dist/               # Build de produção (gerado pelo Vite)
└── COMO_EDITAR_CODIGO.md   # Este documento
└── GERENCIAR_DADOS.md      # Documento sobre gerenciamento de dados
└── DEPLOY_PRODUCAO.md      # Documento sobre deploy
└── MONETIZACAO.md          # Documento sobre monetização
```

## 🔧 Editando o Backend (Flask)

O backend é responsável pela lógica de negócio, banco de dados e APIs. Ele está localizado em `backend_flask/`.

### 1. Ambiente de Desenvolvimento

Para trabalhar no backend, você precisará de:

- **Python 3.11+**
- **Ambiente Virtual:** Já configurado em `backend_flask/venv/`.

### 2. Ativando o Ambiente Virtual

Abra um terminal e navegue até o diretório `backend_flask/`:

```bash
cd /home/ubuntu/fintech_saas_app/backend_flask
source venv/bin/activate
```

### 3. Principais Arquivos para Edição

- **`src/main.py`**: O arquivo principal da aplicação Flask. Aqui você registra os blueprints (grupos de rotas), configura o banco de dados e inicia o servidor.

  - **Para adicionar novas rotas/funcionalidades:** Crie um novo arquivo em `src/routes/` e importe-o e registre-o em `main.py`.
  - **Para configurar o banco de dados:** A conexão com o SQLite está configurada aqui. Para usar outro banco (PostgreSQL, MySQL), você precisará alterar a string de conexão `SQLALCHEMY_DATABASE_URI`.

- **`src/models/`**: Contém os modelos de dados (classes Python que representam as tabelas do banco de dados) definidos com SQLAlchemy. Cada arquivo (`user.py`, `transaction.py`, `category.py`, etc.) representa uma entidade.

  - **Para adicionar novos campos a uma tabela:** Edite o modelo correspondente e, se o banco já estiver em uso, você precisará de uma ferramenta de migração de banco de dados (como `Flask-Migrate` ou `Alembic`) para aplicar as mudanças sem perder dados.
  - **Para criar novas entidades:** Crie um novo arquivo de modelo e importe-o em `main.py` para que o SQLAlchemy possa criá-lo no banco de dados.

- **`src/routes/`**: Contém os arquivos que definem os endpoints da API (rotas). Cada arquivo (`user.py`, `transaction.py`, `ai_advisor.py`, etc.) agrupa rotas relacionadas.

  - **Para modificar uma API existente:** Edite o arquivo de rota correspondente.
  - **Para criar uma nova API:** Crie um novo arquivo de rota e registre seu `Blueprint` em `main.py`.

- **`src/services/`**: Contém a lógica de negócio mais complexa, como o serviço de categorização (`categorization_service.py`) e a integração com a IA.

  - **Para ajustar a lógica de categorização:** Edite `categorization_service.py`.
  - **Para integrar com uma IA diferente:** Você precisará modificar `ai_advisor.py` e `ai_advisor_service.py` para usar a API da nova IA.

### 4. Executando o Backend

Após fazer as alterações, você pode executar o servidor Flask (com o ambiente virtual ativado):

```bash
python -m src.main
```

O servidor estará disponível em `http://localhost:5000`.

## 🎨 Editando o Frontend (React)

O frontend é a interface do usuário que os usuários interagem. Ele está localizado em `frontend_react/`.

### 1. Ambiente de Desenvolvimento

Para trabalhar no frontend, você precisará de:

- **Node.js (versão 20.x)**
- **pnpm** (gerenciador de pacotes, já instalado no ambiente)

### 2. Instalando Dependências

Abra um terminal e navegue até o diretório `frontend_react/`:

```bash
cd /home/ubuntu/fintech_saas_app/frontend_react
pnpm install
```

### 3. Principais Arquivos para Edição

- **`src/App.jsx`**: O componente principal do React que define as rotas da aplicação (usando `react-router-dom`).

  - **Para adicionar novas páginas:** Crie um novo componente em `src/components/pages/` e adicione uma nova rota em `App.jsx`.

- **`src/components/`**: Contém todos os componentes React reutilizáveis da aplicação.

  - **`components/layout/`**: Componentes de layout (Sidebar, Header).
  - **`components/pages/`**: Componentes que representam páginas inteiras (Dashboard, Transactions, AIAdvisor, etc.).
  - **`components/auth/`**: Componentes relacionados à autenticação (Login, Register).
  - **`components/ui/`**: Componentes de interface de usuário genéricos (Button, Input, Card, etc.) construídos com Radix UI e estilizados com Tailwind CSS. Você pode personalizar o estilo aqui.

- **`src/services/api.js`**: Contém as funções que fazem requisições HTTP para o backend (usando Axios). Você precisará ajustar a `BASE_URL` se o seu backend for deployado em um domínio diferente.

  - **Para integrar novas APIs do backend:** Adicione novas funções a este arquivo para chamar os novos endpoints.

- **`src/hooks/`**: Contém hooks React customizados (ex: `use-toast.js`).

- **`src/lib/utils.js`**: Contém funções utilitárias, como `cn` para combinar classes CSS do Tailwind.

- **`public/`**: Contém arquivos estáticos que são servidos diretamente, como imagens (`ai_advisor_avatar.png`).

  - **Para alterar a imagem do avatar da IA:** Substitua o arquivo `public/images/ai_advisor_avatar.png` pela sua nova imagem.

### 4. Estilização (Tailwind CSS)

O aplicativo usa Tailwind CSS para estilização. Você pode editar o arquivo `tailwind.config.js` na raiz do `frontend_react/` para configurar cores, fontes e outros aspectos do design.

Para aplicar estilos, você pode usar classes do Tailwind diretamente nos seus componentes JSX.

### 5. Executando o Frontend

Após fazer as alterações, você pode executar o servidor de desenvolvimento do React (com o ambiente virtual ativado):

```bash
pnpm run dev
```

O aplicativo estará disponível em `http://localhost:5173`.

## 🔄 Reconstruindo e Deployando (Após Edições)

Sempre que você fizer alterações no código (tanto frontend quanto backend), você precisará reconstruir e fazer o deploy para que as mudanças apareçam na versão online.

1.  **Build do Frontend:**
    ```bash
    cd /home/ubuntu/fintech_saas_app/frontend_react
    pnpm run build
    ```
    Isso criará uma pasta `dist/` com os arquivos otimizados do seu frontend.

2.  **Copiar para o Backend:**
    ```bash
    cp -r /home/ubuntu/fintech_saas_app/frontend_react/dist/* /home/ubuntu/fintech_saas_app/backend_flask/backend_flask/src/static/
    ```
    Isso garante que o Flask sirva a versão mais recente do seu frontend.

3.  **Deploy do Backend:**
    ```bash
    # Certifique-se de estar no diretório raiz do projeto ou ajuste o caminho
    # Exemplo: se estiver em /home/ubuntu/fintech_saas_app
    service_deploy_backend(framework="flask", project_dir="/home/ubuntu/fintech_saas_app/backend_flask/backend_flask")
    ```
    Este comando irá atualizar a versão online do seu aplicativo. O URL de deploy permanecerá o mesmo, mas o conteúdo será atualizado.

Com estas instruções, você tem o conhecimento necessário para começar a personalizar e expandir seu aplicativo FinanceFlow!

